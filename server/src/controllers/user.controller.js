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

export const getMyColleagues = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "colleagues",
      "name occupation avatarUrl"
    ); // Get details for each colleague

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user.colleagues);
  } catch (error) {
    console.error("ERROR in getMyColleagues:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching colleagues." });
  }
};

export const getMyProjectInvites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "projectInvites",
      populate: { path: "createdBy", select: "name avatarUrl" }, // Also populate the creator of the project
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user.projectInvites);
  } catch (error) {
    console.error("ERROR in getMyProjectInvites:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching project invites." });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "receivedCollabRequests",
        select: "name occupation avatarUrl skills",
      })
      .populate({
        path: "projectInvites",
        populate: { path: "createdBy", select: "name avatarUrl" },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      colleagueRequests: user.receivedCollabRequests,
      projectInvites: user.projectInvites,
    });
  } catch (error) {
    console.error("ERROR in getMyNotifications:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching notifications." });
  }
};
