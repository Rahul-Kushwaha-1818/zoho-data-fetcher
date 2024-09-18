const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const zohoRoutes = require("./routes/zohoRoutes"); // Import your routes
require("dotenv").config(); // For storing sensitive credentials in .env

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const mongoURI =
  "mongodb+srv://rkushwaha1818:Databasezoho@zoho.ovx1h.mongodb.net/zohoDatabase?retryWrites=true&w=majority&appName=Zohog"; // Replace with your MongoDB URI

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Middleware for parsing JSON
// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api", zohoRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
