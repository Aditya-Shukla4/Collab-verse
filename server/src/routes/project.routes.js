// server/src/routes/project.routes.js

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createProject,
  getProjects,
} from "../controllers/project.controller.js";

const router = express.Router();

// Create project - Protected (must be logged in)
router.post("/", protect, createProject);

// Get all projects - Public (anyone can view)
router.get("/", getProjects);

export default router;
