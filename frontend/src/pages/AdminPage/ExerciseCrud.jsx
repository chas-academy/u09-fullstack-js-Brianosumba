import {
  fetchExercises,
  fetchRecommendations,
  recommendExercise,
  updateRecommendation,
  deleteRecommendation,
} from "../../services/exerciseService";

/**
 *Fetch and set exercises
 *@param {Function} setExercises - state setter for exercises
 */
export const getExercises = async (setExercises) => {
  try {
    const exercises = await fetchExercises();
    console.log(" fetched exercises :", exercises);

    if (!Array.isArray(exercises)) {
      throw new Error("Invalid data format: Exercises should be an array.");
    }

    setExercises(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error.message || error);
    alert("Failed to load exercises. Please try again.");
  }
};

/**
 *  Handle recommending an exercise
 * @param {string} userId - ID of the user to recommend an exercise
 * @param {string} exerciseId - ID of the exercise to recommend
 */
export const handleRecommendExercise = async (userId, exerciseId) => {
  try {
    // Log inputs for debugging
    console.log("Received userId:", userId);
    console.log("Received exerciseId:", exerciseId);

    // Validate input parameters
    if (!userId || !exerciseId) {
      console.error("Invalid parameters. userId or exerciseId is missing.");
      alert("Please provide valid user and exercise details.");
      return;
    }

    // Prepare the recommendation payload

    const recommendationPayload = {
      userId,
      exerciseId,
      notes: "Recommended workout for user", // Example note
      tags: ["strength", "cardio"], // Example tags, modify as necessary
    };

    const response = await recommendExercise(recommendationPayload);

    // Notify user of success
    alert("Exercise recommended successfully!");
    console.log("Recommendation Response:", response);
  } catch (error) {
    // Handle and log errors during recommendation

    console.error("Error recommending exercise:", error.message || error);
    alert("Failed to recommend exercise. Please try again.");
  }
};

/**
 * Handle Updating a recommendation
 * @param {string} recommendationId - ID of the recommendation to update
 * @param {Object} updatedFields - Updated fields for the recommendation
 * @param {Function} setRecommendations - State setter for recommendations
 */

export const handleUpdateRecommendation = async (
  recommendationId,
  updatedFields,
  setRecommendations
) => {
  try {
    // Validate input parameters
    if (!recommendationId || !updatedFields) {
      throw new Error("Recommendation ID and updated fields are required");
    }

    const updatedRecommendation = await updateRecommendation(
      recommendationId,
      updatedFields
    );
    console.log("Updated recommendation:", updatedRecommendation);

    // Update the state  with the updated recommendation
    setRecommendations((prev) =>
      prev.map(
        (rec) => (rec.id === recommendationId ? updatedRecommendation : rec) // Update only the matching recommendation
      )
    );

    // Notify user of success
    alert("Recommendation updated successfully!");
  } catch (error) {
    // Handle and log errors during editing
    console.error(
      `Error editing exercise with ID ${exerciseId}:`,
      error.message || error
    );
    alert("Failed to update exercise. Please try again.");
  }
};

/**
 *  Handle deleting a recommendation
 * @param {string} recommendationId - ID of the recommendation to delete
 * @param {Function} setRecommendations - State setter for recommendations
 */
export const handleDeleteRecommendation = async (
  recommendationId,
  setRecommendations
) => {
  try {
    // Ensure the recommendation ID is provided
    if (!recommendationId) {
      throw new Error("Recommendation ID is required");
    }

    // Send delete request to the service
    await deleteRecommendation(recommendationId);
    console.log(`Deleted recommendation with ID ${recommendationId}`);

    // Update state by filtering out the deleted Recommendation
    setRecommendations((prev) =>
      prev.filter((rec) => rec.id !== recommendationId)
    );

    // Notify user of success
    alert("Recommendation deleted successfully!");
  } catch (error) {
    // Handle and log errors during deletion
    console.error(
      `Error deleting recommendation with ID ${recommendationId}:`,
      error.message || error
    );
    alert("Failed to delete recommendation with ID. Please try again.");
  }
};

/**
 *Fetch recommendations for the given user ID
 * @param {string} userId - ID of the user to fetch recommendations
 * @param {Function} setRecommendations - state setter for recommendations
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
