import {
  fetchExercisesfromDB,
  fetchRecommendations,
  recommendExercise,
  deleteRecommendation,
  editRecommendation,
} from "../../services/exerciseService";

import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

/**
 * Fetch and set exercises (Handles offline caching)
 */
export const getExercises = async () => {
  try {
    const exercises = await fetchExercisesfromDB();
    console.log("Fetched exercises:", exercises);

    if (!Array.isArray(exercises)) {
      throw new Error("Invalid data format: Exercises should be an array.");
    }

    return exercises;
  } catch (error) {
    console.error("Error fetching exercises:", error.message || error);
    alert("Failed to load exercises. Please try again.");
    return [];
  }
};

/**
 * Handle recommending an exercise
 */
export const handleRecommendExercise = async (userId, exerciseId) => {
  if (!userId || !exerciseId) {
    console.error("Missing userId or exerciseId:", { userId, exerciseId });
    alert("Invalid user or exercise selection.");
    return;
  }

  try {
    const recommendationPayload = {
      userId,
      exerciseId,
      notes: "Recommended workout for user",
      tags: ["strength", "cardio"],
    };

    console.log(
      "Payload being sent to recommendExercise:",
      recommendationPayload
    );

    const response = await recommendExercise(recommendationPayload);

    console.log("Recommendation Response:", response);
    alert("Exercise recommended successfully!");

    // Emit event to notify ExerciseDetail.jsx
    socket.emit("recommendationUpdated", { userId });

    return response;
  } catch (error) {
    console.error("Error recommending exercise:", error.message || error);
    alert("Failed to recommend exercise. Please try again.");
    throw error;
  }
};

/**
 * Handle Updating a recommendation
 */
export const handleUpdateRecommendation = async (
  recommendationId,
  updatedFields
) => {
  if (!recommendationId || !updatedFields.exerciseId) {
    console.error("Missing recommendationId or updatedFields:", {
      recommendationId,
      updatedFields,
    });
    alert("Invalid recommendation update request.");
    return;
  }

  try {
    const response = await editRecommendation(recommendationId, updatedFields);

    console.log("Recommendation updated:", response);

    // Ensure response contains userId before emitting socket event
    const userId = response?.data?.userId || updatedFields.userId;
    if (userId) {
      socket.emit("recommendationUpdated", { userId });
    }

    alert("Recommendation updated successfully!");
    return response;
  } catch (error) {
    console.error("Error updating recommendation:", error.message || error);
    alert("Failed to update recommendation. Please try again.");
  }
};

/**
 * Handle deleting a recommendation
 */
export const handleDeleteRecommendation = async (recommendationId) => {
  if (!recommendationId) {
    console.error("Missing recommendationId for deletion.");
    alert("Invalid recommendation deletion request.");
    return;
  }

  try {
    const response = await deleteRecommendation(recommendationId);
    console.log(`Deleted recommendation with ID ${recommendationId}`);

    // Ensure response contains userId before emitting socket event
    const userId = response?.data?.userId;
    if (userId) {
      socket.emit("recommendationUpdated", { userId });
    }

    alert("Recommendation deleted successfully!");
    return response; // ✅ Return response to confirm successful deletion
  } catch (error) {
    console.error("Error deleting recommendation:", error.message || error);
    alert("Failed to delete recommendation. Please try again.");
  }
};

/**
 * Fetch recommendations for the given user ID
 */
export const fetchUserRecommendations = async (userId, setRecommendations) => {
  if (!userId) {
    console.error("User ID is required to fetch recommendations.");
    alert("Invalid user ID.");
    return;
  }

  try {
    const recommendations = await fetchRecommendations(userId);
    console.log(`Fetched recommendations for user ${userId}:`, recommendations);

    setRecommendations(recommendations);
  } catch (error) {
    console.error(
      `Error fetching recommendations for user ID ${userId}:`,
      error.message || error
    );
    alert("Failed to load recommendations. Please try again.");
  }
};
