const User = require("../models/userModel");

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); //fetches all users from the MongoDB database
    res.status(200).json(users); // send the users as a Json response
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

module.exports = {
  getAllUsers,
};
