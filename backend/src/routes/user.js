const express = require("express");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  toggleUserStatus,
  getUserById,
  deleteUserById,
} = require("../services/serviceUser"); // Import user services

const router = express.Router();

/**
 * GET /api/users/
 * Fetch all users (Admin access only)
 */
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  console.log("Fetching all users...");
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

/**
 * PATCH /api/users/:id/status
 * Toggle user active status (Admin access only)
 */
router.patch("/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updatedUser = await toggleUserStatus(req.params.id);
    res.status(200).json(updatedUserser); // Send the updated user object as response
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Error updating user status" });
  }
});

/**
 * GET /api/users/:id
 * Fetch a single user by ID (Admin acess only)
 */
router.get("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

/**
 * DELETE /api/users/:id
 * Delete a user by ID(Admin access only)
 */
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedUser = await deleteUserById(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Export the router
module.exports = router;
