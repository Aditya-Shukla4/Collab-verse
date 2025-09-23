import mongoose from "mongoose";

// Project ka blueprint (Schema)
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Har project ka title hona zaroori hai
      trim: true, // Title ke aage-peeche ke faltu space hata dega
    },
    content: {
      type: String,
      default: "", // Shuru mein content khaali rahega
    },
    // ===== YEH HAI SABSE ZAROORI PART =====
    owner: {
      type: mongoose.Schema.Types.ObjectId, // Iska type ek special 'ObjectId' hai
      required: true,
      ref: "User", // Yeh line Mongoose ko batati hai ki yeh ID 'User' model se judi hui hai
    },
  },
  {
    timestamps: true, // `createdAt` aur `updatedAt` fields apne aap ban jaayengi
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
