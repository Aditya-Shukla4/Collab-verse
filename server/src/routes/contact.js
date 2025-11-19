// server/src/routes/contact.js
import express from "express";
import { createContact } from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contact  -> send email from contact form
router.post("/", createContact);

export default router;
