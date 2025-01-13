const User = require("../models/User");

/**
 * Fetch all users with their recommendations and exercise details.
 */
const getAllUsers = async () => {
  try {
    console.log("Fetching users from the database...");
    const users = await User.find(); // Basic query without populate
    console.log("Fetched users:", users); // Log raw user data

    return users; // For now, return users without transformation
  } catch (error) {
    console.error("Error fetching users in getAllUsers:", error.message);
    throw new Error("Error fetching users from the database.");
  }
};

/**
 * Toggle user active status.
 */
const toggleUserStatus = async (userId) => {
  try {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn("Invalid user ID format:", userId);
      throw new Error("Invalid user ID format");
    }
    console.log(`Toggling status for user ID: ${userId}`);
    const user = await User.findById(userId);

    if (!user) {
      console.warn(`User not found for ID: ${userId}`);
      throw new Error("User not found");
    }

    user.isActive = !user.isActive; // Toggle the `isActive` status
    await user.save();

    console.log(
      `User status updated successfully. New status: ${user.isActive}`
    );
    return { id: user._id, isActive: user.isActive };
  } catch (error) {
    console.error("Error toggling user status:", error.message);
    throw new Error("Error toggling user status.");
  }
};

/**
 * Fetch a single user by ID with recommendations.
 */
const getUserById = async (userId) => {
  try {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn("Invalid user ID format:", userId);
      throw new Error("Invalid user ID format");
    }

    console.log(`Fetching user by ID: ${userId}`);
    const user = await User.findById(userId).populate({
      path: "recommendations",
      select: "exerciseId notes tags",
      populate: {
        path: "exerciseId",
        select: "name bodyPart target",
      },
    });

    if (!user) {
      console.warn(`User not found for ID: ${userId}`);
      throw new Error("User not found");
    }

    console.log(`User fetched successfully: ${user.username}`);
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      recommendations: user.recommendations.map((rec) => ({
        id: rec._id,
        exerciseId: rec.exerciseId?._id || null,
        exerciseName: rec.exerciseId?.name || "Unknown Exercise",
        bodyPart: rec.exerciseId?.bodyPart || "N/A",
        target: rec.exerciseId?.target || "N/A",
        notes: rec.notes,
        tags: rec.tags,
      })),
    };
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    throw new Error("Error fetching user by ID.");
  }
};

/**
 * Delete a user by ID.
 */
const deleteUserById = async (userId) => {
  try {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn("Invalid user ID format:", userId);
      throw new Error("Invalid user ID format");
    }
    console.log(`Deleting user by ID: ${userId}`);
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      console.warn(`User not found for ID: ${userId}`);
      throw new Error("User not found");
    }

    console.log(`User deleted successfully: ${deletedUser.username}`);
    return { message: "User deleted successfully", id: deletedUser._id };
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw new Error("Error deleting user.");
  }
};

module.exports = {
  getAllUsers,
  toggleUserStatus,
  getUserById,
  deleteUserById,
};
