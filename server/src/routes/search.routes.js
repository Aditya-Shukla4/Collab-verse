// server/src/routes/search.routes.js
import express from "express";
import { searchAll } from "../controllers/search.controller.js";
import { protect } from "../middleware/auth.middleware.js"; // Protect the route

const router = express.Router();

router.get("/all", protect, searchAll);

export default router;
