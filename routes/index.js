// server/routes/index.js
const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const bookRoutes = require("./books"); 
const fineRoutes = require("./fineConfig"); 
const logRoutes = require("./activity-log"); 


const router = express.Router();

// Use the auth routes for /auth endpoints
router.use("/auth", authRoutes);

// Use the user routes for /user endpoints
router.use("/user", userRoutes);

// Use the books routes for /books endpoints
router.use("/books", bookRoutes);

router.use("/fine", fineRoutes);

router.use("/log", logRoutes);

module.exports = router;