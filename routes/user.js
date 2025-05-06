// server/routes/user.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/user/me
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;