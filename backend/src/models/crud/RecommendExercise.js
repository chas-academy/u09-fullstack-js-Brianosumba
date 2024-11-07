//models/RecommededEcercise.js

const mongoose = require("mongoose");

const recommendedExerciseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: "true",
  },
  notes: String,
  tags: [String],
  recommendedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "RecommendedExercise",
  recommendedExerciseSchema
);
