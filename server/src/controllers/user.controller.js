import User from "../models/user.model.js";
import Collaboration from "../models/collaboration.model.js";

// --- DASHBOARD SEARCH ($text based) ---
export const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.query
      ? { $text: { $search: req.query.query } }
      : {};

    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } }) // Exclude self
      .select("-password");

    // 🔧 FIX: Always return an array, even if empty
    res.json(users || []);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error while searching users." });
  }
};

// --- INVITE MODAL SEARCH ($regex based) ---
export const searchForInvite = async (req, res) => {
  try {
    const keyword = req.query.query
      ? {
          $or: [
            { name: { $regex: req.query.query, $options: "i" } },
            { email: { $regex: req.query.query, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .limit(10)
      .select("name email avatarUrl");

    // 🔧 FIX: Always return an array
    res.json(users || []);
  } catch (error) {
    console.error("User invite search error:", error);
    res.status(500).json({ message: "Server error while searching users." });
  }
};

// --- GET LOGGED-IN USER'S PROFILE (/me) ---
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching my profile:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// --- GET ANY USER'S PROFILE BY ID (/:id) ---
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

// --- UPDATE USER PROFILE ---
export const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error updating profile." });
  }
};

// --- GET USER'S COLLEAGUES ---
export const getMyColleagues = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "colleagues",
      "name occupation avatarUrl"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // 🔧 FIX: Ensure colleagues is always an array
    res.status(200).json(user.colleagues || []);
  } catch (error) {
    console.error("Error fetching colleagues:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching colleagues." });
  }
};

// --- GET USER'S NOTIFICATIONS ---
export const getMyNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "receivedCollabRequests",
      select: "name occupation avatarUrl skills",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Also fetch pending project invitations
    const invitations = await Collaboration.find({
      collaborator: req.user.id,
      status: "pending",
    })
      .populate("project", "title")
      .populate("owner", "name avatarUrl");

    res.status(200).json({
      colleagueRequests: user.receivedCollabRequests || [],
      projectInvites: invitations || [],
    });
  } catch (error) {
    console.error("ERROR in getMyNotifications:", error);
    res.status(200).json({
      colleagueRequests: [],
      projectInvites: [],
    });
  }
};
