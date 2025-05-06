// server/testBookModel.js
const mongoose = require("mongoose");
const connectDB = require("./db/connection");
const Book = require("./models/Book");

// Connect to the database
connectDB().then(async () => {
  try {
    // Create a new book
    const newBook = new Book({
      bookNo: "B001",
      nameOfBook: "The Great Gatsby",
      nameOfAuthor: "F. Scott Fitzgerald",
      medium: "English",
    });

    // Save the book to the database
    const savedBook = await newBook.save();
    console.log("Book saved successfully:", savedBook);

    // Exit the process
    mongoose.connection.close();
  } catch (error) {
    console.error("Error saving book:", error.message);
    mongoose.connection.close();
  }
});