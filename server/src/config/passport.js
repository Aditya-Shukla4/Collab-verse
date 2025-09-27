// server/src/config/passport.js

import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        "http://localhost:5000/api/auth/github/callback",
      scope: ["user:email"], // User se email maangne ke liye
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check karo ki kya user pehle se GitHub ID se exist karta hai
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user); // User mil gaya, login karwa do
        }

        // 2. Agar nahi, toh check karo ki kya user email se exist karta hai
        const email = profile.emails && profile.emails[0].value;
        if (email) {
          user = await User.findOne({ email: email });
          if (user) {
            // User email se mil gaya, uski profile ko GitHub ID se link kar do
            user.githubId = profile.id;
            await user.save();
            return done(null, user);
          }
        }

        // 3. Agar user kahin se nahi mila, toh naya user banao
        const newUser = new User({
          githubId: profile.id,
          username: profile.username, // GitHub ka username use kar rahe hain
          name: profile.displayName || profile.username,
          email: email,
          // Password ki zaroorat nahi hai kyunki woh GitHub se login kar raha hai
          // NOTE: Model mein password 'required' hai, isko handle karna padega
        });

        // Naye user ko save karo
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);
