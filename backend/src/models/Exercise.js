const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bodyPart: { type: String, required: true },
  target: { type: String, required: true },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
