const express = require("express");
const {
  getRecommendations,
  recommendExercise,
  deleteRecommendation,
  editRecommendation,
} = require("../controllers/exerciseController");

const router = express.Router();

// Recommendations API
router.get("/recommendations/:userId", getRecommendations); // Fetch all recommendations for a user
router.post("/recommend", recommendExercise); // Save a recommendation
router.delete("/recommendation/:recommendationId", deleteRecommendation); // Delete a recommendation
router.patch("/recommendation/:recommendationId", editRecommendation); // Update a recommendation

module.exports = router;
