// FINAL CLEAN SCHEMA for: server/src/models/user.model.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: false },
    githubId: { type: String, unique: true, sparse: true },
    googleId: { type: String, unique: true, sparse: true },
    occupation: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    bio: { type: String, default: "", trim: true, maxlength: 500 },
    avatarUrl: { type: String, default: "" },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    linkedinUrl: { type: String, default: "", trim: true },
    githubUrl: { type: String, default: "", trim: true },
    portfolioUrl: { type: String, default: "", trim: true },
    otherUrl: { type: String, default: "", trim: true },
    collabPrefs: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
