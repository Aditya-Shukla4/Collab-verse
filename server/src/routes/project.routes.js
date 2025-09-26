import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createProject,
  getProjects,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getProjects);

export default router;
