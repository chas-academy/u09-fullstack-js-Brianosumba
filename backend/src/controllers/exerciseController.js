const RecommendedExercise = require("../models/crud/RecommendExercise");

// Get all recommendations for a user
const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const recommendations = await RecommendedExercise.find({ userId }).populate(
      "exerciseId",
      "name bodypart target"
    );

    if (!recommendations.length) {
      console.warn(`No recommendations found for user ID: ${userId}`);
      return res.status(404).json({ message: "No recommendations found." });
    }

    console.log(
      `Fetched ${recommendations.length} recommendations for user ID: ${userId}`
    );
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendation." });
  }
};

//Save Recommendation
const recommendExercise = async (req, res) => {
  try {
    const { userId, exerciseId, notes, tags } = req.body;
    if (!userId || !exerciseId) {
      return res
        .status(400)
        .json({ error: "userId and exerciseId are required" });
    }
    const recommendation = new RecommendedExercise({
      userId,
      exerciseId,
      notes: notes?.trim(),
      tags: Array.isArray(tags) ? tags : [],
    });

    await recommendation.save();
    console.log("Exercise recommended successfully:", recommendation);
    res
      .status(201)
      .json({ message: "Exercise recommended successfully", recommendation });
  } catch (error) {
    console.error("Error recommending exercise:", error.message);
    res.status(500).json({ error: "Failed to recommend exercise." });
  }
};

//Delete a Recommendation
const deleteRecommendation = async (req, res) => {
  try {
    const { recommendationId } = req.params;

    if (!recommendationId) {
      return res.status(400).json({ error: "Recommendation ID is required." });
    }

    const deleteRecommendation = await RecommendedExercise.findByIdAndDelete(
      recommendationId
    );

    if (!deleteRecommendation) {
      return res.status(404).json({ error: "Recommmendation not found." });
    }

    console.log("Recommendation deleted succesfully:", recommendationId);
    res.status(200).json({ message: "Recommendation deleted successfully" });
  } catch (error) {
    console.error("Error deleting recommendation:", error.message);
    res.status(500).json({ error: "Failed to delete recommendation" });
  }
};

//Edit a recommendation
const editRecommendation = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { exerciseId } = req.body;

    if (!exerciseId) {
      return res.status(400).json({ error: "Exercise ID is required." });
    }
    const updatedRecommendation = await RecommendedExercise.findByIdAndUpdate(
      recommendationId,
      { exerciseId, notes, tags },
      { new: true }
    );

    if (!updatedRecommendation) {
      return res.status(404).json({ error: "Recommendation not found." });
    }

    console.log("Recommendation updated successfully:", updatedRecommendation);

    res.status(200).json({
      message: "Recommendation updated successfully",
      updatedRecommendation,
    });
  } catch (error) {
    console.error("Error editing recommendation:", error.message);
    res.status(500).json({ error: "Failed to update recommendation." });
  }
};

module.exports = {
  getRecommendations,
  recommendExercise,
  deleteRecommendation,
  editRecommendation,
};
