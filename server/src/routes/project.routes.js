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

// 💥 SPY - This message MUST appear in your server terminal when it starts
console.log("--- CORRECTED PROJECT ROUTES (V2) IS RUNNING ---");

const router = express.Router();

// --- SPECIFIC ROUTES ALWAYS COME FIRST ---
router.route("/my-projects").get(protect, getMyProjects);
router.route("/accept-invite/:id").put(protect, acceptProjectInvite);
router.route("/reject-invite/:id").delete(protect, rejectProjectInvite);

// --- General Root Route ---
router.route("/").post(protect, createProject).get(getProjects);

// --- DYNAMIC ROUTES COME LAST ---
router.route("/:id/invite").post(protect, inviteToProject);
router.route("/:id/request-join").post(protect, requestToJoinProject);
router.route("/:id/accept-join/:userId").put(protect, acceptJoinRequest);
router.route("/:id/reject-join/:userId").delete(protect, rejectJoinRequest);

// The most general dynamic route is absolutely last.
router
  .route("/:id")
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

export default router;
