const mongoose = require("mongoose");

const recommendedExerciseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise", // Reference to the Exercise model
    required: true,
  },
  notes: {
    type: String,
    trim: true, // Optional: Trim whitespace
  },
  tags: {
    type: [String],
    default: [], // Default to an empty array if no tags are provided
  },
  recommendedAt: {
    type: Date,
    default: Date.now, // Automatically set the current date
  },
});

module.exports = mongoose.model(
  "RecommendedExercise",
  recommendedExerciseSchema
);
