// server/src/controllers/auth.controller.js

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register function (yeh pehle se bana hua hai)
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json({
      message: "User registered successfully!",
      userId: savedUser._id,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// ===== YEH HAI HAMARA NAYA LOGIN FUNCTION =====
export const login = async (req, res) => {
  try {
    // 1. User se email aur password lo
    const { email, password } = req.body;

    // 2. Database mein user ko email se dhoondho
    const user = await User.findOne({ email });
    if (!user) {
      // Agar user nahi mila, toh generic error bhejo
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Aaye hue password ko database ke hashed password se compare karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Agar password galat hai, toh bhi generic error bhejo
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Agar sab sahi hai, toh ek token (VVIP pass) banao
    const payload = {
      user: {
        id: user.id, // User ki unique ID ko pass mein daal rahe hain
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Hamara secret code
      { expiresIn: "1h" }, // Pass 1 ghante ke liye valid rahega
      (err, token) => {
        if (err) throw err;
        // 5. Token ko response mein wapas bhej do
        res.json({ token });
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};
