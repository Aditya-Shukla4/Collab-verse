import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import testRoutes from "./src/routes/test.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import projectRoutes from "./src/routes/project.routes.js";
import userRoutes from "./src/routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== YEH HAI HAMARA ULTIMATE CCTV CAMERA =====
// Yeh har request ko, CORS se bhi pehle, record karega.
app.use((req, res, next) => {
  console.log("\n\n=====================================");
  console.log(`➡️  INCOMING REQUEST: ${req.method} ${req.originalUrl}`);
  console.log("HEADERS:", req.headers);
  console.log("=====================================\n\n");
  next();
});

// Bulletproof CORS config (yeh wahi hai)
const corsOptions = {
  origin: "http://localhost:3000",
  allowedHeaders: ["Content-Type", "x-auth-token"],
  exposedHeaders: ["x-auth-token"],
};
app.use(cors(corsOptions));

// Baaki ka Middleware
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// API Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
