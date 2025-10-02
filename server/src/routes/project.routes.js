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
} from "../controllers/project.controller.js";

const router = express.Router();

// --- CORRECT ROUTE ORDER ---

// 1. Put the most specific text-based routes first.
router.route("/my-projects").get(protect, getMyProjects);

// 2. Then, handle the general root routes.
router.route("/").post(protect, createProject).get(getProjects);

// 3. Put dynamic routes with one parameter after.
router
  .route("/:id")
  .get(getProjectById)
  .delete(protect, deleteProject)
  .put(protect, updateProject);

// 4. Put the most complex dynamic routes last.
router.route("/:id/request-join").post(protect, requestToJoinProject);

router.route("/:id/accept-join/:userId").put(protect, acceptJoinRequest);

router.route("/:id/reject-join/:userId").delete(protect, rejectJoinRequest);

export default router;
