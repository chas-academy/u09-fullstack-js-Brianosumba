import {
  fetchExercisesfromDB,
  fetchRecommendations,
  recommendExercise,
  deleteRecommendation,
  editRecommendation,
  fetchExerciseDetails,
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

export const handleRecommendExercise = async (userId, exerciseId, token) => {
  if (!userId || !exerciseId || !token) {
    console.error(" Invalid parameters:", { userId, exerciseId, token });
    alert("Invalid user or exercise selection.");
    return;
  }

  const validExerciseId = String(exerciseId).trim();
  const validUserId = String(userId).trim();

  console.log(" Sending API Request - Exercise ID:", validExerciseId);

  try {
    //Fetch exercise details before recommending
    const exerciseDetails = await fetchExerciseDetails(validExerciseId);
    if (!exerciseDetails) {
      console.error("Exercise details not found for ID:", validExerciseId);
      alert("Failed to fetch exercise details. Try again");
      return;
    }

    const recommendationPayload = {
      userId: validUserId,
      exerciseId: validExerciseId,
      exerciseDetails,
      notes: "Recommended workout for user",
      tags: ["strength", "cardio"],
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log(
      " Payload being sent to recommendExercise:",
      recommendationPayload
    );

    const response = await recommendExercise(recommendationPayload, token);

    console.log(" Recommendation Response:", response);
    alert("Exercise recommended successfully!");

    socket.emit("recommendationUpdated", { userId: validUserId });

    return response;
  } catch (error) {
    console.error(
      " Error recommending exercise:",
      error.response?.data || error.message
    );
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
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch recommendations");
    }

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
