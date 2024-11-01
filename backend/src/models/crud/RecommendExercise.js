//models/RecommededEcercise.js

import mongoose from `mongoose`;

const recommendedExerciseSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  exerciseId: {type: String, required: true} , //ID from exerciseDB
  note: {type: String},
  tags: [{type: String}], //Tags like "strength", "beginner", etc
  recommendedAt: {type: Date, default: Date.now }
});

export default mongoose.model("RecommendedExercise", recommendedExerciseSchema);