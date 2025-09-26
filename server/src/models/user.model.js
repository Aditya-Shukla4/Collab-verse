import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // ===== NAYE FIELDS YAHAN SE SHURU HOTE HAIN =====
    bio: {
      type: String,
      default: "A passionate developer ready to collaborate!", // Default bio
      trim: true,
      maxlength: 250,
    },
    techStack: {
      type: [String], // Yeh ek array hoga, jismein strings honge. Jaise: ['React', 'Node.js']
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    linkedInUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
