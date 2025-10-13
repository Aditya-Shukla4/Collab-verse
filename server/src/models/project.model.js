// server/src/models/project.model.js

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    techStack: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    rolesNeeded: [
      {
        type: String,
        trim: true,
      },
    ],
    githubRepo: {
      type: String,
      trim: true,
      default: "",
    },
    liveUrl: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    codeContent: {
      type: String,
      default: "// Welcome to the workspace! Start coding...",
    },
    joinRequests: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "completed", "on-hold"],
      default: "active",
    },
  },
  { timestamps: true }
);

projectSchema.index({
  title: "text",
  description: "text",
  techStack: "text",
  rolesNeeded: "text",
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
