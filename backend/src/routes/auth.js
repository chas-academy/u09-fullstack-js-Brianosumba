// Import necessary modules
const express = require("express");
const bcrypt = require("bcryptjs"); // Library for hashing passwords
const jwt = require("jsonwebtoken"); // Library for creating JWTs (JSON Web Tokens)
const User = require("../models/User"); // Import the User model for database interactions

const router = express.Router(); // Create a new Express router

//Helper to generate JWT tokens
const generateToken = (user) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined. Check enviroment variables");
    }

    return jwt.sign(
      { id: user._id.toString(), isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw new Error("Failed to generate token");
  }
};
// Register Route (for both admins and users)
router.post("/register", async (req, res) => {
  const { username, email, password, secretCode } = req.body; // Secret code for admin registration

  // Basic request body validation
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists, send a 400 error response
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

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

    //Generate a token after succesful login
    const token = generateToken(newUser);

    // Send a success response
    res.status(201).json({
      message: isAdmin
        ? "Admin registered successfully"
        : "User registered successfully",
      token,
      user: { id: newUser._id, username, email, isAdmin },
    });
  } catch (error) {
    // Handle any errors that occur during registration
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
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
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }

    // Check if the provided password matches the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If passwords do not match, send a 400 error response
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate a token for the user
    const token = generateToken(user);

    console.log("User logged in successfully:", {
      userId: user._id,
      isAdmin: user.isAdmin,
      username: user.username,
    });

    res.json({
      token,
      user: { id: user._id, username: user.username, isAdmin: user.isAdmin },
    });
  } catch (error) {
    // Handle any errors that occur during login
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

//Reset password Route
router.post("/reset-password", async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    // check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found with this username" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword; // Update the user's password
    await user.save(); // Save the user

    //Generate a new token for the user
    const token = generateToken(user);

    console.log("Password reset successful for user:", user.username);

    res.json({ success: true, token }); // Send back the token in the response
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
});

// Export the router to use it in your main application file
module.exports = router;
