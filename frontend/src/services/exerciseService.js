import axios from "axios";

// Base URLs
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const EXERCISE_DB_API = "https://exercisedb.p.rapidapi.com/exercises";

// API Headers
const HEADERS = {
  "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
};

//Check for token expirtaion
const isTokenExpired = (token) => {
  try {
    const payloadBase64 = token.split(".")[1]; // Extract payload from JWT
    const decodedPayload = JSON.parse(atob(payloadBase64)); // Decode it
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

    return decodedPayload.exp && currentTime > decodedPayload.exp; // Check expiration
  } catch (error) {
    console.error("Token decoding failed:", error);
    return true; // Assume expired if decoding fails
  }
};

/**
 * Get Authorization Headers
 */

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    console.warn("No token found or token expired! Redirecting to login...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Redirect user to login
    return {};
  }

  console.log("Token being sent in headers:", token);

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

/**
 * Fetch All Exercises
 */
export const fetchExercisesfromDB = async (limit = 10, offset = 0) => {
  try {
    console.log(`Fetching exercises (limit=${limit}, offset=${offset})...`);
    const response = await axios.get(EXERCISE_DB_API, {
      headers: HEADERS,
      params: { limit, offset },
    });

    console.log("Exercises fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error.message);
    throw new Error("Failed to fetch exercises. Try again later.");
  }
};

/**
 * Fetch All Recommendations (Admin Panel) -
 */
export const fetchAllRecommendations = async () => {
  try {
    console.log("Fetching latest recommendations from API...");
    const response = await axios.get(`${BASE_URL}/recommendations`, {
      headers: getAuthHeaders(),
    });

    console.log("Recommendations fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching recommendations:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Fetch User-Specific Recommendations
 */
export const fetchRecommendations = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch recommendations.");
  }

  try {
    console.log(`Fetching recommendations for user ${userId}...`);
    const response = await axios.get(`${BASE_URL}/recommendations/${userId}`, {
      headers: getAuthHeaders(),
    });

    console.log("User-specific recommendations fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user-specific recommendations:",
      error.message
    );
    throw error;
  }
};

/**
 * Recommend an Exercise
 */
export const recommendExercise = async (recommendationData) => {
  try {
    console.log("Sending recommendation to backend...");
    const response = await axios.post(
      `${BASE_URL}/recommendations`,
      recommendationData,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("Recommendation saved:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error recommending exercise:", error.message);
    throw error;
  }
};

/**
 * Edit an Existing Recommendation
 */
export const editRecommendation = async (recommendationId, updatedFields) => {
  if (!recommendationId || !updatedFields) {
    throw new Error("Recommendation ID and updated fields are required.");
  }

  try {
    console.log(`Editing recommendation ${recommendationId}...`);
    const response = await axios.put(
      `${BASE_URL}/recommendations/${recommendationId}`,
      updatedFields,
      { headers: getAuthHeaders() }
    );

    console.log("Recommendation updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error editing recommendation:", error.message);
    throw error;
  }
};

/**
 * Delete Completed Workout
 */
export const handleDeleteCompletedWorkout = async (workoutId) => {
  if (!workoutId) {
    throw new Error("Workout ID is required.");
  }

  try {
    console.log(`Deleting workout ${workoutId}...`);
    const response = await axios.delete(
      `${BASE_URL}/exercises/completed/${workoutId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("Workout deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting workout:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Delete Recommendation
 */
export const deleteRecommendation = async (recommendationId) => {
  if (!recommendationId) {
    console.error("Missing recommendation ID for deletion.");
    return;
  }

  try {
    console.log(`Deleting recommendation ${recommendationId}...`);
    const response = await axios.delete(
      `${BASE_URL}/recommendations/${recommendationId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("Recommendation deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting recommendation:", error.message);
    throw error;
  }
};
