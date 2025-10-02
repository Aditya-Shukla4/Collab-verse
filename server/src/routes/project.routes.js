// server/src/routes/project.routes.js

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  requestToJoinProject,
  acceptJoinRequest,
  rejectJoinRequest,
} from "../controllers/project.controller.js";

const router = express.Router();

// Routes for creating and getting all projects
router.route("/").post(protect, createProject).get(getProjects);

// Route for getting a single project
router.route("/:id").get(getProjectById);

// --- New Join Request Routes ---

// Route for a user to request to join a project
router.route("/:id/request-join").post(protect, requestToJoinProject);

// Route for a project owner to accept a user's request
router.route("/:id/accept-join/:userId").put(protect, acceptJoinRequest);

// Route for a project owner to reject a user's request
router.route("/:id/reject-join/:userId").delete(protect, rejectJoinRequest);

export default router;
