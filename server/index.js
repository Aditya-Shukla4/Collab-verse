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
console.log(`✅ CORS Allowed Origin: ${clientURL}`);

// --- MIDDLEWARE ---
app.use(
  cors({
    origin: [clientURL, "https://collab-verse.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb" }));
app.use(passport.initialize());

// --- API Routes ---
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/collabs", collabRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);

// --- Health Check Route ---
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// --- HTTP and Socket.IO Server Setup ---
const httpServer = createServer(app);
const activeUsersByRoom = {};

const io = new Server(httpServer, {
  cors: {
    origin: [clientURL, "https://collab-verse.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// --- SOCKET.IO LOGIC ---
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("join_project_room", ({ projectId, user }) => {
    try {
      if (!user || !projectId) {
        console.warn("Missing user or projectId in join_project_room");
        return;
      }

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
    } catch (error) {
      console.error("Error in join_project_room:", error);
    }
  });

  socket.on("send_message", (data) => {
    try {
      if (!data || !data.projectId) return;
      socket.to(data.projectId).emit("receive_message", data);
    } catch (error) {
      console.error("Error in send_message:", error);
    }
  });

  socket.on("code_change", (data) => {
    try {
      if (!data || !data.projectId) return;
      socket.to(data.projectId).emit("receive_code_change", data.newCode);
    } catch (error) {
      console.error("Error in code_change:", error);
    }
  });

  socket.on("save_code", async ({ projectId, newCode, language }) => {
    try {
      if (!projectId) {
        console.warn("Missing projectId in save_code");
        return;
      }

      await Project.findByIdAndUpdate(projectId, {
        codeContent: newCode,
        codeLanguage: language,
      });

      console.log(
        `✅ Code saved for project ${projectId} (Language: ${language})`
      );

      // Notify all users in the room
      io.in(projectId).emit("code_saved_success", {
        message: "Code saved successfully",
      });
    } catch (error) {
      console.error("Error saving code to DB:", error);
      socket.emit("code_save_error", { message: "Failed to save code" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);

    try {
      for (const projectId in activeUsersByRoom) {
        if (activeUsersByRoom[projectId].has(socket.id)) {
          activeUsersByRoom[projectId].delete(socket.id);
          const usersInRoom = Array.from(activeUsersByRoom[projectId].values());
          io.in(projectId).emit("room_users_update", usersInRoom);

          // Clean up empty rooms
          if (activeUsersByRoom[projectId].size === 0) {
            delete activeUsersByRoom[projectId];
          }
          break;
        }
      }
    } catch (error) {
      console.error("Error in disconnect handler:", error);
    }
  });

  // Handle socket errors
  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
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

// --- Graceful Shutdown ---
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  httpServer.close(() => {
    console.log("HTTP server closed");
    mongoose.connection.close();
    process.exit(0);
  });
});
