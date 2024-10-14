// Importing necessary modules
const express = require("express"); // Importing the Express framework for building web applications
const mongoose = require("mongoose"); // Importing Mongoose to interact with MongoDB
const cors = require("cors"); // Importing CORS to allow requests from different origins

// Creating an instance of an Express application
const app = express();

// Middleware to parse JSON bodies from incoming POST requests
app.use(express.json()); // This allows the server to understand JSON data sent in requests

// Enable CORS for all routes
// This middleware allows your server to accept requests from different origins (e.g., your frontend application)
// Without CORS, browsers would block requests to your server from different domains
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/FitnessTrackerApp", {
    useNewUrlParser: true, // Use the new URL parser to avoid deprecated warnings
    useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine for better performance
  })
  .then(() => console.log("Connected to MongoDB")) // Log a success message when connected
  .catch((err) => console.error("Failed to connect to MongoDB", err)); // Log an error message if connection fails

// Import routes (Make sure to create this file first)
const authRoutes = require("../backend/src/routes/auth"); // Importing the authentication routes

// Use the authentication routes with a base path of /api/auth
app.use("/api/auth", authRoutes); // This attaches the routes to the Express app

// Set the port to the environment variable PORT or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`); // Log the port number to the console for confirmation
});
