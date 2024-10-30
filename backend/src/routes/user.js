const express = require("express");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const { getAllUsers, toggleUserStatus } = require("../services/serviceUser"); // Import user services

const router = express.Router();

// Route to get all users (admin access only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  console.log("Fetching all users...");
  try {
    const users = await getAllUsers();
    res.json(users); // Send users as response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Route to update user status (admin access only)
router.patch("/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await toggleUserStatus(req.params.id);
    res.json(user); // Send the updated user object as response
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Error updating user status" });
  }
});

// Additional routes (placeholders for CRUD actions)
router.get("/:id", verifyToken, verifyAdmin, async (req, res) => {
  // Code to get specific user details
});

router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  // Code to delete a user
});

// Export the router
module.exports = router;
