// models/ActivityLog.js
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    actionType: {
      type: String,
      required: true,
      enum: ["add", "issue", "return", "delete"], // Define valid action types
    },
    details: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Automatically set the timestamp
    },
  },
  { timestamps: false } // Disable additional createdAt/updatedAt fields
);

// Create a capped collection or use pre-save middleware to enforce the limit
activityLogSchema.pre("save", async function (next) {
  const ActivityLog = mongoose.model("ActivityLog");
  const logCount = await ActivityLog.countDocuments();

  // If there are more than 20 logs, delete the oldest one
  if (logCount >= 20) {
    const oldestLog = await ActivityLog.findOne().sort({ timestamp: 1 }); // Find the oldest log
    if (oldestLog) {
      await ActivityLog.deleteOne({ _id: oldestLog._id });
    }
  }

  next();
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);