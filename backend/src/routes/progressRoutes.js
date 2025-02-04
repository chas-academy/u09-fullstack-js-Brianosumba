const express = require("express");
const router = express.Router();
const {
  getProgress,
  updateProgress,
} = require("../controllers/progressController");

//GET /api/progress/:userId
router.get("/:userId", getProgress);

//PUT /api/progress/:userId
router.put("/:userId", updateProgress);

module.exports = router;
