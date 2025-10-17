import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  getMyProjects,
  updateProject,
  deleteProject,
  inviteToProject,
  requestToJoinProject,
  acceptJoinRequest,
  rejectJoinRequest,
} from "../controllers/project.controller.js";

const router = express.Router();

// --- SPECIFIC ROUTES FIRST (before :id) ---
router.route("/my-projects").get(protect, getMyProjects);

// --- GENERAL ROOT ROUTE ---
router.route("/").post(protect, createProject).get(getProjects);

// --- DYNAMIC ROUTES LAST ---
router.route("/:id/invite").post(protect, inviteToProject);
router.route("/:id/request-join").post(protect, requestToJoinProject);
router.route("/:id/accept-join/:userId").put(protect, acceptJoinRequest);
router.route("/:id/reject-join/:userId").delete(protect, rejectJoinRequest);
router
  .route("/:id")
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

export default router;
