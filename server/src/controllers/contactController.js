// server/src/controllers/contactController.js
import { sendContactEmail } from "../services/email.service.js";

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

    const payload = {
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
    };

    // 👉 SIRF EMAIL YAHI SE JAAYEGA
    await sendContactEmail(payload);

    return res.status(200).json({
      ok: true,
      message: "Your message has been sent successfully.",
    });
  } catch (err) {
    console.error("createContact error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
};
