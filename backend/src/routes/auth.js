// Import necessary modules
const express = require("express");
const bcrypt = require("bcryptjs"); // Library for hashing passwords
const jwt = require("jsonwebtoken"); // Library for creating JWTs (JSON Web Tokens)
const User = require("../models/User"); // Import the User model for database interactions

const router = express.Router(); // Create a new Express router

// Register Route (for both admins and users)
router.post("/register", async (req, res) => {
  // Destructure username, email, and password from the request body
  const { username, email, password, secretCode } = req.body; // Secret code for admin registration

  try {
    // Check if the user already exists in the database using their email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists, send a 400 error response
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    //Determine if the user is an admin based on the secret code
    const isAdmin = secretCode === process.env.ADMIN_SECRET; //compare secret code to a stored value

    // Create a new user (with admin flag if applicable)
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Save the hashed password
      isAdmin, // true if secretCode is valid false otherwise
    });

    // Save the new user to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({
      message: isAdmin
        ? "Admin registered successfully"
        : "User registered successfully",
    });
  } catch (error) {
    // Handle any errors that occur during registration
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route (for both admins and users)
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

//Reset password Route
router.post("/reset-password", async (req, res) => {
  const { username, newPassword } = req.body; //Destructure username and new password from the request body

  try {
    //Find the user by their username
    const user = await User.findOne({ username });
    if (!user) {
      //if user not found, send a 404 error response
      return res.status(404).json({ messsage: "User not found" });
    }

    //Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //Update the user´s password in the database
    user.password = hashedPassword;
    await user.save(); //Save the updated user

    //Send a success response
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error ressetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Export the router to use it in your main application file
module.exports = router;
