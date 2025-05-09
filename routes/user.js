// server/routes/user.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require('../models/User');

const router = express.Router();

// GET /api/user/me
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// GET all users (excluding password)
router.get('/allusers', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude passwords
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


// PATCH user isAllowed status toggle
router.patch('/status', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isAllowed = !user.isAllowed;
    await user.save();

    res.status(200).json({
      message: 'User status updated successfully',
      isAllowed: user.isAllowed,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;