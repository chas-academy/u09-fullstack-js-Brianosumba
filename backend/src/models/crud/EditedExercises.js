//models/EditedExercise.js

const mongoose = require("mongoose");

const EditedExerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: String,
    required: true,
  },
  updatedFields: {
    type: Object,
    required: true,
  },
  editedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("EditedExercise", EditedExerciseSchema);
