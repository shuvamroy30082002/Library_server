// server/server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connection");
const routes = require("./routes/index"); // Import the centralized router

// Load environment variables
require("dotenv").config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Use the centralized router
app.use("/api", routes); // All routes will be prefixed with /api

// Test route
app.get("/", (req, res) => {
  res.send("Library Management API is running!");
});

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectDB(); // Connect to the database
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start the server: ${error.message}`);
    process.exit(1);
  }
};

startServer();