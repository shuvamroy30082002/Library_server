// server/models/IssuedBook.js
const mongoose = require("mongoose");

const issuedBookSchema = new mongoose.Schema(
  {
    bookNo: {
      type: String,
      required: true,
    },
    nameOfBook: {
      type: String,
      required: true,
    },
    dateOfIssue: {
      type: Date,
      required: true,
    },
    dateOfReturn: {
      type: Date,
      required: true,
    },
    noOfDays: {
      type: Number,
      required: true,
    },
    isReturned: {
      type: Boolean,
      default: false, // Default value
    },
  },
  { timestamps: true }
);

const IssuedBook = mongoose.model("IssuedBook", issuedBookSchema);

module.exports = IssuedBook;