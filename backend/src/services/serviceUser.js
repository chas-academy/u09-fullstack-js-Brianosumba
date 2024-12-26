// backend/services/userService.js

const User = require("../models/User"); // Import the User model

// Fetch all users
const getAllUsers = async () => {
  try {
    const users = await User.find(); // Fetch all users from the database
    return users.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Toggle user active status
const toggleUserStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.isActive = !user.isActive; // Toggle the isActive status
    await user.save(); // Save the updated user
    return { id: user._id, isActive: user.isActive };
  } catch (error) {
    console.error("Error toggling user status:", error);
    throw error;
  }
};

/**
 * Fetch user by ID
 */
const getUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

/**
 * Delete a user by ID
 */

const deleteUserById = async (userId) => {
  try {
    return await User.findByIdAndDelete(userId); // Delete user by ID
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  toggleUserStatus,
  getUserById,
  deleteUserById,
};
