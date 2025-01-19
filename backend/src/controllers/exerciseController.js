const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const RecommendedExercise = require("../models/crud/RecommendExercise");
const WorkoutCompletion = require("../models/WorkoutCompletion");
const axios = require("axios");

// Get all recommendations for a user
const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Fetch recommendations from your database
    const recommendations = await RecommendedExercise.find({ userId });

    if (!recommendations.length) {
      return res.status(404).json({ message: "No recommendations found." });
    }

    // Dynamically fetch exercise details from the ExerciseDB API
    const recommendationsWithDetails = await Promise.all(
      recommendations.map(async (recommendation) => {
        try {
          const exerciseResponse = await axios.get(
            `https://exercisedb.p.rapidapi.com/exercises/exercise/${recommendation.exerciseId}`,
            {
              headers: {
                "X-RAPIDAPI-KEY": process.env.RAPIDAPI_KEY,
                "X-RAPIDAPI-HOST": "exercisedb.p.rapidapi.com",
              },
            }
          );

          return {
            ...recommendation.toObject(),
            exerciseDetails: exerciseResponse.data,
          };
        } catch (error) {
          console.error(
            `Failed to fetch details for exerciseId: ${recommendation.exerciseId}`,
            error
          );
          return recommendation; // Return the recommendation without exercise details if fetch fails
        }
      })
    );

    res.status(200).json(recommendationsWithDetails);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations." });
  }
};

//Save Recommendation
const recommendExercise = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { userId, exerciseId, notes = "", tags = [] } = req.body;

    if (!userId || !exerciseId) {
      return res
        .status(400)
        .json({ success: false, error: "userId and exerciseId are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid User Id or Exercise ID.",
      });
    }
    const recommendation = new RecommendedExercise({
      userId,
      exerciseId,
      notes: notes.trim(),
      tags: Array.isArray(tags) ? tags : [],
    });

    await recommendation.save();
    console.log("Exercise recommended successfully:", recommendation);
    res.status(201).json({
      success: true,
      message: "Exercise recommended successfully",
      data: recommendation,
    });
  } catch (error) {
    console.error("Error recommending exercise:", error.message);
    res.status(500).json({ error: "Failed to recommend exercise." });
  }
};

//Delete a Recommendation
const deleteRecommendation = async (req, res) => {
  try {
    const { recommendationId } = req.params;

    if (!recommendationId) {
      return res
        .status(400)
        .json({ success: false, error: "Recommendation ID is required." });
    }

    if (!mongoose.Types.ObjectId.isValid(recommendationId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Recommendation ID." });
    }

    const deleteRecommendation = await RecommendedExercise.findByIdAndDelete(
      recommendationId
    );

    if (!deleteRecommendation) {
      return res
        .status(404)
        .json({ success: false, error: "Recommmendation not found." });
    }

    console.log("Recommendation deleted succesfully:", recommendationId);
    res
      .status(200)
      .json({ success: true, message: "Recommendation deleted successfully" });
  } catch (error) {
    console.error("Error deleting recommendation:", error.message);
    res.status(500).json({ error: "Failed to delete recommendation" });
  }
};

//Edit a recommendation
const editRecommendation = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { exerciseId, notes = "", tags = [] } = req.body;

    if (!recommendationId) {
      return res
        .status(400)
        .json({ success: false, error: "Recommendation ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(recommendationId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Recommendation ID." });
    }

    if (!exerciseId) {
      return res
        .status(400)
        .json({ success: false, error: "Exercise ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(recommendationId)) {
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

    console.log("Recommendation updated successfully:", updatedRecommendation);

    res.status(200).json({
      success: true,
      message: "Recommendation updated successfully",
      data: updatedRecommendation,
    });
  } catch (error) {
    console.error("Error editing recommendation:", error.message);
    res.status(500).json({ error: "Failed to update recommendation." });
  }
};

//Completed Exercise
const completeExercise = async (req, res) => {
  try {
    const { userId, exerciseId, workoutType, target, level } = req.body;

    if (!userId || !exerciseId) {
      return res
        .status(400)
        .json({ error: "User ID and Exercise ID are required." });
    }

    // Save workout completion to the database
    const completedWorkout = new WorkoutCompletion({
      userId,
      exerciseId,
      workoutType,
      target,
      level,
    });

    await completedWorkout.save();

    // Fetch the user's username for the notification
    const user = await User.findById(userId).select("username");

    // Emit a socket.io event to the admin dashboard
    // Log the data being emitted
    console.log("Emitting exerciseCompleted event with data:", {
      username: user?.username || "Unknown User", // Ensure the username is included
      workoutType,
      target,
      level,
      completedAt: completedWorkout.completedAt,
    });

    req.io.to("admins").emit("exerciseCompleted", {
      username: user?.username || "Unknown User",
      workoutType,
      target,
      level,
      completedAt: completedWorkout.completedAt,
    });

    res.status(200).json({
      success: true,
      message: "Workout completion recorded!",
      data: completedWorkout,
    });
  } catch (error) {
    console.error("Error completing exercise:", error.message);
    res.status(500).json({ error: "Failed to complete exercise." });
  }
};

//fetch completed workouts

const getCompletedWorkouts = async (req, res) => {
  try {
    // Fetch completed workouts with associated user data
    const completedWorkouts = await WorkoutCompletion.find()
      .populate("userId", "username") // Fetch username from User model
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
    console.error("Error fetching completed workouts:", error.message);
    res.status(500).json({ error: "Failed to fetch completed workouts." });
  }
};

module.exports = {
  getRecommendations,
  recommendExercise,
  deleteRecommendation,
  editRecommendation,
  completeExercise,
  getCompletedWorkouts,
};
