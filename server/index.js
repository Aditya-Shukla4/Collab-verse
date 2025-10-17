import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import { createServer } from "http";
import { Server } from "socket.io";

// Route Imports
import userRoutes from "./src/routes/user.routes.js";
import projectRoutes from "./src/routes/project.routes.js";
import collabRoutes from "./src/routes/collab.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import searchRoutes from "./src/routes/search.routes.js";
import Project from "./src/models/project.model.js";
import "./src/config/passport.js";

const app = express();
const PORT = process.env.PORT || 5000;

const clientURL = process.env.CLIENT_URL || "http://localhost:3000";
console.log(`CORS Allowed Origin: ${clientURL}`);

// --- MIDDLEWARE ---
app.use(
  cors({
    origin: [clientURL, "https://collab-verse.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

// --- API Routes ---
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/collabs", collabRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);

// --- HTTP and Socket.IO Server Setup ---
const httpServer = createServer(app);
const activeUsersByRoom = {};
const io = new Server(httpServer, {
  cors: {
    origin: clientURL,
    methods: ["GET", "POST"],
  },
});

// --- SOCKET.IO LOGIC ---
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("join_project_room", ({ projectId, user }) => {
    if (!user) return;
    socket.join(projectId);
    console.log(
      `👍 Client ${socket.id} (${user.name}) joined room: ${projectId}`
    );
    if (!activeUsersByRoom[projectId]) {
      activeUsersByRoom[projectId] = new Map();
    }
    activeUsersByRoom[projectId].set(socket.id, user);
    const usersInRoom = Array.from(activeUsersByRoom[projectId].values());
    io.in(projectId).emit("room_users_update", usersInRoom);
  });

  socket.on("send_message", (data) => {
    socket.to(data.projectId).emit("receive_message", data);
  });

  socket.on("code_change", (data) => {
    socket.to(data.projectId).emit("receive_code_change", data.newCode);
  });

  socket.on("save_code", async ({ projectId, newCode, language }) => {
    try {
      await Project.findByIdAndUpdate(projectId, {
        codeContent: newCode,
        codeLanguage: language,
      });
      console.log(
        `✅ Code and language ('${language}') saved for project: ${projectId}`
      );
    } catch (error) {
      console.error("Error saving code to DB:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    for (const projectId in activeUsersByRoom) {
      if (activeUsersByRoom[projectId].has(socket.id)) {
        activeUsersByRoom[projectId].delete(socket.id);
        const usersInRoom = Array.from(activeUsersByRoom[projectId].values());
        io.in(projectId).emit("room_users_update", usersInRoom);
        break;
      }
    }
  });
});

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  }
};

// --- Server Start ---
const startServer = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();
