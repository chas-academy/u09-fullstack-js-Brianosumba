const Progress = require("../models/Progress");

// Get progress for a user
const getProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch progress from the database (DO NOT create a new record)
    const progress = await Progress.findOne({ userId });

    if (!progress) {
      return res
        .status(404)
        .json({ error: "No progress found for this user." });
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error.message);
    res.status(500).json({ error: "Failed to fetch progress." });
  }
};

// Update progress for a user
const updateProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progressUpdate = req.body;

    // Update only provided fields and automatically update `updatedAt`
    const updatedProgress = await Progress.findOneAndUpdate(
      { userId },
      {
        $set: {
          ...(progressUpdate.workoutsToday !== undefined && {
            workoutsToday: progressUpdate.workoutsToday,
          }),
          ...(progressUpdate.workoutsThisWeek !== undefined && {
            workoutsThisWeek: progressUpdate.workoutsThisWeek,
          }),
          ...(progressUpdate.workoutsThisMonth !== undefined && {
            workoutsThisMonth: progressUpdate.workoutsThisMonth,
          }),
          ...(progressUpdate.strengthProgress !== undefined && {
            strengthProgress: progressUpdate.strengthProgress,
          }),
        },
        $currentDate: { updatedAt: true }, // Automatically updates timestamp
      },
      { new: true, upsert: true } // Returns updated record and creates if missing
    );

    res.status(200).json(updatedProgress);
  } catch (error) {
    console.error("Error updating progress:", error.message);
    res.status(500).json({ error: "Failed to update progress." });
  }
};

module.exports = { getProgress, updateProgress };
