// api/activity-log.js
const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");

// POST /api/activity-log - Add a new log entry
router.post("/New-Log", async (req, res) => {
  try {
    const { actionType, details } = req.body;

    // Validate input
    if (!actionType || !details) {
      return res.status(400).json({ error: "actionType and details are required" });
    }

    // Create a new log entry
    const newLog = new ActivityLog({
      actionType,
      details,
    });

    await newLog.save();

    res.status(201).json({ message: "Log added successfully", log: newLog });
  } catch (err) {
    console.error("Error adding activity log:", err);
    res.status(500).json({ error: "Failed to add activity log" });
  }
});

// GET /api/activity-log/latest - Fetch the latest 20 logs
router.get("/latest", async (req, res) => {
  try {
    // Fetch the latest 20 logs, sorted by timestamp in descending order
    const logs = await ActivityLog.find()
      .sort({ timestamp: -1 }) // Sort by timestamp (newest first)
      .limit(20); // Limit to 20 entries

    res.status(200).json({ logs });
  } catch (err) {
    console.error("Error fetching activity logs:", err);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

module.exports = router;