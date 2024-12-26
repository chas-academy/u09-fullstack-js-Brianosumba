// models/crud/DeletedExercise.js
const mongoose = require("mongoose");

const DeletedExerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate entries
  },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DeletedExercise", DeletedExerciseSchema);
