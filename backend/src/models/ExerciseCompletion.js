// models/ExerciseCompletion.js

const mongoose = require("mongoose");

const ExerciseCompletionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  exerciseId: { type: String, required: true },
  workoutType: { type: String, required: true },
  target: { type: String, required: true },
  level: { type: String, required: true },
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ExerciseCompletion", ExerciseCompletionSchema);
