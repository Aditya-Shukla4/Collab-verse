// server/src/models/user.model.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Yeh fields pehle se the
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: false },

    //GIt hub login
    githubId: {
      type: String,
      unique: true,
      sparse: true, // Yeh allow karta hai ki multiple users ki yeh field khali ho, par agar bhari ho toh unique ho
    },

    // ===== YAHAN SE NAYE FIELDS ADD KIYE HAIN =====

    // User ka asli naam (UI se "User Name")
    name: { type: String, trim: true, default: "" },

    // Basic Info
    occupation: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },

    // Interests
    domainOfInterests: { type: [String], default: [] }, // Array of strings

    // Pehle se tha, bas confirm kar rahe hain
    techStack: { type: [String], default: [] }, // Array of strings

    // Social & Professional Links
    portfolioUrl: { type: String, trim: true, default: "" },
    otherProfileUrl: { type: String, trim: true, default: "" },

    // Yeh pehle se the
    githubUrl: { type: String, trim: true },
    linkedInUrl: { type: String, trim: true },

    // About & Collaboration
    bio: { type: String, trim: true, maxlength: 250, default: "" }, // Pehle se tha, maps to "About Me"
    collaborationPreferences: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
