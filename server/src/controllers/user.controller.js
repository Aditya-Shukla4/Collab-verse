import User from "../models/user.model.js";

// --- V6 - UNIVERSAL SEARCH LOGIC (WITH DIAGNOSTICS) ---
export const searchUsers = async (req, res) => {
  // --- CCTV CAMERA #1: Kya hum sahi function mein hain? ---
  console.log("\n--- 🕵️‍♂️ V6 Universal Search Triggered ---");
  try {
    const { query } = req.query;

    // --- CCTV CAMERA #2: Frontend ne kya bheja? ---
    console.log(`Frontend is searching for: '${query}'`);

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

    // --- CCTV CAMERA #3: Humne database ko kya dhoondhne ko bola? ---
    console.log(
      "Constructed Mongoose Filter:",
      JSON.stringify(filter, null, 2)
    );

    const users = await User.find(filter).select("-password");

    // --- CCTV CAMERA #4 (ASLI SABOOT): Database ko kya mila? ---
    console.log(`Database found ${users.length} user(s).`);
    if (users.length > 0) {
      console.log(
        "Returning user names:",
        users.map((u) => u.name)
      );
    }
    console.log("----------------------------------------\n");

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error while searching users." });
  }
};

// --- YOUR OTHER CONTROLLER FUNCTIONS (UNCHANGED) ---

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
