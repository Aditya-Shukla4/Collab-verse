import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  createTerminal,
  writeToTerminal,
  killTerminalOnDisconnect,
} from "./terminalService.js";

const app = express();
const PORT = process.env.PORT || 6001;

app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 New TERMINAL client connected: ${socket.id}`);

  socket.on("terminal:join", (projectId) => {
    console.log(
      `🔗 Client ${socket.id} requested terminal for room: ${projectId}`,
    );
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

app.get("/", (req, res) => {
  res.send("Compiler & Terminal Service is running.");
});

httpServer.listen(PORT, () => {
  console.log(
    `[MICROSERVICE] Compiler & Terminal Service running on port ${PORT}`,
  );
});
