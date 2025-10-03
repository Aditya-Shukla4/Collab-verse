// server/index.js

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import { createServer } from "http";
import { Server } from "socket.io";

// Import your routes
import userRoutes from "./src/routes/user.routes.js";
import projectRoutes from "./src/routes/project.routes.js";
import collabRoutes from "./src/routes/collab.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import Project from "./src/models/project.model.js";
import "./src/config/passport.js";

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORRECT MIDDLEWARE ORDER ---
// General purpose middlewares should be registered first.
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json()); // <-- Moved up
app.use(passport.initialize());

// --- API Routes ---
// All API routes should be registered after the general middlewares.
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/collabs", collabRoutes);
app.use("/api/auth", authRoutes);

// --- HTTP and Socket.IO Server Setup ---
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("join_project_room", (projectId) => {
    socket.join(projectId);
    console.log(`👍 Client ${socket.id} joined room: ${projectId}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.projectId).emit("receive_message", data);
  });

  socket.on("code_change", (data) => {
    socket.to(data.projectId).emit("receive_code_change", data.newCode);
  });

  socket.on("save_code", async ({ projectId, newCode }) => {
    try {
      await Project.findByIdAndUpdate(projectId, { codeContent: newCode });
      console.log(`✅ Code saved for project: ${projectId}`);
    } catch (error) {
      console.error("Error saving code:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// --- Database Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// --- Server Start ---
httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server is running on port ${PORT} and listening for WebSocket connections.`
  );
});
