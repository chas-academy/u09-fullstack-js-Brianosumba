//models/RecommededEcercise.js

const mongoose = require("mongoose");

const RecommendedExerciseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  exerciseId: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: "",
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
