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

router.route("/me").get(protect, getMyProfile);
router.route("/me").put(protect, updateUserProfile);
router.route("/me/colleagues").get(protect, getMyColleagues);
router.route("/me/notifications").get(protect, getMyNotifications);
router.route("/search").get(protect, searchUsers);
router.route("/search-for-invite").get(protect, searchForInvite);

router.route("/:id").get(protect, getUserById);

export default router;
