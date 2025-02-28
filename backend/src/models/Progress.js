const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  workoutsToday: { type: Number, default: 0 },
  workoutsThisWeek: { type: Number, default: 0 },
  workoutsThisMonth: { type: Number, default: 0 },
  strengthProgress: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Progress", ProgressSchema);
