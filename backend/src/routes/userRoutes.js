const express = require("express");
const { getAllUsers } = require("../controllers/userController");
const router = express.Router();

//Route to get all users
router.get("/users", getAllUsers);

module.exports = router;
