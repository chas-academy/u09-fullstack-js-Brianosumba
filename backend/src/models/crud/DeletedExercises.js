//models/DeletedExercise.js

import mongoose from "mongoose";

const deletedExerciseSchema = new mongoose.Schema({
  exerciseId: { type: String, required: true }, //ID from ExerciseDB
  deletedAt: { type: Date, default: Date.now },
});

export default mongoose.model("DeletedExercise", deletedExerciseSchema);
