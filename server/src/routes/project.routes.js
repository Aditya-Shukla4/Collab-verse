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
  getMyProjects,
  deleteProject,
  updateProject,
  inviteToProject,
  acceptProjectInvite,
  rejectProjectInvite,
} from "../controllers/project.controller.js";

const router = express.Router();

// --- Specific Text-Based Routes First ---
router.route("/my-projects").get(protect, getMyProjects);

// --- General Root Routes ---
router.route("/").post(protect, createProject).get(getProjects);

// --- Invite Acceptance/Rejection (User-centric) ---
// These don't depend on a project ID in the same way, so they can be specific.
router.route("/accept-invite/:id").put(protect, acceptProjectInvite);
router.route("/reject-invite/:id").delete(protect, rejectProjectInvite);

// --- Dynamic Routes with One Parameter ---
router
  .route("/:id")
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

// --- Complex Dynamic Routes Last ---
router.route("/:id/request-join").post(protect, requestToJoinProject);

router.route("/:id/accept-join/:userId").put(protect, acceptJoinRequest);

router.route("/:id/reject-join/:userId").delete(protect, rejectJoinRequest);

router.route("/:id/invite/:userId").post(protect, inviteToProject);

export default router;
