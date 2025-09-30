import express from "express";
import { protect } from "../middleware/auth.middleware.js"; // <-- YAHAN SE 'protect' AAYA
import {
  createProject,
  getProjects,
} from "../controllers/project.controller.js";

const router = express.Router();

// TOH YAHAN 'protect' HI USE KARNA HAI ✅
router.post("/", protect, createProject);
router.get("/", protect, getProjects);

export default router;
