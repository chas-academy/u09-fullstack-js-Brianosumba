// routes/exercise.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const exerciseController = require("../controllers/exerciseController");
const {
  fetchExercises,
  fetchExerciseById,
} = require("../services/exerciseService"); // Importing service functions

// GET /exercises - Fetch exercises with pagination
router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Get limit from query params or default to 10
  const offset = parseInt(req.query.offset) || 0; // Get offset from query params or default to 0

  try {
    const exercises = await fetchExercises(limit, offset); // Fetch exercises using service
    res.json(exercises); // Send response as JSON
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: "Failed to fetch exercises." }); // Send error response
  }
});

// GET /exercises/exercise/:id - Fetch specific exercise by ID
router.get("/exercise/:id", async (req, res) => {
  const { id } = req.params; // Extract ID from route parameters

  try {
    const exercise = await fetchExerciseById(id); // Fetch exercise by ID
    res.json(exercise); // Send response as JSON
  } catch (error) {
    console.error("Error fetching exercise:", error);
    res.status(500).json({ error: "Failed to fetch exercise." }); // Send error response
  }
});

// POST /exercises/recommend - Recommend a new exercise
router.post("/recommend", exerciseController.recommendExercise);

// PUT /exercises/edit/:id - Edit an existing exercise
router.put("/edit/:id", exerciseController.editExercise);

// DELETE /exercises/delete/:id - Delete an exercise
router.delete("/delete/:id", exerciseController.deleteExercise);

//Post /exercises/complete -Record exercise completion
router.post("/complete", verifyToken, exerciseController.completeExercise);

// Export the router
module.exports = router;
