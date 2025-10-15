import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getMyProfile,
  updateUserProfile,
  getUserById,
  getMyColleagues,
  getMyNotifications,
  searchUsers,
  searchForInvite, // Naya wala import
} from "../controllers/user.controller.js";

const router = express.Router();

// 💥 FIX IS HERE: SABSE PEHLE SPECIFIC ROUTES 💥
// Yeh routes hardcoded text pe depend karte hain, isliye inko upar rakho.
router.route("/me").get(protect, getMyProfile);
router.route("/me/colleagues").get(protect, getMyColleagues);
router.route("/me/notifications").get(protect, getMyNotifications);
router.route("/search").get(protect, searchUsers); // Tera purana search
router.route("/search-for-invite").get(protect, searchForInvite); // Naya invite search

// --- AAKHIR ME DYNAMIC ROUTE ---
// Yeh route variable (:id) pe depend karta hai, isliye isko sabse neeche rakho.
router.route("/:id").get(protect, getUserById);

// Update route - yeh /me/update jaisa bhi ho sakta hai, but for now this works
router.route("/").put(protect, updateUserProfile);

export default router;
