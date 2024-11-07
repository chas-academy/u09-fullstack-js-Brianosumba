// controllers/exerciseController.js

const RecommendedExercise = require("../models/crud/RecommendExercise");
const EditedExercises = require("../models/crud/EditedExercises");
const DeletedExercises = require("../models/crud/DeletedExercises");
const ExerciseCompletion = require("../models/ExerciseCompletion");

// Create a recommendation
const recommendExercise = async (req, res) => {
  try {
    const { userId, exerciseId, notes, tags } = req.body;
    const recommendation = new RecommendedExercise({
      userId,
      exerciseId,
      notes,
      tags,
    });
    await recommendation.save();
    res
      .status(201)
      .json({ message: "Exercise recommended successfully", recommendation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error recommending exercise", error: error.message });
  }
};

// Fetch all recommendations for a user
const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const recommendations = await RecommendedExercise.find({ userId });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching recommendations",
      error: error.message,
    });
  }
};

// Delete a recommendation
const deleteRecommendation = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    await RecommendedExercise.findByIdAndDelete(recommendationId);
    res.json({ message: "Recommendation deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting recommendation", error: error.message });
  }
};

// CRUD functions for edited exercises

// Create or update an edited exercise
const editExercise = async (req, res) => {
  try {
    const { exerciseId, updatedFields } = req.body;
    const editedExercise = await EditedExercises.findOneAndUpdate(
      { exerciseId },
      { updatedFields },
      { new: true, upsert: true } // creates a new document if not found
    );
    res.json({ message: "Exercise edited successfully", editedExercise });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error editing exercise", error: error.message });
  }
};

// Fetch edited exercise by ID
const getEditedExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const editedExercise = await EditedExercises.findOne({ exerciseId });
    if (!editedExercise) {
      return res.status(404).json({ message: "Edited exercise not found" });
    }
    res.json(editedExercise);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching edited exercise",
      error: error.message,
    });
  }
};

// Delete an edited exercise
const deleteEditedExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    await EditedExercises.findOneAndDelete({ exerciseId });
    res.json({ message: "Edited exercise deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting edited exercise",
      error: error.message,
    });
  }
};

// CRUD functions for deleted exercises

// Mark an exercise as deleted
const deleteExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const deletedExercise = new DeletedExercises({ exerciseId });
    await deletedExercise.save();
    res.json({ message: "Exercise marked as deleted", deletedExercise });
  } catch (error) {
    res.status(500).json({
      message: "Error marking exercise as deleted",
      error: error.message,
    });
  }
};

// Check if an exercise is deleted
const isExerciseDeleted = async (exerciseId) => {
  return await DeletedExercises.exists({ exerciseId });
};

// Record exercise completion
const completeExercise = async (req, res) => {
  try {
    // Extract user information from request
    const userId = req.user.id;
    const username = req.user.username;

    // Extract exercise data from the request body
    const { exerciseId } = req.body;

    // Fetch exercise details from the database
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    // Create a new ExerciseCompletion document
    const completion = new ExerciseCompletion({
      userId,
      username,
      exerciseId,
      workoutType: exercise.workoutType,
      target: exercise.target,
      level: exercise.level,
      completedAt: new Date(),
    });

    // Save the completion record to the database
    await completion.save();

    // Emit a websocket event to notify the admin
    req.io.to("admins").emit("exerciseCompleted", {
      userId,
      username,
      workoutType: exercise.workoutType,
      target: exercise.target,
      level: exercise.level,
      completedAt: completion.completedAt,
    });

    // Send a success response back to the client
    res.status(200).json({ message: "Exercise completion recorded" });
  } catch (error) {
    console.error("Error recording exercise completion:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Export the controller functions
module.exports = {
  recommendExercise,
  getRecommendations,
  deleteRecommendation,
  editExercise,
  getEditedExercise,
  deleteEditedExercise,
  deleteExercise,
  isExerciseDeleted,
  completeExercise,
};
