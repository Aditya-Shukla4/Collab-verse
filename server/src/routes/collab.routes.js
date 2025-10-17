import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  // Project Invitation Functions
  getPendingInvitations,
  acceptProjectInvite,
  rejectProjectInvite,

  // Colleague (Dosti) Functions
  sendCollabRequest,
  acceptCollabRequest,
  rejectCollabRequest,
  getReceivedRequests,
} from "../controllers/collab.controller.js";

const router = express.Router();

// --- PROJECT INVITATION ROUTES ---
router.route("/invitations/pending").get(protect, getPendingInvitations);
router.route("/invitations/:id/accept").put(protect, acceptProjectInvite);
router.route("/invitations/:id/reject").delete(protect, rejectProjectInvite);

// --- COLLEAGUE (DOSTI) REQUEST ROUTES ---
router.route("/requests/received").get(protect, getReceivedRequests);
router.route("/requests/:userId/send").post(protect, sendCollabRequest);
router.route("/requests/:userId/accept").put(protect, acceptCollabRequest);
router.route("/requests/:userId/reject").delete(protect, rejectCollabRequest);

export default router;
