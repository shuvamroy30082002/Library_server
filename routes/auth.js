// server/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require('bcryptjs');

// const FineConfig = require("../models/FineConfig");
const User = require('../models/User');

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = "auth_token";

// Middleware to validate the unique key
const UNIQUE_KEY = process.env.UNIQUE_KEY;

// // POST /api/auth/login
// router.post("/login", (req, res) => {
//   const { uniqueKey } = req.body;

//   // Validate the unique key
//   if (uniqueKey !== UNIQUE_KEY) {
//     return res.status(401).json({ message: "Invalid unique key" });
//   }

//   // Generate JWT token
//   const token = jwt.sign({ key: uniqueKey }, process.env.JWT_SECRET, {
//     expiresIn: "1h",
//   });

//   // Set the token in an httpOnly cookie
//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // Enable secure cookies in production
//     sameSite: "strict",
//   });

//   res.json({ success: true, message: "Login successful" });
// });



// router.post("/login", async (req, res) => {
//   const { uniqueKey, userId, password } = req.body;

//   try {
//     let user = null;

//     // Login via ENV Unique Key
//     if (uniqueKey) {
//       if (uniqueKey !== UNIQUE_KEY) {
//         return res.status(403).json({ success: false, message: "Invalid unique key." });
//       }

//       // Dummy user object for JWT creation
//       user = {
//         _id: "admin-env",
//         userId: "env_admin",
//         uniqueKey: UNIQUE_KEY,
//         isAdmin: true,
//       };
//     }

//     // Login via userId/password
//     if (userId && password) {
//       user = await User.findOne({ userId });
//       if (!user) return res.status(404).json({ success: false, message: "User ID not found." });

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password." });
//     }

//     if (!user) return res.status(400).json({ success: false, message: "Missing or invalid credentials." });

//     // Create payload and token
//     const payload = {
//       id: user._id,
//       userId: user.userId,
//       isAdmin: user.isAdmin || false,
//     };

//     const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

//     // Set HTTP-only cookie
//     res.cookie(COOKIE_NAME, token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.json({ success: true, message: "Login successful." });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ success: false, message: "Server error." });
//   }
// });


router.post("/login", async (req, res) => {
  const { uniqueKey, userId, password } = req.body;

  try {
    let user = null;

    // Login via ENV Unique Key
    if (uniqueKey) {
      if (uniqueKey !== UNIQUE_KEY) {
        return res.status(403).json({ success: false, message: "Invalid unique key." });
      }

      // Dummy user object for JWT creation
      user = {
        _id: "admin-env",
        userId: "env_admin",
        uniqueKey: UNIQUE_KEY,
        isAdmin: true,
      };
    }

    // Login via userId/password
    if (userId && password) {
      user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ success: false, message: "User ID not found." });
      }

      if (!user.isAllowed) {
        return res.status(403).json({ success: false, message: "User is not allowed to login." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Incorrect password." });
      }
    }

    if (!user) {
      return res.status(400).json({ success: false, message: "Missing or invalid credentials." });
    }

    // Create payload and token
    const payload = {
      id: user._id,
      userId: user.userId,
      isAdmin: user.isAdmin || false,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    // Set HTTP-only cookie
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({ success: true, message: "Login successful." });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});




// @route   POST /api/auth/register
// @desc    Register new user with userId + password
router.post('/register', async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userId,
      password: hashedPassword,
      uniqueKey: `UNIQ-${Date.now()}`,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: 'User registered successfully.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// Logout Route
// POST /api/auth/logout
router.post("/logout", (req, res) => {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during logout.",
    });
  }
});

module.exports = router;