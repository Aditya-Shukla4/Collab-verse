import mongoose from "mongoose";

const collaborationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    collaborator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    permissions: {
      type: [String],
      enum: ["read", "write"],
      default: ["read", "write"],
    },
  },
  { timestamps: true }
);

// Ensure a user can only be a collaborator on a project once
collaborationSchema.index({ project: 1, collaborator: 1 }, { unique: true });

const Collaboration = mongoose.model("Collaboration", collaborationSchema);

export default Collaboration;
