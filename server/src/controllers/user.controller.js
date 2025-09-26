import User from "../models/user.model.js";

// Officer 1: User ki apni profile fetch karne ke liye
export const getMyProfile = async (req, res) => {
  try {
    // Hum user ko uski ID se dhoondhenge, jo bouncer (middleware) ne di hai.
    // '-password' ka matlab hai "sab kuch bhejo, bas password mat bhejna".
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Officer 2: User ki profile update karne ke liye
export const updateUserProfile = async (req, res) => {
  try {
    const { bio, techStack, githubUrl, linkedInUrl } = req.body;

    // User ko dhoondho aur nayi details se update kar do
    // { new: true } ka matlab hai ki "update karne ke baad, mujhe naya waala user wapas bhejo".
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { bio, techStack, githubUrl, linkedInUrl },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
