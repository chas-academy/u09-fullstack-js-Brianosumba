const User = require("../models/User");

// Fetch all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find(); //fetches all users from the MongoDB database
    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      level: user.level || 1,
      recommendWorkouts: user.recommendedWorkouts || [],
    }));
    res.status(200).json(formattedUsers); // send the users as a Json response
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

//Update User status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = !user.isActive; // toggle the status
    await user.save();
    res.json({ id: user._id, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status.", error });
  }
};

// Recommend workout
const recommendWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { workoutId } = req.body; // Workout ID from requested body
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.recommendedWorkouts.push(workoutId); // Add workout to recommendations
    await user.save();
    res.json({ id: user._id, recommendWorkouts: user.recommendWorkouts });
  } catch (error) {
    res.status(500).json({ message: "Failed to recommend workout" });
  }
};

//Edit User
const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user details." });
  }
};

//Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = {
  getUsers,
  updateUserStatus,
  recommendWorkout,
  editUser,
  deleteUser,
};
