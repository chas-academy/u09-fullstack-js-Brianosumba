//models/EditExercise.js
import mongoose from "mongoose";

const editedExerciseSchema = new mongoose.Schema({
  exerciseId: { type: String, required: true }, //Original exercise ID from ExerciseDB
  updatedFields: { type: Map, of: String }, //A map to store updated fields and values
  editedAt: { type: Date, default: Date.now },
});

export default mongoose.model("EditedExercise", editedExerciseSchema);
