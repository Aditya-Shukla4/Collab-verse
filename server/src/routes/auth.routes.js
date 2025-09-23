import express from "express";

import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", (req, res) => {
  res.send("Login route is working!");
});

export default router;
