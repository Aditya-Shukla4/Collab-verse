// server/src/routes/collab.routes.js

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getPendingInvitations } from "../controllers/collab.controller.js";

import {
  sendCollabRequest,
  acceptCollabRequest,
  rejectCollabRequest,
  getReceivedRequests, // <--- 1. IMPORT THE NEW FUNCTION
} from "../controllers/collab.controller.js";

const router = express.Router();

// --- Collaboration Request Routes ---

// ADD THIS NEW ROUTE
router.get("/received", protect, getReceivedRequests);

router.post("/send-request/:userId", protect, sendCollabRequest);
router.put("/accept-request/:userId", protect, acceptCollabRequest);
router.delete("/reject-request/:userId", protect, rejectCollabRequest);
router.route("/invitations/pending").get(protect, getPendingInvitations);

export default router;
