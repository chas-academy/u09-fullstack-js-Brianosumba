// routes/exercise.js
const express = require("express");
const router = express.Router();
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

// POST /exercises/recommend - Recommend a new exercise (Placeholder for now)
router.post("/recommend", (req, res) => {
  const { exerciseId } = req.body; // Extract exercise ID from request body
  // Logic to save recommended exercise to your database (if applicable)

  // For now, just send a success message
  res
    .status(201)
    .json({ message: `Exercise ${exerciseId} recommended successfully!` });
});

// PUT /exercises/edit/:id - Edit an existing exercise (Placeholder for now)
router.put("/edit/:id", (req, res) => {
  const { id } = req.params; // Extract ID from route parameters
  const updatedData = req.body; // Get updated data from request body
  // Logic to update exercise in your database (if applicable)

  // For now, just send a success message
  res.status(200).json({ message: `Exercise ${id} updated successfully!` });
});

// DELETE /exercises/delete/:id - Delete an exercise (Placeholder for now)
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params; // Extract ID from route parameters
  // Logic to delete exercise from your database (if applicable)

  // For now, just send a success message
  res.status(200).json({ message: `Exercise ${id} deleted successfully!` });
});

// Export the router
module.exports = router;
