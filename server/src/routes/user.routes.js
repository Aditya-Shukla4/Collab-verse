// server/src/routes/user.routes.js

import express from "express";

import {
  getMyProfile,
  updateUserProfile,
  getUserById,
  searchUsers,
} from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rule #1: Handle the universal search.
// Catches GET /api/users and GET /api/users?query=...
router.get("/", protect, searchUsers);

// Rule #2: Handle the specific, static route for the logged-in user's profile FIRST.
router.get("/me", protect, getMyProfile);

// Rule #3: Handle profile updates.
router.put("/profile", protect, updateUserProfile);

// Rule #4: NOW, handle the dynamic route for any other user's profile LAST.
// This will only run if the path is not "/me".
router.get("/:id", protect, getUserById);

export default router;
