//models/RecommededExercise.js
const mongoose = require("mongoose");

const RecommendedExerciseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  exerciseId: {
    type: String, // Store the exercise ID from the external API
    required: true,
  },
  exerciseDetails: {
    type: Object,
    required: true,
  },
  notes: {
    type: String,
    default: "",
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "RecommendedExercise",
  RecommendedExerciseSchema
);
