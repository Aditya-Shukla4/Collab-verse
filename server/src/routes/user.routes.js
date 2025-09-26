import express from "express";
import authMiddleware from "../middleware/auth.middleware.js"; // Bouncer zaroori hai
import {
  getMyProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

// Route 1: Apni profile dekhne ke liye (VVIP pass zaroori hai)
// GET /api/users/me
router.get("/me", authMiddleware, getMyProfile);

// Route 2: Apni profile update karne ke liye (VVIP pass zaroori hai)
// PUT /api/users/profile
router.put("/profile", authMiddleware, updateUserProfile);

export default router;
