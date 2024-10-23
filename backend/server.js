const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());

// CORS setup
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// Import routes
const userRoutes = require("./src/routes/userRoutes"); // Ensure this path is correct
const authRoutes = require("./src/routes/auth"); // Ensure this path is correct

// Use routes
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/FitnessTrackerApp"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
