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
// GET    /api/collabs/invitations/pending   (Get all my pending project invites)
// PUT    /api/collabs/invitations/:id/accept  (Accept a specific project invite)
// DELETE /api/collabs/invitations/:id/reject  (Reject a specific project invite)
router.route("/invitations/pending").get(protect, getPendingInvitations);
router.route("/invitations/:id/accept").put(protect, acceptProjectInvite);
router.route("/invitations/:id/reject").delete(protect, rejectProjectInvite);

// --- COLLEAGUE (DOSTI) REQUEST ROUTES ---
// GET    /api/collabs/requests/received   (Get all my pending friend requests)
// POST   /api/collabs/requests/:userId/send     (Send a friend request to a user)
// PUT    /api/collabs/requests/:userId/accept   (Accept a friend request from a user)
// DELETE /api/collabs/requests/:userId/reject   (Reject a friend request from a user)
router.route("/requests/received").get(protect, getReceivedRequests);
router.route("/requests/:userId/send").post(protect, sendCollabRequest);
router.route("/requests/:userId/accept").put(protect, acceptCollabRequest);
router.route("/requests/:userId/reject").delete(protect, rejectCollabRequest);

export default router;
