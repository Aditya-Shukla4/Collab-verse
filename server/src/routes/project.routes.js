import express from "express";
import authMiddleware from "../middleware/auth.middleware.js"; // <-- Apne Bouncer ko import kiya
import {
  createProject,
  getProjects,
} from "../controllers/project.controller.js"; // <-- In officers ko hum agle step mein banayenge

const router = express.Router();

// ===== YAHI HAI ASLI JAADU =====

// Route 1: Naya project banane ke liye
// Path: POST /api/projects/
// Is route pe pehle Bouncer (authMiddleware) aayega, VVIP pass check karega.
// Agar pass aacha hai, tabhi woh request ko aage createProject waale officer ke paas jaane dega.
router.post("/", authMiddleware, createProject);

// Route 2: Logged-in user ke saare projects laane ke liye
// Path: GET /api/projects/
// Is route pe bhi pehle Bouncer aayega. Bina pass ke, koi projects nahi dekh sakta.
router.get("/", authMiddleware, getProjects);

export default router;
