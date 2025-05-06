// server/models/FineConfig.js
const mongoose = require("mongoose");

const fineConfigSchema = new mongoose.Schema(
  {
    finePerDay: {
      type: Number,
      default: 10, // Default fine rate per day
    },
    gracePeriod: {
      type: Number,
      default: 2, // Default grace period in days
    },
    maxFine: {
      type: Number,
      default: 100, // Default maximum fine
    },
  },
  { timestamps: true }
);

const FineConfig = mongoose.model("FineConfig", fineConfigSchema);

module.exports = FineConfig; 