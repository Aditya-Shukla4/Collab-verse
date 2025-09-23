// server/src/routes/auth.routes.js

import express from "express";
import { register, login } from "../controllers/auth.controller.js"; // <-- Ab 'login' ko bhi import kar rahe hain

const router = express.Router();

router.post("/register", register);
router.post("/login", login); // <-- Placeholder ki jagah asli 'login' function daal diya

export default router;
