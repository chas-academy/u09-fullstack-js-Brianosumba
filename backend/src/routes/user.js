const express = require("express");
const mongoose = require("mongoose"); //  Required for ObjectId validation
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  toggleUserStatus,
  getUserById,
  deleteUserById,
} = require("../services/serviceUser"); //  Correct service import

const router = express.Router();

/**
 *  GET /api/users/
 * Fetch all users (Admin access only)
 */
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log(" Authenticated user:", req.user);
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(" Error in GET /api/users:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching users.", error: error.message });
  }
});

/**
 *  PATCH /api/users/:id/status
 * Toggle user active status (Admin access only)
 */
router.patch("/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    //  Use Mongoose's built-in ObjectId validator
    if (!mongoose.isValidObjectId(id)) {
      console.warn(" Invalid user ID format:", id);
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    console.log(" Toggling status for user ID:", id);
    const updatedUser = await toggleUserStatus(id);

    if (!updatedUser) {
      console.warn(" User not found for ID:", id);
      return res.status(404).json({ message: "User not found." });
    }

    res
      .status(200)
      .json({ message: "User status updated.", user: updatedUser });
  } catch (error) {
    console.error(" Error updating user status:", error.message);
    res
      .status(500)
      .json({ message: "Error updating user status.", error: error.message });
  }
});

/**
 *  GET /api/users/:id
 * Fetch a single user by ID (Admin access only)
 */
router.get("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      console.warn(" Invalid user ID format:", id);
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    console.log(" Fetching user by ID:", id);
    const user = await getUserById(id);

    if (!user) {
      console.warn(" User not found for ID:", id);
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(" Error fetching user:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching user.", error: error.message });
  }
});

/**
 *  DELETE /api/users/:id
 * Delete a user by ID (Admin access only)
 */
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      console.warn(" Invalid user ID format:", id);
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    console.log("Deleting user by ID:", id);
    const deletedUser = await deleteUserById(id);

    if (!deletedUser) {
      console.warn(" User not found for ID:", id);
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: " User deleted successfully." });
  } catch (error) {
    console.error(" Error deleting user:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting user.", error: error.message });
  }
});

module.exports = router;
