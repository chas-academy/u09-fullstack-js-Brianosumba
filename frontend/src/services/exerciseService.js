import axios from "axios";
import { get, set } from "idb-keyval"; // IndexedDB for offline caching

//  Base URLs
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const EXERCISE_DB_API = "https://exercisedb.p.rapidapi.com/exercises";

//  API Headers
const HEADERS = {
  "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
};

//  Cache Settings (IndexedDB)
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const CACHE_EXERCISES = "cached-exercises";
const CACHE_EXPIRATION_EXERCISES = "exercises_cache_expiration";
const CACHE_RECOMMENDATIONS = "cached-recommendations";
const CACHE_EXPIRATION_RECOMMENDATIONS = "recommendations_cache_expiration";

//  Offline Queues for Syncing
const OFFLINE_QUEUE_KEY = "offline-recommendations";
const OFFLINE_EDIT_QUEUE = "offline-edit-recommendations";
const OFFLINE_DELETE_QUEUE = "offline-delete-recommendations";
const OFFLINE_DELETE_WORKOUT_QUEUE = "offline-delete-workouts";

/**
 *  Get Authorization Headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 *  Fetch All Exercises (with Offline Caching)
 */
export const fetchExercisesfromDB = async (limit = 10, offset = 0) => {
  try {
    const now = Date.now();
    const cachedData = await get(CACHE_EXERCISES);
    const cacheExpiration = await get(CACHE_EXPIRATION_EXERCISES);

    if (cachedData && cacheExpiration && now < cacheExpiration) {
      console.log("Using cached exercises.");
      return cachedData;
    }

    if (!navigator.onLine) {
      console.warn(" Offline: Using cached exercises...");
      if (cachedData) return cachedData;
      throw new Error(" No cached exercises available. Please go online.");
    }

    console.log(` Fetching exercises (limit=${limit}, offset=${offset})...`);
    const response = await axios.get(EXERCISE_DB_API, {
      headers: HEADERS,
      params: { limit, offset },
    });

    console.log("Exercises fetched:", response.data);
    await set(CACHE_EXERCISES, response.data);
    await set(CACHE_EXPIRATION_EXERCISES, now + CACHE_DURATION_MS);

    return response.data;
  } catch (error) {
    console.error(" Error fetching exercises:", error.message);
    throw new Error(" Failed to fetch exercises. Try again later.");
  }
};

/**
 *  Fetch All Recommendations (Admin Panel)
 */
export const fetchAllRecommendations = async (forceRefresh = false) => {
  try {
    const now = Date.now();
    const cachedData = await get(CACHE_RECOMMENDATIONS);
    const cacheExpiration = await get(CACHE_EXPIRATION_RECOMMENDATIONS);

    if (
      !forceRefresh &&
      cachedData &&
      cacheExpiration &&
      now < cacheExpiration
    ) {
      console.log(" Using cached recommendations.");
      return cachedData;
    }

    if (!navigator.onLine) {
      console.warn(" Offline: Using cached recommendations...");
      if (cachedData) return cachedData;
      throw new Error(" No cached recommendations found.");
    }

    console.log(" Fetching latest recommendations from API...");
    const response = await axios.get(`${BASE_URL}/recommendations`, {
      headers: getAuthHeaders(),
    });

    console.log(" Recommendations fetched:", response.data);
    await set(CACHE_RECOMMENDATIONS, response.data);
    await set(CACHE_EXPIRATION_RECOMMENDATIONS, now + CACHE_DURATION_MS);

    return response.data;
  } catch (error) {
    console.error(
      " Error fetching recommendations:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 *  Fetch User-Specific Recommendations
 */
export const fetchRecommendations = async (userId, forceRefresh = false) => {
  if (!userId) {
    throw new Error(" User ID is required to fetch recommendations.");
  }

  try {
    const now = Date.now();
    const cacheKey = `${CACHE_RECOMMENDATIONS}-${userId}`;
    const cacheExpirationKey = `${CACHE_EXPIRATION_RECOMMENDATIONS}-${userId}`;

    const cachedData = await get(cacheKey);
    const cacheExpiration = await get(cacheExpirationKey);

    if (
      !forceRefresh &&
      cachedData &&
      cacheExpiration &&
      now < cacheExpiration
    ) {
      console.log(` Using cached recommendations for user ${userId}.`);
      return cachedData;
    }

    if (!navigator.onLine) {
      console.warn(
        ` Offline: Using cached recommendations for user ${userId}...`
      );
      if (cachedData) return cachedData;
      throw new Error(" No cached recommendations for this user.");
    }

    console.log(` Fetching recommendations for user ${userId}...`);
    const response = await axios.get(`${BASE_URL}/recommendations/${userId}`, {
      headers: getAuthHeaders(),
    });

    console.log(" User-specific recommendations fetched:", response.data);
    await set(cacheKey, response.data);
    await set(cacheExpirationKey, now + CACHE_DURATION_MS);

    return response.data;
  } catch (error) {
    console.error(
      " Error fetching user-specific recommendations:",
      error.message
    );
    throw error;
  }
};

/**
 *  Recommend an Exercise
 */
export const recommendExercise = async (recommendationData) => {
  try {
    console.log(" Sending recommendation to backend...");
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
    console.error(" Error recommending exercise:", error.message);
    throw error;
  }
};

/**
 *  Delete Completed Workout
 */
export const handleDeleteCompletedWorkout = async (workoutId) => {
  if (!workoutId) {
    throw new Error(" Workout ID is required.");
  }

  try {
    console.log(` Deleting workout ${workoutId}...`);
    const response = await axios.delete(
      `${BASE_URL}/exercises/completed/${workoutId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log(" Workout deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      " Error deleting workout:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 *  Delete Recommendation
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

/**
 *  Sync Offline Data When Online
 */
export const syncOfflineData = async () => {
  // Sync Recommendations
  const offlineRecs = (await get(OFFLINE_QUEUE_KEY)) || [];
  if (offlineRecs.length) {
    console.log(` Syncing ${offlineRecs.length} offline recommendations...`);
    for (const rec of offlineRecs) {
      try {
        await recommendExercise(rec);
      } catch (err) {
        console.error(" Failed to sync recommendation:", err);
      }
    }
    await set(OFFLINE_QUEUE_KEY, []); // Clear queue after sync
  }

  // Sync Edits
  const offlineEdits = (await get(OFFLINE_EDIT_QUEUE)) || [];
  if (offlineEdits.length) {
    console.log(` Syncing ${offlineEdits.length} offline edits...`);
    for (const { recommendationId, updatedFields } of offlineEdits) {
      try {
        await editRecommendation(recommendationId, updatedFields);
      } catch (err) {
        console.error(" Failed to sync edit:", err);
      }
    }
    await set(OFFLINE_EDIT_QUEUE, []); // Clear queue after sync
  }

  // Sync Deletions
  const offlineDeletes = (await get(OFFLINE_DELETE_QUEUE)) || [];
  if (offlineDeletes.length) {
    console.log(` Syncing ${offlineDeletes.length} offline deletions...`);
    for (const recommendationId of offlineDeletes) {
      try {
        await deleteRecommendation(recommendationId);
      } catch (err) {
        console.error(" Failed to sync deletion:", err);
      }
    }
    await set(OFFLINE_DELETE_QUEUE, []); // Clear queue after sync
  }

  // Sync Workout Deletions
  const offlineWorkoutDeletes = (await get(OFFLINE_DELETE_WORKOUT_QUEUE)) || [];
  if (offlineWorkoutDeletes.length) {
    console.log(
      ` Syncing ${offlineWorkoutDeletes.length} offline workout deletions...`
    );
    for (const workoutId of offlineWorkoutDeletes) {
      try {
        await handleDeleteCompletedWorkout(workoutId);
      } catch (err) {
        console.error(" Failed to sync workout deletion:", err);
      }
    }
    await set(OFFLINE_DELETE_WORKOUT_QUEUE, []); // Clear queue after sync
  }
};

/**
 *  Automatically Sync When Online
 */
window.addEventListener("online", async () => {
  console.log(" Online detected! Syncing offline data...");
  await syncOfflineData();
});
