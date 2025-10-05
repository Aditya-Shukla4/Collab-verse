// FINAL CODE FOR: server/src/config/passport-setup.js

import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://collab-verse-server.onrender.com/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user exists with this GitHub ID
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user); // User found, log them in
        }

        // 2. If not, check if a user exists with the same email
        const email = profile.emails && profile.emails[0].value;
        if (email) {
          user = await User.findOne({ email: email });
          if (user) {
            // User found via email, link their GitHub ID and log them in
            user.githubId = profile.id;
            // Optionally, update their avatar/name from GitHub if they are empty
            if (!user.avatarUrl) {
              user.avatarUrl = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
          }
        }

        // 3. If no user found, create a new user
        const newUser = new User({
          githubId: profile.id,
          name: profile.displayName || profile.username, // Correctly uses 'name'
          email: email,
          avatarUrl: profile.photos[0].value,
          // We don't provide a password, which is fine because our schema has 'required: false'
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://collab-verse-server.onrender.com/api/auth/google/callback", // Relative URL bhi chalega
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check karo ki kya user Google ID se exist karta hai
        let user = await User.findOne({ googleId: profile.id }); // NOTE: iske liye model update karna padega

        if (user) {
          return done(null, user);
        }

        const email = profile.emails && profile.emails[0].value;
        if (email) {
          user = await User.findOne({ email: email });
          if (user) {
            // User email se mil gaya, uski Google ID link kar do
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          }
        }

        // Naya user banao
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: email,
          avatarUrl: profile.photos[0].value,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);
