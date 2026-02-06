import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        "https://collab-verse-server.onrender.com/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user);
        }

        const email = profile.emails && profile.emails[0].value;
        if (email) {
          user = await User.findOne({ email: email });
          if (user) {
            user.githubId = profile.id;
            if (!user.avatarUrl) {
              user.avatarUrl = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
          }
        }

        const newUser = new User({
          githubId: profile.id,
          name: profile.displayName || profile.username,
          email: email,
          avatarUrl: profile.photos[0].value,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://collab-verse-server.onrender.com/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        const email = profile.emails && profile.emails[0].value;
        if (email) {
          user = await User.findOne({ email: email });
          if (user) {
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          }
        }

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
    },
  ),
);
