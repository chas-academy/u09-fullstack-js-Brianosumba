// Import necessary modules
const express = require("express");
const bcrypt = require("bcryptjs"); // Library for hashing passwords
const jwt = require("jsonwebtoken"); // Library for creating JWTs (JSON Web Tokens)
const User = require("../models/User"); // Import the User model for database interactions

const router = express.Router(); // Create a new Express router

// Register Route
router.post("/register", async (req, res) => {
  // Destructure username, email, and password from the request body
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists in the database using their email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists, send a 400 error response
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Save the hashed password
    });

    // Save the new user to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Handle any errors that occur during registration
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  // Destructure email and password from the request body
  const { email, password } = req.body;

  try {
    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      // If no user is found, send a 400 error response
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the provided password matches the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If passwords do not match, send a 400 error response
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token with user ID and admin status
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, // Payload contains user ID and admin status
      "jwtSecret", // Secret key for signing the token (should be stored securely)
      {
        expiresIn: "1h", // Token expiration time
      }
    );

    // Send the token and user info in the response
    res.json({
      token,
      user: { id: user._id, username: user.username, isAdmin: user.isAdmin },
    });
  } catch (error) {
    // Handle any errors that occur during login
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Export the router to use it in your main application file
module.exports = router;
