// server/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Middleware to validate the unique key
const UNIQUE_KEY = process.env.UNIQUE_KEY;

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { uniqueKey } = req.body;

  // Validate the unique key
  if (uniqueKey !== UNIQUE_KEY) {
    return res.status(401).json({ message: "Invalid unique key" });
  }

  // Generate JWT token
  const token = jwt.sign({ key: uniqueKey }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Set the token in an httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Enable secure cookies in production
    sameSite: "strict",
  });

  res.json({ success: true, message: "Login successful" });
});

module.exports = router;