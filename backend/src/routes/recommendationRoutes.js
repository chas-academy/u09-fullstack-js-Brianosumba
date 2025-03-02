const express = require("express");
const {
  getRecommendations,
  getAllRecommendations,
  recommendExercise,
  deleteRecommendation,
  editRecommendation,
} = require("../controllers/exerciseController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Recommendations API
router.get("/", verifyToken, verifyAdmin, getAllRecommendations); // fetch all recommendations(Admin only)
router.get("/:userId", verifyToken, getRecommendations); // Fetch all recommendations for a user(Authenticated users)
router.post("/", verifyToken, verifyAdmin, recommendExercise); // Save a recommendation(Admin only)
router.delete(
  "/:recommendationId",
  verifyToken,
  verifyAdmin,
  deleteRecommendation
); // Delete a recommendation(Admin only)
router.put("/:recommendationId", verifyToken, verifyAdmin, editRecommendation); // Update a recommendation(Admin only)

module.exports = router;
