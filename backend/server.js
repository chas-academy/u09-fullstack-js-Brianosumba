const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// CORS setup
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from your frontend
  credentials: true, // Allow cookies and credentials to be sent
};
app.use(cors(corsOptions)); // Use CORS middleware with these options

// Import routes (ensure these paths match your folder structure)
const userRoutes = require("./src/routes/user"); // Updated to "userRoutes" for clarity
const authRoutes = require("./src/routes/auth"); // Updated to "authRoutes" for consistency
const exerciseRoutes = require("./src/routes/exercise"); // Ensure correct name if "exerciseRoutes"

// Use routes (adjust paths to match your API design)
app.use("/api/users", userRoutes); // Use '/api/users' to access user routes
app.use("/api/auth", authRoutes); // '/api/auth' for authentication routes
app.use("/api/exercises", exerciseRoutes); // '/api/exercises' for exercise routes

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
