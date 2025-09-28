// server/src/routes/user.routes.js

import express from "express";
import {
  getMyProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js"; // <-- THIS LINE WAS MISSING

const router = express.Router();

// @route   GET api/users
// @desc    Get all users for the dashboard
// @access  Private
router.get("/", auth, getAllUsers);

// @route   GET api/users/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, getMyProfile);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, updateUserProfile);

// @route   GET api/users/:id
// @desc    Get a user profile by ID
// @access  Private
router.get("/:id", auth, getUserById); // This line now works because 'auth' is imported

export default router;
