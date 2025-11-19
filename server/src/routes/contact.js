// server/src/routes/contact.js
import express from "express";
import { createContact, getContacts } from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contact  -> save from contact form
router.post("/", createContact);

// GET /api/contact   -> list all (for admin, optional)
router.get("/", getContacts);

export default router;
