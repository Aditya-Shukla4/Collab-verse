// server/src/controllers/contactController.js
import Contact from "../models/contact.model.js";

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email || "");

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body ?? {};

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "name, email and message are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "invalid email" });
    }

    if (String(message).trim().length < 5) {
      return res.status(400).json({ error: "message too short" });
    }

    const contact = await Contact.create({
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
    });

    return res.status(201).json({ ok: true, contact });
  } catch (err) {
    console.error("createContact error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
};

// optional – for admin panel etc.
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    return res.json({ ok: true, contacts });
  } catch (err) {
    console.error("getContacts error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
};
