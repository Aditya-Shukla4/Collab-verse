// server/src/routes/user.routes.js

import express from "express";
import {
  getMyProfile,
  updateUserProfile,
  getUserById,
  searchUsers,
  getMyColleagues,
  getMyProjectInvites, // Ab yeh use ho raha hai
  getMyNotifications,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Universal search for users
router.get("/", protect, searchUsers);

// Routes for the logged-in user ('/me')
router.route("/me").get(protect, getMyProfile).put(protect, updateUserProfile); // Sahi tareeka

router.get("/me/colleagues", protect, getMyColleagues);
router.get("/me/notifications", protect, getMyNotifications);
router.get("/me/invites", protect, getMyProjectInvites); // Naya route

// Route for fetching any user's public profile (MUST be last)
router.get("/:id", protect, getUserById);

export default router;
