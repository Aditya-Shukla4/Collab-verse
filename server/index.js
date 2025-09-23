import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ===== Routes ko import kar rahe hain =====
import testRoutes from "./src/routes/test.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import projectRoutes from "./src/routes/project.routes.js"; // <-- NAYE DEPARTMENT KO IMPORT KIYA

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database se connect karo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// ===== API Routes =====
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes); // <-- RECEPTIONIST KO NAYA ADDRESS BATA DIYA

// Server ko start karo
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
