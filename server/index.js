// server/index.js (COMPLETE AND CORRECTED FILE)
// This the dirty comment to make the server dirty

import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";

// Assuming you have this local executor for JavaScript
import { executeCode } from "./src/services/compilerService.js";

// Import your routes
import userRoutes from "./src/routes/user.routes.js";
import projectRoutes from "./src/routes/project.routes.js";
import collabRoutes from "./src/routes/collab.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import Project from "./src/models/project.model.js";
import "./src/config/passport.js";
import searchRoutes from "./src/routes/search.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

const clientURL = process.env.CLIENT_URL || "http://localhost:3000";
console.log(`CORS Allowed Origin: ${clientURL}`);

// --- MIDDLEWARE ---
// This single cors setup is cleaner
app.use(
  cors({
    origin: [
      clientURL,
      "https://collab-verse.vercel.app", // Keep this for production
    ],
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
const io = new Server(httpServer, {
  cors: {
    origin: clientURL,
    methods: ["GET", "POST"],
  },
});

// --- SOCKET.IO LOGIC ---
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

  socket.on("save_code", async ({ projectId, newCode, language }) => {
    try {
      await Project.findByIdAndUpdate(projectId, {
        codeContent: newCode,
        language: language,
      });
      console.log(
        `✅ Code and language ('${language}') saved for project: ${projectId}`
      );
    } catch (error) {
      console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.error("!!!!!!!!! ERROR SAVING CODE TO DB !!!!!!!");
      console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.error(error);
    }
  });

  // MULTI-LANGUAGE COMPILER HANDLER
  socket.on("execute_code", async ({ projectId, code, input, language }) => {
    console.log(
      `[COMPILER RELAY] Received code for ${language} in project ${projectId}`
    );
    let executionResult;

    try {
      if (language === "javascript") {
        executionResult = executeCode(code, input);
      } else {
        const microserviceUrl = `${process.env.COMPILER_API_URL}/api/run`;
        const response = await axios.post(microserviceUrl, {
          code,
          input,
          language,
        });
        executionResult = response.data;
      }
      socket.emit("code_execution_result", executionResult);
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.error ||
          `Microservice Error (${error.response.status})`
        : `Network Error: Could not reach compiler service. Is it running on port 6000?`;
      socket.emit("code_execution_result", { error: errorMessage });
      console.error("Microservice relay failed:", errorMessage);
    }
  }); // <-- THIS WAS THE MISSING PART

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// --- Database Connection Function ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit process with failure
  }
};

// --- Server Start ---
httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server is running on port ${PORT} and listening for WebSocket connections.`
  );
  connectDB();
});
