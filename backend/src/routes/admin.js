const express = require("express");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware"); //Import our middleware
const User = require("../models/User"); //Import User model for user management

const router = express.Router();

//Admin Dashboard (protected route)
router.get("/dashboard", verifyToken, verifyAdmin, (req, res) => {
  //Only accessible to admins
  res.json({
    message: `Welcome to the admin dashboard, ${req.user.username}!`,
  });

  // Route to manage users (only for admins)
  router.get("/manage-users", verifyToken, verifyAdmin, async (req, res) => {
    try {
      const users = await User.find(); //Fetch all users from the database
      res.json(users); //Send user data to the admin
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
});

module.exports = router;
