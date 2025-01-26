const express = require("express");
const {
  getRecommendations,
  getAllRecommendations,
  recommendExercise,
  deleteRecommendation,
  editRecommendation,
} = require("../controllers/exerciseController");

const router = express.Router();

// Recommendations API
router.get("/", getAllRecommendations); // fetch all recommendations
router.get("/:userId", getRecommendations); // Fetch all recommendations for a user
router.post("/", recommendExercise); // Save a recommendation
router.delete("/:recommendationId", deleteRecommendation); // Delete a recommendation
router.patch("/:recommendationId", editRecommendation); // Update a recommendation

module.exports = router;
