const express = require("express");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware"); // Import your auth middleware
const User = require("../models/User"); // Import the User model

const router = express.Router();

// Get all users (admin access)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users); // Send the users as a response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user status
router.patch("/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the isActive status
    user.isActive = !user.isActive; // Flip the current status
    await user.save(); // Save the updated user

    res.json(user); // Send back the updated user object
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Other user-related routes can be added here (e.g., recommend, edit, delete)

// Export the router
module.exports = router;
