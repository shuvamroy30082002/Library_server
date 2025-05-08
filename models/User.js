const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, sparse: true },
  password: String,
  uniqueKey: { type: String, unique: true },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);