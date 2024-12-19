const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");

//Recommendation routes
router.post("/recommend", exerciseController.recommendExercise);
router.get("/recommendations/:userId", exerciseController.getRecommendations);
router.delete(
  "/recommendation/:recommendationId",
  exerciseController.deleteRecommendation
);

// Edited exercise routes
router.put("/edit", exerciseController.editExercise);
router.get("/edit/:exerciseId", exerciseController.getEditedExercise);
router.delete("/edit/:exerciseId", exerciseController.deleteEditedExercise);

//Deleted exercise routes
router.delete("/exerciseId", exerciseController.deleteExercise);

//Exercise completion
router.post("/complete", exerciseController.completeExercise);

// Fetch exercise with pagination
router.get("/", exerciseController.getExercises);

module.exports = router;
