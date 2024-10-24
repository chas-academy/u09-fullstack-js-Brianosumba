// backend/routes/user.js

const express = require("express");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const { getAllUsers, toggleUserStatus } = require("../services/userservice"); // Import your user service

const router = express.Router();

// Get all users (admin access)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  console.log("fetching users:");
  try {
    const users = await getAllUsers(); // Use the user service
    res.json(users); // Send the users as a response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update user status
router.patch("/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await toggleUserStatus(req.params.id); // Use the user service
    res.json(user); // Send back the updated user object
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: error.message });
  }
});

// Export the router
module.exports = router;
