const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const RecommendedExercise = require("../models/crud/RecommendExercise");
const WorkoutCompletion = require("../models/WorkoutCompletion");
const axios = require("axios");

// Get all recommendations for all users
const getAllRecommendations = async (req, res) => {
  try {
    const recommendations = await RecommendedExercise.find();

    if (!recommendations.length) {
      return res.status(200).json([]);
    }

    const recommendationsWithDetails = recommendations.map(
      (recommendation) => ({
        ...recommendation.toObject(),
        exerciseDetails: recommendation.exerciseDetails,
      })
    );

    res.status(200).json(recommendationsWithDetails);
  } catch (error) {
    console.error("Error fetching all recommendations:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations." });
  }
};
// Get all recommendations for a user
const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching recommendations for userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid User ID:", userId);
      return res.status(400).json({ error: "Invalid User ID." });
    }

    const recommendations = await RecommendedExercise.find({ userId });

    if (!recommendations.length) {
      console.log("No recommendations found for userId:", userId);
      return res.status(200).json([]);
    }

    console.log("Recommendations found:", recommendations);

    //  Directly return the stored exercise details instead of re-fetching
    const recommendationsWithDetails = recommendations.map(
      (recommendation) => ({
        ...recommendation.toObject(),
        exerciseDetails: recommendation.exerciseDetails,
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

    let exerciseDetails;
    try {
      const exerciseResponse = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/exercise/${exerciseId}`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        }
      );
      exerciseDetails = exerciseResponse.data;
    } catch (error) {
      console.error("Error fetching exercise details:", error.message);
      return res
        .status(400)
        .json({ error: "Invalid exercise ID or API issue." });
    }

    const recommendedExercise = new RecommendedExercise({
      userId,
      exerciseId,
      notes: notes.trim(),
      tags: Array.isArray(tags) ? tags : [],
      exerciseDetails,
    });

    await recommendedExercise.save();
    console.log(" Exercise recommended successfully:", recommendedExercise);

    //Emit WebSocket event
    const io = req.app.get("io");
    io.emit("recommendationUpdated", {
      userId,
      recommendations: await RecommendedExercise.find({ userId }),
    });

    res.status(201).json({
      success: true,
      message: "Exercise recommended successfully",
      data: recommendedExercise,
    });
  } catch (error) {
    console.error(" Error recommending exercise:", error.message);
    res.status(500).json({ error: "Failed to recommend exercise." });
  }
};

//Delete a Recommendation
const deleteRecommendation = async (req, res) => {
  console.log("DELETE request received for ID:", req.params);

  try {
    const { recommendationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recommendationId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Recommendation ID." });
    }

    //  Find and delete recommendation
    const deletedRecommendation = await RecommendedExercise.findByIdAndDelete(
      recommendationId
    );

    if (!deletedRecommendation) {
      return res
        .status(404)
        .json({ success: false, error: "Recommendation not found." });
    }

    console.log(" Successfully deleted:", recommendationId);

    //fetch updated recommendations
    const updatedRecommendations = await RecommendedExercise.find({
      userId: deletedRecommendation.userId,
    });

    //  Emit WebSocket event to update the user in real-time
    const io = req.app.get("io");
    io.emit("recommendationUpdated", {
      userId: deletedRecommendation.userId,
      recommendations: updatedRecommendations,
    });

    res.status(200).json({
      success: true,
      message: "Recommendation deleted successfully",
      recommendations: updatedRecommendations,
    });
  } catch (error) {
    console.error(" Error deleting recommendation:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Failed to delete recommendation" });
  }
};

//Edit a recommendation
const editRecommendation = async (req, res) => {
  console.log("Incoming PATCH request to edit recommendation");
  console.log("Params:", req.params);
  console.log("Body:", req.body);

  try {
    const { recommendationId } = req.params;
    const { exerciseId, notes = "", tags = [] } = req.body;

    if (!mongoose.Types.ObjectId.isValid(recommendationId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Recommendation ID." });
    }

    if (!exerciseId || typeof exerciseId !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Exercise ID format." });
    }

    // Find the existing recommendation
    const existingRecommendation = await RecommendedExercise.findById(
      recommendationId
    );
    if (!existingRecommendation) {
      return res
        .status(404)
        .json({ success: false, error: "Recommendation not found." });
    }

    const updateData = {
      exerciseId,
      notes: notes.trim(),
      tags: Array.isArray(tags) ? tags : [],
    };

    //  Fetch new exercise details **only if exerciseId has changed**
    if (exerciseId !== existingRecommendation.exerciseId) {
      try {
        const exerciseResponse = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/exercise/${exerciseId}`,
          {
            headers: {
              "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
              "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
          }
        );

        updateData.exerciseDetails = exerciseResponse.data; //  Store new details
      } catch (error) {
        console.error("Error fetching new exercise details:", error.message);
        return res
          .status(500)
          .json({ error: "Failed to fetch exercise details." });
      }
    }

    console.log("Updating recommendation with:", updateData);

    const updatedRecommendation = await RecommendedExercise.findByIdAndUpdate(
      recommendationId,
      updateData,
      { new: true }
    );

    if (!updatedRecommendation) {
      return res
        .status(404)
        .json({ success: false, error: "Recommendation not found." });
    }

    console.log("Recommendation updated successfully:", updatedRecommendation);

    // Emit WebSocket Event
    const io = req.app.get("io");
    io.emit("recommendationUpdated", {
      userId: updatedRecommendation.userId,
      recommendations: await RecommendedExercise.find({
        userId: updatedRecommendation.userId,
      }),
    });

    res.status(200).json({
      success: true,
      message: "Recommendation updated successfully",
      data: updatedRecommendation,
      recommendations: await RecommendedExercise.find({
        userId: updatedRecommendation.userId,
      }),
    });
  } catch (error) {
    console.error("Error editing recommendation:", error.message);
    res.status(500).json({ error: "Failed to update recommendation." });
  }
};

//  Completed Exercise
const completeExercise = async (req, res) => {
  try {
    const { userId, exerciseId, workoutType, target, level } = req.body;

    if (!userId || !exerciseId) {
      return res
        .status(400)
        .json({ error: "User ID and Exercise ID are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID." });
    }

    const existingCompletion = await WorkoutCompletion.findOne({
      userId,
      exerciseId,
      completedAt: {
        $gte: new Date().setHours(0, 0, 0, 0), // Start of the day
        $lt: new Date().setHours(23, 59, 59, 999), // End of the day
      },
    });

    if (existingCompletion) {
      return res
        .status(400)
        .json({ error: "You have already completed this exercise today." });
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

    // Fetch the user's username for notification
    const user = await User.findById(userId).select("username");

    // Emit WebSocket event
    const io = req.app.get("io");
    if (io) {
      console.log("Emitting exerciseCompleted event...");
      io.to("admins").emit("exerciseCompleted", {
        userId,
        username: user?.username || "Unkown User",
        exerciseId,
        workoutType,
        target,
        level,
        completedAt: completedWorkout.completedAt,
      });
    } else {
      console.warn("Websocket not available");
    }

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

// Fetch completed workouts (Admins see all, users see their own)
const getCompletedWorkouts = async (req, res) => {
  try {
    const { userId } = req.query; // Allow fetching workouts for a specific user (optional)

    let filter = {};
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid User ID." });
      }
      filter.userId = userId; //  Users can only fetch their own workouts
    }

    const completedWorkouts = await WorkoutCompletion.find(filter)
      .populate("userId", "username")
      .select("_id userId workoutType target level completedAt")
      .sort({ completedAt: -1 })
      .exec();

    const formattedWorkouts = completedWorkouts.map((workout) => ({
      _id: workout._id,
      username: workout.userId ? workout.userId.username : "Unknown User",
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

//Delete Complete Workouts
const deleteCompletedWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;

    //  Ensure `req.user` is available
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No valid user session." });
    }

    const requestUserId = req.user.id; // Extracted from `verifyToken`
    const requestUserRole = req.user.role; // Extracted from `verifyToken`

    //  Validate Workout ID
    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      return res.status(400).json({ error: "Invalid workout ID." });
    }

    const workout = await WorkoutCompletion.findById(workoutId);

    //  Ensure Workout Exists
    if (!workout) {
      return res.status(404).json({ error: "Workout not found." });
    }

    console.log("Deleting workout:", {
      workoutId,
      userId: requestUserId,
      userRole: requestUserRole,
    });

    // Allow only Admins OR Workout Owner to delete
    if (
      requestUserRole !== "admin" &&
      workout.userId.toString() !== requestUserId
    ) {
      console.warn(`Unauthorized deletion attempt by user ${requestUserId}`);
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this workout." });
    }

    //  Perform Deletion
    const deletedWorkout = await WorkoutCompletion.findByIdAndDelete(workoutId);

    if (!deletedWorkout) {
      return res
        .status(500)
        .json({ error: "Failed to delete workout. Try again later." });
    }

    console.log("Workout deleted successfully:", workoutId);
    res
      .status(200)
      .json({ success: true, message: "Workout deleted successfully." });
  } catch (error) {
    console.error("Error deleting workout:", error.message);
    res.status(500).json({ error: "Failed to delete workout." });
  }
};

module.exports = {
  getRecommendations,
  getAllRecommendations,
  recommendExercise,
  deleteRecommendation,
  editRecommendation,
  completeExercise,
  getCompletedWorkouts,
  deleteCompletedWorkout,
};
