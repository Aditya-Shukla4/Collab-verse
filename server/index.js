// server/index.js

// ==========================================

// Now, import the rest of your modules
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";

// Import your routes
import testRoutes from "./src/routes/test.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import projectRoutes from "./src/routes/project.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import collabRoutes from "./src/routes/collab.routes.js";
import "./src/config/passport.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use("/api/collabs", collabRoutes);
app.use(express.json());
app.use(passport.initialize());

// API Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
