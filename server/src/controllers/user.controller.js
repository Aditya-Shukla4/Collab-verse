// server/src/controllers/user.controller.js

import User from "../models/user.model.js";

// Fetches the profile of the currently logged-in user
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

// Updates the profile of the currently logged-in user
export const updateUserProfile = async (req, res) => {
  try {
    const {
      name,
      occupation,
      location,
      interests,
      skills,
      portfolioUrl,
      otherUrl,
      githubUrl,
      linkedinUrl,
      bio,
      collabPrefs,
    } = req.body;

    const updatedFields = {
      name,
      occupation,
      location,
      interests,
      skills,
      portfolioUrl,
      otherUrl,
      githubUrl,
      linkedinUrl,
      bio,
      collabPrefs,
    };

    Object.keys(updatedFields).forEach(
      (key) => updatedFields[key] === undefined && delete updatedFields[key]
    );

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

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error while fetching users." });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    // Handle cases where the ID is not a valid MongoDB ObjectId
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
