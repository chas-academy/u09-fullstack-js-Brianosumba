const express = require("express");
const {
  getCompletedWorkouts,
  completeExercise,
  deleteCompletedWorkout,
} = require("../controllers/exerciseController");

const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/complete", completeExercise);
router.get("/completed", getCompletedWorkouts);
router.delete(
  "/completed/:workoutId",
  verifyToken,
  verifyAdmin,
  deleteCompletedWorkout
);

module.exports = router;
