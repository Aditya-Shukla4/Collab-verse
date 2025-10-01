import express from "express";
import { protect } from "../middleware/auth.middleware.js";

// Controller functions jo humne 'collab.controller.js' mein banaye the
import {
  sendCollabRequest,
  acceptCollabRequest,
  rejectCollabRequest,
} from "../controllers/collab.controller.js";

const router = express.Router();

// --- Collaboration Request Routes ---

// Route to send a request to another user
// Example: POST /api/collabs/send-request/USER_ID_OF_PERSON_TO_ADD
router.post("/send-request/:userId", protect, sendCollabRequest);

// Route to accept a received request
// Example: PUT /api/collabs/accept-request/USER_ID_WHO_SENT_THE_REQUEST
router.put("/accept-request/:userId", protect, acceptCollabRequest);

// Route to reject a received request OR cancel a sent request
// Example: DELETE /api/collabs/reject-request/USER_ID_OF_OTHER_PERSON
router.delete("/reject-request/:userId", protect, rejectCollabRequest);

export default router;
