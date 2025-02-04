const Progress = require("../models/Progress");

//Get progress for a user
const getProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    //Fetch progress from the database
    let progress = await Progress.findOne({ userId });

    if (!progress) {
      //Create a new progress record if not found
      progress = new Progress({ userId });
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
    //Update progress in the database
    const updatedProgress = await Progress.findOneAndUpdate(
      { userId },
      {
        workoutsToday,
        workoutsThisWeek,
        workoutsThisMonth,
        strengthProgress,
        updatedAt: Date.now(),
      },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedProgress);
  } catch (error) {
    console.error("Error updating progress:", error.message);
    res.status(500).json({ error: "Failed to update progress." });
  }
};

module.exports = { getProgress, updateProgress };
