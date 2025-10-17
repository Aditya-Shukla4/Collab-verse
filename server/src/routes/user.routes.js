import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getMyProfile,
  updateUserProfile,
  getUserById,
  getMyColleagues,
  getMyNotifications,
  searchUsers,
  searchForInvite,
} from "../controllers/user.controller.js";

const router = express.Router();

// ----------------------------------------------------------------
// 💥 ASLI FIX YAHAN HAI: ROUTES KA SAHI ORDER 💥
// Express upar se neeche check karta hai. Isliye, hamesha specific
// text-wale routes (jaise '/me', '/search') ko dynamic, variable
// wale routes (jaise '/:id') se UPAR rakhte hain.
// ----------------------------------------------------------------

// --- SPECIFIC ROUTES FIRST ---
// Yeh routes hardcoded text pe depend karte hain.
router.route("/me").get(protect, getMyProfile);
router.route("/me").put(protect, updateUserProfile); // Update route is now also specific to /me
router.route("/me/colleagues").get(protect, getMyColleagues);
router.route("/me/notifications").get(protect, getMyNotifications);
router.route("/search").get(protect, searchUsers); // Tera purana dashboard search
router.route("/search-for-invite").get(protect, searchForInvite); // Naya invite search

// --- DYNAMIC ROUTE LAST ---
// Yeh route variable (`:id`) pe depend karta hai. Isko sabse neeche rakho.
// Agar isko upar rakha, toh yeh '/me' ko ek ID samajh lega aur galat function chala dega.
router.route("/:id").get(protect, getUserById);

export default router;
