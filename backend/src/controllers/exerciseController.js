//Controllers/exerciseController.js

import RecommendedExercise from "../models/crud/RecommendExercise";

//Create a recommendation
export const recommendExercise = async (req, res) => {
  try {
    const { userId, exerciseId, notes, tags } = req.body;
    const recommendation = new RecommendedExercise({
      userId,
      exerciseId,
      notes,
      tags,
    });
    await recommendation.save();
    res
      .status(201)
      .json({ message: "Exercise recommended successfully", recommendation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error recommending exercise", error: error.message });
  }
};

//fetch all recomandations for a user
export const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const recommendations = await RecommendedExercise.find({ userId });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching recommendations",
      error: error.message,
    });
  }
};

//Delete a recommendation
export const deleteRecommendation = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    await RecommendedExercise.findByIdAndDelete(recommendationId);
    res.json({ message: "Recommendation deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting recommendation", error: error.message });
  }
};

// Crud functions for edited exercises

import EditedExercises from "../models/crud/EditedExercises";

// Create or update an edited exercise
export const EditExercise = async (req, res) => {
  try {
    const { exerciseId, updatedFields } = req.body;
    const editedExercise = await EditedExercises.findOneAndUpdate(
      { exerciseId },
      { updatedFields },
      { new: true, upsert: true } //creates a new document if not found
    );
    res.json({ message: "Exercise edited successfully", editedExercise });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error editing exercise", error: error.message });
  }
};

// Fetch edited exercise by ID
export const getEditedExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const editedExercise = await EditedExercises.findOne({ exerciseId });
    if (!editedExercise) {
      return res.staus(404).json({ message: "Edited exercise not found" });
    }
    res.json(editedExercise);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching edited exercise",
      error: error.message,
    });
  }
};

//Delete an edited exercise
export const deleteEditedExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    await EditedExercise.findOneAndDelete({ exerciseId });
    res.json({ message: "Edited exercise deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting edited exercise",
      error: error.message,
    });
  }
};

// Crud functions for deleted exercises

import DeletedExercises from "../models/crud/DeletedExercises";

//Mark an exercise as deleted
export const deleteExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const deletedExercise = new DeletedExercises({ exerciseId });
    await deletedExercise.save();
    res.json({ message: "Exercise marked as deleted", deletedExercise });
  } catch (error) {
    res.status(500).json({
      message: "Error marking exercise as deleted",
      error: error.message,
    });
  }
};

//Check if an exercise is deleted
export const isExerciseDeleted = async (exerciseId) => {
  return await DeletedExercise.exists({ exerciseId });
};
