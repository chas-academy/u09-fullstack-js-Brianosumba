const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  exerciseId: { type: String, required: true, unique: true },
  requestedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
