const Progress = require("../models/Progress");

//Get progress for a user
const getProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch progress from the database
    let progress = await Progress.findOne({ userId });

    if (!progress) {
      // Create a new progress record if not found with default values
      progress = new Progress({
        userId,
        workoutsToday: 0,
        workoutsThisWeek: 0,
        workoutsThisMonth: 0,
        strengthProgress: 0,
      });
      await progress.save();
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error.message);
    res.status(500).json({ error: "Failed to fetch progress." });
  }
};

//Update progress for a user
const updateProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      workoutsToday,
      workoutsThisWeek,
      workoutsThisMonth,
      strengthProgress,
    } = req.body;

    // Ensure progress exists or create a new one
    let progress = await Progress.findOne({ userId });

    if (!progress) {
      // If no progress found, create a new one with default values
      progress = new Progress({
        userId,
        workoutsToday: workoutsToday || 0,
        workoutsThisWeek: workoutsThisWeek || 0,
        workoutsThisMonth: workoutsThisMonth || 0,
        strengthProgress: strengthProgress || 0,
      });
    } else {
      // Update only fields that were provided
      if (workoutsToday !== undefined) progress.workoutsToday = workoutsToday;
      if (workoutsThisWeek !== undefined)
        progress.workoutsThisWeek = workoutsThisWeek;
      if (workoutsThisMonth !== undefined)
        progress.workoutsThisMonth = workoutsThisMonth;
      if (strengthProgress !== undefined)
        progress.strengthProgress = strengthProgress;
    }

    // Save the updated progress
    await progress.save();

    res.status(200).json(progress);
  } catch (error) {
    console.error("Error updating progress:", error.message);
    res.status(500).json({ error: "Failed to update progress." });
  }
};

module.exports = { getProgress, updateProgress };
