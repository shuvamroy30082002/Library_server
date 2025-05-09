// server/routes/books.js
const express = require("express");
const Book = require("../models/Book"); // Import the Book model
const IssuedBook = require("../models/IssuedBook");
const FineConfig = require("../models/FineConfig");


const router = express.Router();

// // server/routes/books.js
// router.get("/displaybooks", async (req, res) => {
//     try {
//       const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page
  
//       // Calculate skip value
//       const skip = (parseInt(page) - 1) * parseInt(limit);
  
//       // Fetch paginated books
//       const books = await Book.find()
//         .select("-__v")
//         .skip(skip)
//         .limit(parseInt(limit));
  
//       // Get total count of books
//       const totalBooks = await Book.countDocuments();
  
//       res.json({
//         success: true,
//         books,
//         totalPages: Math.ceil(totalBooks / parseInt(limit)),
//         currentPage: parseInt(page),
//       });
//     } catch (err) {
//       res.status(500).json({ success: false, message: "Failed to fetch books." });
//     }
//   });

router.get("/displaybooks", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page

    // Calculate skip value
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch paginated books sorted by _id in descending order (newest first)
    const books = await Book.find()
      .select("-__v") // Exclude the __v field
      .sort({ _id: -1 }) // Sort by _id in descending order (newest first)
      .skip(skip) // Skip records based on pagination
      .limit(parseInt(limit)); // Limit the number of records per page

    // Get total count of books
    const totalBooks = await Book.countDocuments();

    res.json({
      success: true,
      books,
      totalPages: Math.ceil(totalBooks / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ success: false, message: "Failed to fetch books." });
  }
});



// POST /api/books
router.post("/addbooks", async (req, res) => {
    try {
        const { bookNo, nameOfBook, nameOfAuthor, medium } = req.body;
    
        // Validate required fields
        if (!bookNo || !nameOfBook || !nameOfAuthor || !medium) {
          return res.status(400).json({ success: false, message: "All fields are required." });
        }
    
        // Validate medium
        const validMediums = ["Hindi", "English", "Bangla"];
        if (!validMediums.includes(medium)) {
          return res.status(400).json({ success: false, message: "Invalid medium. Choose from Hindi, English, or Bangla." });
        }
    
        // Check if the book number already exists
        const existingBook = await Book.findOne({ bookNo });
        if (existingBook) {
          return res.status(400).json({ success: false, message: "Book number must be unique." });
        }
    
        // Create a new book
        const newBook = new Book({ bookNo, nameOfBook, nameOfAuthor, medium });
        await newBook.save();
    
        res.status(201).json({ success: true, message: "Book added successfully.", book: newBook });
      } catch (err) {
        res.status(500).json({ success: false, message: "Failed to add the book." });
      }
    });

// // POST /api/books/issue
// router.post("/issue", async (req, res) => {
//     try {
//       const { bookNo, nameOfBook, dateOfIssue, dateOfReturn, noOfDays } = req.body;
  
//       // Validate required fields
//       if (!bookNo || !nameOfBook || !dateOfIssue || !dateOfReturn || !noOfDays) {
//         return res.status(400).json({ success: false, message: "All fields are required." });
//       }
  
//       // Check if the book exists in the Book model
//       const book = await Book.findOne({ bookNo });
//       if (!book) {
//         return res.status(404).json({ success: false, message: "Book not found." });
//       }
  
//       // Check if the book is already issued
//       const alreadyIssued = await IssuedBook.findOne({ bookNo, isReturned: false });
//       if (alreadyIssued) {
//         return res.status(400).json({ success: false, message: "This book is already issued." });
//       }
  
//       // Save the issued book details in the IssuedBook model
//       const issuedBook = new IssuedBook({
//         bookNo,
//         nameOfBook,
//         dateOfIssue,
//         dateOfReturn,
//         noOfDays,
//       });
//       await issuedBook.save();
  
//       res.status(200).json({ success: true, message: "Book issued successfully.", issuedBook });
//     } catch (err) {
//       console.error("Error issuing book:", err);
//       res.status(500).json({ success: false, message: "Failed to issue the book." });
//     }
//   });

// POST /api/books/issue
router.post("/issue", async (req, res) => {
    try {
      const { bookNo, nameOfBook, dateOfIssue, dateOfReturn, noOfDays, issuedTo } = req.body;
  
      // Validate required fields
      if (!bookNo || !nameOfBook || !dateOfIssue || !dateOfReturn || !noOfDays || !issuedTo ) {
        return res.status(400).json({ success: false, message: "All fields are requiredssss." });
      }
  
      // Check if the book exists in the Book model
      const book = await Book.findOne({ bookNo });
      if (!book) {
        return res.status(404).json({ success: false, message: "Book not found." });
      }
  
      // Check if the book is already issued
      const alreadyIssued = await IssuedBook.findOne({ bookNo, isReturned: false });
      if (alreadyIssued) {
        return res.status(400).json({ success: false, message: "This book is already issued." });
      }
  
      // Update the Book model to mark it as issued
      book.isIssued = true;
      await book.save();
  
      // Save the issued book details in the IssuedBook model
      const issuedBook = new IssuedBook({
        bookNo,
        nameOfBook,
        dateOfIssue,
        dateOfReturn,
        noOfDays,
        issuedTo,
      });
      await issuedBook.save();
  
      res.status(200).json({ success: true, message: "Book issued successfully.", issuedBook });
    } catch (err) {
      console.error("Error issuing book:", err);
      res.status(500).json({ success: false, message: "Failed to issue the book." });
    }
  });


// // GET /api/books/issued
// router.get("/issued", async (req, res) => {
//     try {
//       // Fetch only issued books where isReturned is false
//       const issuedBooks = await IssuedBook.find({ isReturned: false }).select("-__v");
//       res.json({ success: true, issuedBooks });
//     } catch (err) {
//       res.status(500).json({ success: false, message: "Failed to fetch issued books." });
//     }
//   });

// GET /api/books/issued
router.get("/issued", async (req, res) => {
    try {
      // Fetch fine configuration
      const fineConfig = await FineConfig.findOne();
      if (!fineConfig) {
        return res.status(500).json({ success: false, message: "Fine configuration not found." });
      }
  
      // Fetch only issued books where isReturned is false
      const issuedBooks = await IssuedBook.find({ isReturned: false }).select("-__v");
  
      // Calculate days passed after the return date and fine for each book
      const today = new Date();
      const updatedIssuedBooks = issuedBooks.map((book) => {
        const returnDate = new Date(book.dateOfReturn);
        const diffTime = Math.abs(today - returnDate);
        const daysPassed = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days
  
        // Calculate fine (only if daysPassed > gracePeriod)
        const overdueDays = Math.max((daysPassed - 1) - fineConfig.gracePeriod, 0);
        const fine = Math.min(overdueDays * fineConfig.finePerDay, fineConfig.maxFine);
  
        return {
          ...book.toObject(),
          daysPassed,
          fine,
        };
      });
  
      res.json({ success: true, issuedBooks: updatedIssuedBooks });
    } catch (err) {
      console.error("Error fetching issued books:", err);
      res.status(500).json({ success: false, message: "Failed to fetch issued books." });
    }
  });



// // POST /api/books/mark-returned/:id
// router.post("/mark-returned/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
  
//       // Find the issued book by ID
//       const issuedBook = await IssuedBook.findById(id);
//       if (!issuedBook) {
//         return res.status(404).json({ success: false, message: "Issued book not found." });
//       }
  
//       // Update the isReturned field to true
//       issuedBook.isReturned = true;
//       await issuedBook.save();
  
//       res.status(200).json({ success: true, message: "Book marked as returned.", issuedBook });
//     } catch (err) {
//       res.status(500).json({ success: false, message: "Failed to mark the book as returned." });
//     }
//   });

// // POST /api/books/mark-returned/:id
// router.post("/mark-returned/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
  
//       // Find the issued book by ID
//       const issuedBook = await IssuedBook.findById(id);
//       if (!issuedBook) {
//         return res.status(404).json({ success: false, message: "Issued book not found." });
//       }
  
//       // Update the isReturned field to true
//       issuedBook.isReturned = true;
//       await issuedBook.save();
  
//       // Update the Book model to mark it as not issued
//       const book = await Book.findOne({ bookNo: issuedBook.bookNo });
//       if (book) {
//         book.isIssued = false;
//         await book.save();
//       }
  
//       res.status(200).json({ success: true, message: "Book marked as returned.", issuedBook });
//     } catch (err) {
//       res.status(500).json({ success: false, message: "Failed to mark the book as returned." });
//     }
//   });


// POST /api/books/mark-returned/:id
router.post("/mark-returned/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch fine configuration
      const fineConfig = await FineConfig.findOne();
      if (!fineConfig) {
        return res.status(500).json({ success: false, message: "Fine configuration not found." });
      }
  
      // Find the issued book by ID
      const issuedBook = await IssuedBook.findById(id);
      if (!issuedBook) {
        return res.status(404).json({ success: false, message: "Issued book not found." });
      }
  
      // Calculate fine if the book is returned late
      const actualReturnDate = new Date();
      const dueDate = new Date(issuedBook.dateOfReturn);
      const { finePerDay, gracePeriod, maxFine } = fineConfig;
  
      let fine = 0;
  
      if (actualReturnDate > dueDate) {
        const diffTime = Math.abs(actualReturnDate - dueDate);
        const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const overdueDays = Math.max(daysLate - gracePeriod, 0);
        fine = Math.min(overdueDays * finePerDay, maxFine);
      }
  
      // Update the issued book details
      issuedBook.isReturned = true;
      issuedBook.actualReturnDate = actualReturnDate;
      issuedBook.fine = fine;
      await issuedBook.save();
  
      // Update the Book model to mark it as not issued
      const book = await Book.findOne({ bookNo: issuedBook.bookNo });
      if (book) {
        book.isIssued = false;
        await book.save();
      }
  
      res.status(200).json({
        success: true,
        message: "Book marked as returned.",
        issuedBook,
        fine: fine > 0 ? `₹${fine}` : "No fine",
      });
    } catch (err) {
      console.error("Error marking book as returned:", err);
      res.status(500).json({ success: false, message: "Failed to mark the book as returned." });
    }
  });


  // server/routes/books.js
router.delete("/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the book exists
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ success: false, message: "Book not found." });
      }
  
      // Delete the book
      await Book.findByIdAndDelete(id);
  
      res.status(200).json({ success: true, message: "Book deleted successfully." });
    } catch (err) {
      console.error("Error deleting book:", err);
      res.status(500).json({ success: false, message: "Failed to delete the book." });
    }
  });

// Count total number of available books (not issued)
router.get("/count", async (req, res) => {
  try {
  const availableCount = await Book.countDocuments({ isIssued: false });
  res.json({ availableCount });
  } catch (err) {
  res.status(500).json({ message: "Failed to count available books", error: err.message });
  }
  });

module.exports = router;