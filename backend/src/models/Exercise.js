// In models/Exercise.js
const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: String,
    required: true,
  },
  name: String,
  workoutType: String,
  target: String,
  level: String,
  recommended: {
    type: Boolean,
    default: false,
  },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise; // CommonJS export
