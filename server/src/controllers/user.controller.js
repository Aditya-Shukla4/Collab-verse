import User from "../models/user.model.js";

// --- Universal Search Logic ---
export const searchUsers = async (req, res) => {
  try {
    const rawQuery = req.query.query;
    const query = rawQuery && rawQuery.trim() !== "" ? rawQuery.trim() : null;

    const filter = {};

    if (query) {
      const searchRegex = { $regex: query, $options: "i" };
      filter.$or = [
        { name: searchRegex },
        { location: searchRegex },
        { skills: searchRegex },
        { occupation: searchRegex },
        { bio: searchRegex },
      ];
    }

    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error while searching users." });
  }
};

// --- Get logged-in user's profile ---
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

// --- Update user profile ---
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

// --- Get any user's profile by ID ---
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
