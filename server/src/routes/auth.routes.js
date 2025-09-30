// server/src/routes/auth.routes.js

import express from "express";
import passport from "passport";
import { protect } from "../middleware/auth.middleware.js";

import {
  register,
  login,
  githubCallback,
  getMyProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Local Auth
router.post("/register", register);
router.post("/login", login);

// GitHub Auth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:3000/LoginPage",
    session: false,
  }),
  githubCallback // Use the imported function directly
);

// Google Auth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/LoginPage",
    session: false,
  }),
  githubCallback // --- THIS IS THE FIX --- Use the same function directly
);

router.get("/profile", protect, getMyProfile);

export default router;
