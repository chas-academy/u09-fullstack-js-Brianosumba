import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const EXERCISE_DB_API = "https://exercisedb.p.rapidapi.com/exercises";
const HEADERS = {
  "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
};

const CACHE_KEY = "exercises_cache";
const CACHE_EXPIRATION_KEY = "exercises_cache_expiration";
const CACHE_DURATION_MS = 30 * 60 * 1000;

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

export const fetchAllRecommendations = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/recommendations`);
    console.log("All recommendations fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all recommendations:", error.message);
    throw error;
  }
};

export const fetchRecommendations = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/recommendations/${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error from backend:", errorDetails);
      throw new Error(
        errorDetails.message || "Failed to fetch recommendations."
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Invalid recommendations data:", data);
      throw new Error("Expected an array of recommendations.");
    }

    return data;
  } catch (error) {
    console.error("Error fetching recommendations:", error.message || error);
    throw error;
  }
};

export const recommendExercise = async (recommendationData) => {
  try {
    console.log("Payload being sent to backend:", recommendationData);

    const response = await fetch(`${BASE_URL}/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recommendationData),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error from backend:", errorDetails);
      throw new Error(errorDetails.message || "Failed to recommend exercise.");
    }

    const data = await response.json();
    console.log("Backend Response Data:", data);

    if (!data?.data || !data.data._id) {
      console.error("Invalid recommendation data:", data);
      throw new Error("Invalid recommendation data from backend");
    }

    const reformatted = {
      id: data.data._id,
      ...data.data,
    };

    console.log("Reformatted Recommendation:", reformatted);
    return reformatted;
  } catch (error) {
    console.error("Error recommending exercise:", error.message || error);
    throw error;
  }
};

export const editRecommendation = async (recommendationId, updatedFields) => {
  try {
    const response = await fetch(
      `${BASE_URL}/recommendation/${recommendationId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error from backend:", errorDetails);
      throw new Error(errorDetails.message || "Failed to edit recommendation.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error editing recommendation:", error.message || error);
    throw error;
  }
};
export const deleteRecommendation = async (recommendationId) => {
  try {
    console.log("Deleting recommendation with ID:", recommendationId);

    const response = await fetch(
      `${BASE_URL}/recommendations/${recommendationId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    const isJsonResponse = response.headers
      .get("content-type")
      ?.includes("application/json");

    if (!response.ok) {
      const errorDetails = isJsonResponse
        ? await response.json()
        : { message: await response.text() };
      console.error("Error from backend:", errorDetails);
      throw new Error(
        errorDetails.message || "Failed to delete recommendation."
      );
    }

    return isJsonResponse ? await response.json() : {};
  } catch (error) {
    console.error("Error deleting recommendation:", error.message || error);
    throw error;
  }
};
