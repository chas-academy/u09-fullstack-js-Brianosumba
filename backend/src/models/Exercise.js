// src/models/Exercise.js
const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  target: { type: String, required: true },
  difficulty: { type: String, required: true },
  workoutType: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;
