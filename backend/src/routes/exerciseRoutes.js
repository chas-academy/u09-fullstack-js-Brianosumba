const express = require("express");
const {
  getCompletedWorkouts,
  completeExercise,
} = require("../controllers/exerciseController");

const router = express.Router();

router.post("/complete", completeExercise);
router.get("/completed", getCompletedWorkouts);

module.exports = router;
