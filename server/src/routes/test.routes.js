// Naya, Sahi Code (ES Module)
import express from "express"; // 'require' ko 'import' se badla

const router = express.Router();

// Jab koi GET request '/api/test/' par aayegi toh yeh function chalega
router.get("/", (req, res) => {
  res.json({ message: "Server is working!" });
});

export default router; // 'module.exports' ko 'export default' se badla
