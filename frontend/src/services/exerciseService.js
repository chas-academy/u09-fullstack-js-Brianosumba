import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const EXERCISE_DB_API = "https://exercisedb.p.rapidapi.com/exercises";
const HEADERS = {
  "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
};

const CACHE_KEY = "exercises_cache";
const CACHE_EXPIRATION_KEY = "exercises_cache_expiration";
const CACHE_DURATION_MS = 30 * 60 * 1000;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// /**
//  * Fetch exercises from the ExerciseDB API.
//  * @param {number} limit - The maximum number of results to fetch.
//  * @param {number} offset - The offset for paginated results.
//  * @returns {object[]} Array of exercises from the API.
//  */

export const fetchExercisesfromDB = async (limit = 10, offset = 0) => {
  const now = new Date().getTime();
  const cachedData = localStorage.getItem(CACHE_KEY);
  const cacheExpiration = localStorage.getItem(CACHE_EXPIRATION_KEY);

  if (cachedData && cacheExpiration && now < parseInt(cacheExpiration)) {
    console.log("Using cached exercises from localstorage.");
    return JSON.parse(cachedData);
  }

  try {
    console.log(
      `Fetching exercises with limit=${limit} and offset=${offset}...`
    );
    const response = await axios.get(EXERCISE_DB_API, {
      headers: HEADERS,
      params: { limit, offset },
    });

    console.log("Response from ExerciseDB:", response.data);

    localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
    localStorage.setItem(CACHE_EXPIRATION_KEY, now + CACHE_DURATION_MS);

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching exercises from ExerciseDB API:",
      error.message
    );
    throw new Error("Failed to fetch exercises. Please try again later.");
  }
};

//Fetch all recommendations (for admin)
export const fetchAllRecommendations = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/recommendations`, {
      headers: getAuthHeaders(),
    });
    console.log("All recommendations fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all recommendations:", error.message);
    throw error;
  }
};

//fetch user-speciic recommendations
export const fetchRecommendations = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/recommendations/${userId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.data || Array.isArray(response.data)) {
      console.error("Invalid recommendations data:", response.data);
      throw new Error("Expected an array of recommendations.");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error.message || error);
    throw error;
  }
};

//Recommend an exercise
export const recommendExercise = async (recommendationData) => {
  try {
    console.log("Payload being sent to backend:", recommendationData);

    const response = await axios.post(
      `${BASE_URL}/recommendations`,
      recommendationData,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("Backend Response Data:", response.data);

    return response.data.data;
  } catch (error) {
    console.error("Error recommending exercise:", error.message || error);
    throw error;
  }
};

//Edit and existing recommendation
export const editRecommendation = async (recommendationId, updatedFields) => {
  console.log("Updating recommendation with ID:", recommendationId);
  console.log("Payload being sent:", updatedFields);
  try {
    const response = await axios.patch(
      `${BASE_URL}/recommendations/${recommendationId}`,
      updatedFields,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error editing recommendation:", error.message || error);
    throw error;
  }
};
export const deleteRecommendation = async (recommendationId) => {
  try {
    console.log("Deleting recommendation with ID:", recommendationId);

    const response = await axios.delete(
      `${BASE_URL}/recommendations/${recommendationId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting recommendation:", error.message || error);
    throw error;
  }
};

export const handleDeleteCompletedWorkout = async (workoutId) => {
  console.log("API Request - Deleting workout with ID:", workoutId);

  if (!workoutId) {
    throw new Error("Workout ID is required.");
  }

  try {
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
