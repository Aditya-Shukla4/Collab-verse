// server/src/controllers/user.controller.js

import User from "../models/user.model.js";

// This function was missing and has been restored.
// It is used to fetch the current user's profile data.
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error while fetching profile." });
  }
};

// This is the upgraded function for updating the user's profile.
export const updateUserProfile = async (req, res) => {
  try {
    const {
      name,
      occupation,
      location,
      domainOfInterests,
      techStack,
      portfolioUrl,
      otherProfileUrl,
      githubUrl,
      linkedInUrl,
      bio,
      collaborationPreferences,
    } = req.body;

    const updatedFields = {
      name,
      occupation,
      location,
      domainOfInterests,
      techStack,
      portfolioUrl,
      otherProfileUrl,
      githubUrl,
      linkedInUrl,
      bio,
      collaborationPreferences,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error while updating profile." });
  }
};
