import {
  fetchExercisesfromDB,
  fetchRecommendations,
  recommendExercise,
  deleteRecommendation,
  editRecommendation,
} from "../../services/exerciseService";

/**
 * Fetch and set exercises (Handles offline caching)
 */
export const getExercises = async () => {
  try {
    const exercises = await fetchExercisesfromDB();
    console.log(" fetched exercises :", exercises);

    if (!Array.isArray(exercises)) {
      throw new Error("Invalid data format: Exercises should be an array.");
    }

    return exercises;
  } catch (error) {
    console.error("Error fetching exercises:", error.message || error);
    alert("Failed to load exercises. Please try again.");
    return []; // Return an empty array in case of error
  }
};

/**
 *  Handle recommending an exercise
 */
export const handleRecommendExercise = async (userId, exerciseId) => {
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
  try {
    const response = await editRecommendation(recommendationId, updatedFields);
    return response.data;
  } catch (error) {
    console.error("Error updating recommendation:", error.message || error);
    alert("Failed to update recommendation. Please try again.");
  }
};

/**
 *  Handle deleting a recommendation
 */
export const handleDeleteRecommendation = async (recommendationId) => {
  try {
    await deleteRecommendation(recommendationId);
    console.log(`Deleted recommendation with ID ${recommendationId}`);
    alert("Recommendation deleted successfully!");
  } catch (error) {
    console.error("Error deleting recommendation:", error.message || error);
    alert("Failed to delete recommendation. Please try again.");
  }
};

/**
 *Fetch recommendations for the given user ID
 */
export const fetchUserRecommendations = async (userId, setRecommendations) => {
  try {
    // Ensure the user ID is provided
    if (!userId) {
      throw new Error("User ID is required to fetch recommendations");
    }

    const recommendations = await fetchRecommendations(userId);
    console.log(`Fetched recommendations for user ${userId}:`, recommendations);

    // Update state with fetched recommendations
    setRecommendations(recommendations);
  } catch (error) {
    // Handle and log errors during fetching recommendations
    console.error(
      `Error fetching recommendations for user ID ${userId}:`,
      error.message || error
    );
    alert("Failed to load recommendations. Please try again.");
  }
};

/**
 * Sync offline actions when back online
 */
window.addEventListener("online", async () => {
  console.log("🔄 Online detected! Syncing offline data...");
  await syncRecommendations();
  await syncOfflineEdits();
  await syncOfflineDeletes();
});
