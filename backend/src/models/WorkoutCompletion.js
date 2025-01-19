const mongoose = require("mongoose");

const WorkoutCompletionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    required: true,
  },
  exerciseId: {
    type: String, // ID of the exercise from ExerciseDB API
    required: true,
  },
  workoutType: {
    type: String, // Type of workout (e.g., "upper body", "lower body")
    required: true,
  },
  target: {
    type: String, // Targeted muscle group (e.g., "biceps", "quads")
    required: true,
  },
  level: {
    type: String, // Difficulty level (e.g., "Beginner", "Intermediate", "Advanced")
    required: true,
  },
  completedAt: {
    type: Date, // Timestamp of when the workout was completed
    default: Date.now,
  },
});

module.exports = mongoose.model("WorkoutCompletion", WorkoutCompletionSchema);
