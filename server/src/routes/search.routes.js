
import express from "express";
import { searchAll } from "../controllers/search.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/all", protect, searchAll);

export default router;
