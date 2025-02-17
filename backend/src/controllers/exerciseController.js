const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const RecommendedExercise = require("../models/crud/RecommendExercise");
const WorkoutCompletion = require("../models/WorkoutCompletion");
const axios = require("axios");

// Get all recommendations for all users (Admin)
const getAllRecommendations = async (req, res) => {
  try {
    console.log("Fetching all recommendations...");
    const recommendations = await RecommendedExercise.find();

    const recommendationsWithDetails = await Promise.all(
      recommendations.map(async (recommendation) => {
        try {
          const exerciseResponse = await axios.get(
            `https://exercisedb.p.rapidapi.com/exercises/exercise/${recommendation.exerciseId}`,
            {
              headers: {
                "X-RapidAPI-KEY": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
              },
            }
          );

          return {
            ...recommendation.toObject(),
            exerciseDetails: exerciseResponse.data,
          };
        } catch (error) {
          console.error(
            `❌ Failed to fetch exercise details for ID: ${recommendation.exerciseId}`,
            error.message
          );
          return { ...recommendation.toObject(), exerciseDetails: null };
        }
      })
    );

    res.status(200).json(recommendationsWithDetails);
  } catch (error) {
    console.error("❌ Error fetching all recommendations:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations." });
  }
};

// Get recommendations for a specific user
const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching recommendations for userId: ${userId}`);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("❌ Invalid User ID:", userId);
      return res.status(400).json({ error: "Invalid User ID." });
    }

    const recommendations = await RecommendedExercise.find({ userId });

    if (!recommendations.length) {
      console.warn(`⚠️ No recommendations found for userId: ${userId}`);
      return res.status(200).json([]); // Return empty array instead of 404
    }

    const recommendationsWithDetails = await Promise.all(
      recommendations.map(async (recommendation) => {
        try {
          const exerciseResponse = await axios.get(
            `https://exercisedb.p.rapidapi.com/exercises/exercise/${recommendation.exerciseId}`,
            {
              headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
              },
            }
          );

          return {
            ...recommendation.toObject(),
            exerciseDetails: exerciseResponse.data,
          };
        } catch (error) {
          console.error(
            `❌ Failed to fetch details for exerciseId: ${recommendation.exerciseId}`,
            error.message
          );
          return { ...recommendation.toObject(), exerciseDetails: null };
        }
      })
    );

    res.status(200).json(recommendationsWithDetails);
  } catch (error) {
    console.error("❌ Error fetching recommendations:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations." });
  }
};

// Save a new recommendation
const recommendExercise = async (req, res) => {
  try {
    console.log("Request received to recommend an exercise:", req.body);
    const { userId, exerciseId, notes = "", tags = [] } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid User ID." });
    }

    const recommendation = new RecommendedExercise({
      userId,
      exerciseId,
      notes: notes.trim(),
      tags: Array.isArray(tags) ? tags : [],
    });

    await recommendation.save();
    console.log("✅ Exercise recommended successfully:", recommendation);
    res.status(201).json({
      success: true,
      message: "Exercise recommended successfully",
      data: recommendation,
    });
  } catch (error) {
    console.error("❌ Error recommending exercise:", error.message);
    res.status(500).json({ error: "Failed to recommend exercise." });
  }
};

// Delete a recommendation
const deleteRecommendation = async (req, res) => {
  try {
    const { recommendationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recommendationId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Recommendation ID." });
    }

    const deletedRecommendation = await RecommendedExercise.findByIdAndDelete(
      recommendationId
    );
    if (!deletedRecommendation) {
      return res
        .status(404)
        .json({ success: false, error: "Recommendation not found." });
    }

    console.log("✅ Successfully deleted recommendation:", recommendationId);
    res
      .status(200)
      .json({ success: true, message: "Recommendation deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting recommendation:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Failed to delete recommendation" });
  }
};

// Edit a recommendation
const editRecommendation = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { exerciseId, notes = "", tags = [] } = req.body;

    if (!mongoose.Types.ObjectId.isValid(recommendationId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Recommendation ID." });
    }

    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Exercise ID." });
    }

    const updatedRecommendation = await RecommendedExercise.findByIdAndUpdate(
      recommendationId,
      {
        exerciseId,
        notes: notes.trim(),
        tags: Array.isArray(tags) ? tags : [],
      },
      { new: true }
    );

    if (!updatedRecommendation) {
      return res
        .status(404)
        .json({ success: false, error: "Recommendation not found." });
    }

    console.log(
      "✅ Recommendation updated successfully:",
      updatedRecommendation
    );
    res.status(200).json({
      success: true,
      message: "Recommendation updated successfully",
      data: updatedRecommendation,
    });
  } catch (error) {
    console.error("❌ Error editing recommendation:", error.message);
    res.status(500).json({ error: "Failed to update recommendation." });
  }
};

// Fetch completed workouts
const getCompletedWorkouts = async (req, res) => {
  try {
    const completedWorkouts = await WorkoutCompletion.find()
      .populate("userId", "username")
      .exec();

    const formattedWorkouts = completedWorkouts.map((workout) => ({
      username: workout.userId?.username || "Unknown User",
      workoutType: workout.workoutType,
      target: workout.target,
      level: workout.level,
      completedAt: workout.completedAt,
    }));

    res.status(200).json(formattedWorkouts);
  } catch (error) {
    console.error("❌ Error fetching completed workouts:", error.message);
    res.status(500).json({ error: "Failed to fetch completed workouts." });
  }
};

module.exports = {
  getRecommendations,
  getAllRecommendations,
  recommendExercise,
  deleteRecommendation,
  editRecommendation,
  getCompletedWorkouts,
};
