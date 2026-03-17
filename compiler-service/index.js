import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  createTerminal,
  writeToTerminal,
  killTerminalOnDisconnect,
} from "./terminalService.js";
import {
  runPython,
  runCpp,
  runC,
  runJava,
  runGo,
  runPhp,
  runRust,
} from "./executionService.js";

const app = express();
const PORT = process.env.PORT || 6001;

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// ── HTTP: run code ──────────────────────────────────────────────
app.post("/run", async (req, res) => {
  const { language, code, input = "" } = req.body;
  if (!language || !code) {
    return res.status(400).json({ error: "language and code are required." });
  }
  try {
    let result;
    switch (language) {
      case "python":
        result = await runPython(code, input);
        break;
      case "cpp":
        result = await runCpp(code, input);
        break;
      case "c":
        result = await runC(code, input);
        break;
      case "java":
        result = await runJava(code, input);
        break;
      case "go":
        result = await runGo(code, input);
        break;
      case "php":
        result = await runPhp(code, input);
        break;
      case "rust":
        result = await runRust(code, input);
        break;
      case "javascript": {
        // Node.js — run directly
        const { exec } = await import("child_process");
        const { promises: fs } = await import("fs");
        const path = await import("path");
        const tmpFile = path.join(
          process.cwd(),
          "temp_code",
          `${Date.now()}.js`,
        );
        await fs.mkdir(path.join(process.cwd(), "temp_code"), {
          recursive: true,
        });
        await fs.writeFile(tmpFile, code);
        result = await new Promise((resolve) => {
          exec(
            `node "${tmpFile}"`,
            { timeout: 5000 },
            async (err, stdout, stderr) => {
              await fs.unlink(tmpFile).catch(() => {});
              if (err) resolve({ error: stderr || err.message });
              else resolve({ result: stdout.trim() });
            },
          );
        });
        break;
      }
      default:
        return res
          .status(400)
          .json({ error: `Unsupported language: ${language}` });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Execution failed." });
  }
});

// ── Socket.io: terminal ─────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`🔌 New TERMINAL client connected: ${socket.id}`);

  socket.on("terminal:join", (projectId) => {
    console.log(`🔗 Client ${socket.id} joined room: ${projectId}`);
    socket.join(projectId);
    createTerminal(projectId, io);
  });

  socket.on("terminal:write", ({ projectId, data }) => {
    writeToTerminal(projectId, data);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 TERMINAL client disconnected: ${socket.id}`);
    killTerminalOnDisconnect(socket, io);
  });
});

app.get("/", (req, res) => res.send("Compiler & Terminal Service is running."));

httpServer.listen(PORT, () => {
  console.log(
    `[MICROSERVICE] Compiler & Terminal Service running on port ${PORT}`,
  );
});
