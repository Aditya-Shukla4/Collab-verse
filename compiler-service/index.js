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
const PORT = process.env.PORT || 6001; // Using the safe port

// Middleware
app.use(cors()); // Basic CORS for HTTP health checks if needed

// --- HTTP SERVER and WEBSOCKET SERVER ---
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allows connection from any origin
    methods: ["GET", "POST"],
  },
});

// --- SOCKET.IO LOGIC FOR TERMINAL ---
io.on("connection", (socket) => {
  console.log(`🔌 New TERMINAL client connected: ${socket.id}`);

  socket.on("terminal:join", (projectId) => {
    console.log(
      `🔗 Client ${socket.id} requested terminal for room: ${projectId}`
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

// A simple health check route to verify the server is running
app.get("/", (req, res) => {
  res.send("Compiler & Terminal Service is running.");
});

// Start listening on the httpServer which includes both Express and Socket.IO
httpServer.listen(PORT, () => {
  console.log(
    `[MICROSERVICE] Compiler & Terminal Service running on port ${PORT}`
  );
});
