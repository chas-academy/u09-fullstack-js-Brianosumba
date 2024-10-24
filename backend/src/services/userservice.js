// backend/services/userService.js

const User = require("../models/User"); // Import the User model

// Fetch all users
const getAllUsers = async () => {
  try {
    return await User.find(); // Fetch all users from the database
  } catch (error) {
    throw new Error("Error fetching users: " + error.message); // Handle any errors
  }
};

// Update user status
const toggleUserStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.isActive = !user.isActive; // Toggle the isActive status
    await user.save(); // Save the updated user
    return user; // Return the updated user
  } catch (error) {
    throw new Error("Error updating user status: " + error.message); // Handle any errors
  }
};

module.exports = {
  getAllUsers,
  toggleUserStatus,
};
