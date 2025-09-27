// server/src/routes/auth.routes.js

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

// === Local Authentication Routes ===
router.post("/register", register);
router.post("/login", login);

// === GitHub Authentication Routes ===

// This route starts the GitHub login process
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);

// GitHub redirects the user back to this route
router.get(
  "/github/callback",
  passport.authenticate("github", {
    // This line is updated to point to the frontend login page on failure
    failureRedirect: "http://localhost:3000/LoginPage",
    session: false,
  }),
  (req, res) => {
    // On successful authentication, create a JWT token
    const payload = {
      user: {
        id: req.user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Redirect the user to the frontend homepage with the token in the URL
    res.redirect(`http://localhost:3000/?token=${token}`);
  }
);

export default router;
