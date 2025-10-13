import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // ✅ THE FIX: Payload is now flat.
    const payload = { id: newUser.id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Please log in using your social account (e.g., GitHub).",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ THE FIX: Payload is now flat.
    const payload = { id: user.id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

export const githubCallback = (req, res) => {
  // ✅ THE FIX: Payload is now flat.
  const payload = { id: req.user.id };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });

  const redirectUrl = process.env.CLIENT_URL; // Simple aur consistent

  res.redirect(`${redirectUrl}/auth/callback?token=${token}`);
};
