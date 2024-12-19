const Exercise = require("../models/Exercise");
const RecommendedExercise = require("../models/crud/RecommendExercise");
const EditedExercises = require("../models/crud/EditedExercises");
const DeletedExercises = require("../models/crud/DeletedExercises");
const ExerciseCompletion = require("../models/ExerciseCompletion");

// Fetch exercises with pagination
const getExercises = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const offset = parseInt(req.query.offset) || 0; // Default offset

    if (limit < 1 || offset < 0) {
      return res.status(400).json({ error: "Invalid limit or offset values" });
    }

    // Get total count of exercises
    const total = await Exercise.countDocuments();

    // Fetch exercises with pagination
    const exercises = await Exercise.find().skip(offset).limit(limit);

    res.status(200).json({ total, exercises });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
};

// Create a recommendation
const recommendExercise = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the incoming request body

    const { userId, exerciseId, notes, tags } = req.body;

    // Validate required fields
    if (!userId || !exerciseId) {
      return res
        .status(400)
        .json({ error: "userId and exerciseId are required" });
    }

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
    console.error("Error in recommendExercise controller:", error); // Log error details
    res.status(500).json({ error: "Failed to recommend exercise" });
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

// Create or update an edited exercise
const editExercise = async (req, res) => {
  try {
    const { exerciseId, updatedFields } = req.body;
    const editedExercise = await EditedExercises.findOneAndUpdate(
      { exerciseId },
      { updatedFields },
      { new: true, upsert: true } // Create if not found
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

// Mark an exercise as deleted
const deleteExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const alreadyDeleted = await DeletedExercises.exists({ exerciseId });

    if (alreadyDeleted) {
      return res
        .status(400)
        .json({ message: "Exercise already marked as deleted" });
    }

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
    const userId = req.user.id;
    const username = req.user.username;
    const { exerciseId } = req.body;

    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    const completion = new ExerciseCompletion({
      userId,
      username,
      exerciseId,
      workoutType: exercise.workoutType,
      target: exercise.target,
      level: exercise.level,
      completedAt: new Date(),
    });

    await completion.save();

    req.io.to("admins").emit("exerciseCompleted", {
      userId,
      username,
      workoutType: exercise.workoutType,
      target: exercise.target,
      level: exercise.level,
      completedAt: completion.completedAt,
    });

    res.status(200).json({ message: "Exercise completion recorded" });
  } catch (error) {
    console.error("Error recording exercise completion:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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
  getExercises,
};
