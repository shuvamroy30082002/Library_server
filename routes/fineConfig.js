// server/routes/fineConfig.js
const express = require("express");
const FineConfig = require("../models/FineConfig");

const router = express.Router();

// GET /api/fine-config
router.get("/fineconfig", async (req, res) => {
  try {
    let fineConfig = await FineConfig.findOne();
    if (!fineConfig) {
      // Create a default config if none exists
      fineConfig = new FineConfig({
        finePerDay: 10,
        gracePeriod: 2,
        maxFine: 100,
      });
      await fineConfig.save();
    }
    res.json({ success: true, fineConfig });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch fine configuration." });
  }
});

// PUT /api/fine-config
router.put("/fine-config", async (req, res) => {
  try {
    const { finePerDay, gracePeriod, maxFine } = req.body;

    let fineConfig = await FineConfig.findOne();
    if (!fineConfig) {
      fineConfig = new FineConfig();
    }

    fineConfig.finePerDay = finePerDay;
    fineConfig.gracePeriod = gracePeriod;
    fineConfig.maxFine = maxFine;

    await fineConfig.save();

    res.json({ success: true, message: "Fine configuration updated successfully.", fineConfig });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update fine configuration." });
  }
});

module.exports = router;