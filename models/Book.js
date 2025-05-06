// // server/models/Book.js
// const mongoose = require("mongoose");

// // Define the Book schema
// const bookSchema = new mongoose.Schema(
//   {
//     bookNo: {
//       type: String,
//       required: true,
//       unique: true, // Ensure each book number is unique
//     },
//     nameOfBook: {
//       type: String,
//       required: true,
//     },
//     nameOfAuthor: {
//       type: String,
//       required: true,
//     },
//     medium: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true } // Adds createdAt and updatedAt fields
// );

// // Create the Book model
// const Book = mongoose.model("Book", bookSchema);

// module.exports = Book;

// server/models/Book.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookNo: {
      type: String,
      required: true,
      unique: true,
    },
    nameOfBook: {
      type: String,
      required: true,
    },
    nameOfAuthor: {
      type: String,
      required: true,
    },
    medium: {
      type: String,
      required: true,
    },
    isIssued: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;