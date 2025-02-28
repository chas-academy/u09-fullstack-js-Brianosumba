import axios from "axios";
import { get, set } from "idb-keyval"; // IndexedDB for offline caching

// Base URLs
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const EXERCISE_DB_API = "https://exercisedb.p.rapidapi.com/exercises";

// API Headers
const HEADERS = {
  "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
};

// Cache Settings
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const CACHE_EXERCISES = "cached-exercises";
const CACHE_EXPIRATION_EXERCISES = "exercises_cache_expiration";
const CACHE_RECOMMENDATIONS = "cached-recommendations";
const CACHE_EXPIRATION_RECOMMENDATIONS = "recommendations_cache_expiration";
const OFFLINE_QUEUE_KEY = "offline-recommendations";
const OFFLINE_EDIT_QUEUE = "offline-edit-recommendations";
const OFFLINE_DELETE_QUEUE = "offline-delete-recommendations";
const OFFLINE_DELETE_WORKOUT_QUEUE = "offline-delete-workouts";

/**
 * Retrieves Authorization Headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Fetch exercises from API (supports offline caching)
 */
export const fetchExercisesfromDB = async (limit = 10, offset = 0) => {
  const now = Date.now();
  const cachedData = await get(CACHE_EXERCISES);
  const cacheExpiration = await get(CACHE_EXPIRATION_EXERCISES);

  if (cachedData && cacheExpiration && now < cacheExpiration) {
    console.log(" Using cached exercises.");
    return cachedData;
  }

  if (!navigator.onLine) {
    console.warn(" Offline: Using cached exercises...");
    if (cachedData) return cachedData;
    throw new Error("No cached exercises available. Please go online first.");
  }

  try {
    console.log(`📡 Fetching exercises (limit=${limit}, offset=${offset})...`);
    const response = await axios.get(EXERCISE_DB_API, {
      headers: HEADERS,
      params: { limit, offset },
    });

    console.log(" Exercises fetched:", response.data);

    await set(CACHE_EXERCISES, response.data);
    await set(CACHE_EXPIRATION_EXERCISES, now + CACHE_DURATION_MS);

    return response.data;
  } catch (error) {
    console.error(" Error fetching exercises:", error.message);
    throw new Error("Failed to fetch exercises. Try again later.");
  }
};

/**
 * Fetch all recommendations (Admin)
 */
export const fetchAllRecommendations = async () => {
  const now = Date.now();
  const cachedData = await get(CACHE_RECOMMENDATIONS);
  const cacheExpiration = await get(CACHE_EXPIRATION_RECOMMENDATIONS);

  if (cachedData && cacheExpiration && now < cacheExpiration) {
    console.log(" Using cached recommendations.");
    return cachedData;
  }

  if (!navigator.onLine) {
    console.warn(" Offline: Using cached recommendations...");
    if (cachedData) return cachedData;
    throw new Error("No cached recommendations found.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/recommendations`, {
      headers: getAuthHeaders(),
    });

    console.log(" Recommendations fetched:", response.data);

    await set(CACHE_RECOMMENDATIONS, response.data);
    await set(CACHE_EXPIRATION_RECOMMENDATIONS, now + CACHE_DURATION_MS);

    return response.data;
  } catch (error) {
    console.error(" Error fetching recommendations:", error.message);
    throw error;
  }
};

/**
 * Fetch user-specific recommendations
 */
export const fetchRecommendations = async (userId) => {
  const now = Date.now();
  const cacheKey = `${CACHE_RECOMMENDATIONS}-${userId}`;
  const cacheExpirationKey = `${CACHE_EXPIRATION_RECOMMENDATIONS}-${userId}`;

  const cachedData = await get(cacheKey);
  const cacheExpiration = await get(cacheExpirationKey);

  if (cachedData && cacheExpiration && now < cacheExpiration) {
    console.log(` Using cached recommendations for user ${userId}.`);
    return cachedData;
  }

  if (!navigator.onLine) {
    console.warn(
      ` Offline: Using cached recommendations for user ${userId}...`
    );
    if (cachedData) return cachedData;
    throw new Error("No cached recommendations for this user.");
  }

  try {
    console.log(` Fetching recommendations for user ${userId}...`);
    const response = await axios.get(`${BASE_URL}/recommendations/${userId}`, {
      headers: getAuthHeaders(),
    });

    await set(cacheKey, response.data);
    await set(cacheExpirationKey, now + CACHE_DURATION_MS);

    return response.data;
  } catch (error) {
    console.error(" Error fetching recommendations:", error.message);
    throw error;
  }
};

/**
 * Recommend an exercise (Supports Offline Mode)
 */
export const recommendExercise = async (recommendationData) => {
  if (!navigator.onLine) {
    console.warn(" Offline: Saving recommendation for later...");
    const offlineQueue = (await get(OFFLINE_QUEUE_KEY)) || [];
    offlineQueue.push(recommendationData);
    await set(OFFLINE_QUEUE_KEY, offlineQueue);
    return { message: "Saved offline. Will sync later." };
  }

  try {
    console.log(" Sending recommendation to backend...");
    const response = await axios.post(
      `${BASE_URL}/recommendations`,
      recommendationData,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log(" Recommendation saved:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error(" Error recommending exercise:", error.message);
    throw error;
  }
};

//Edit and existing recommendation
export const editRecommendation = async (recommendationId, updatedFields) => {
  if (!navigator.onLine) {
    console.warn(
      `Offline: Saving edit for recommendation ${recommendationId}...`
    );

    const offlineQueue = (await get(OFFLINE_EDIT_QUEUE)) || [];
    offlineQueue.push({ recommendationId, updatedFields });
    await set(OFFLINE_EDIT_QUEUE, offlineQueue);

    return { message: "Edit saved offline. Will sync when online" };
  }

  try {
    console.log(` Editing recommendation ${recommendationId}...`);
    const response = await axios.patch(
      `${BASE_URL}/recommendations/${recommendationId}`,
      updatedFields,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log(" Recommendation updated:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error editing recommendation:", error.message || error);
    throw error;
  }
};
export const deleteRecommendation = async (recommendationId) => {
  if (!navigator.onLine) {
    console.warn(
      ` Offline: Queuing delete for recommendation ${recommendationId}...`
    );
    const offlineQueue = (await get(OFFLINE_DELETE_QUEUE)) || [];
    offlineQueue.push(recommendationId);
    await set(OFFLINE_DELETE_QUEUE, offlineQueue);

    return { message: "Delete saved offline. Will sync when online." };
  }

  try {
    console.log("Deleting recommendation with ID:", recommendationId);

    const response = await axios.delete(
      `${BASE_URL}/recommendations/${recommendationId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log(" Recommendation deleted:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error deleting recommendation:", error.message || error);
    throw error;
  }
};

export const handleDeleteCompletedWorkout = async (workoutId) => {
  if (!workoutId) {
    throw new Error("Workout ID is required.");
  }

  if (!navigator.onLine) {
    console.warn(`Offline: Queuing delete for workout ${workoutId}...`);

    const offlineQueue = (await get(OFFLINE_DELETE_WORKOUT_QUEUE)) || [];
    offlineQueue.push(workoutId);
    await set(OFFLINE_DELETE_WORKOUT_QUEUE, offlineQueue);

    return { message: "Workout delete saved offline. Will sync when online" };
  }

  try {
    console.log(` Deleting workout ${workoutId}...`);
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
 * Sync offline recommendations when online
 */
export const syncRecommendations = async () => {
  const offlineQueue = (await get(OFFLINE_QUEUE_KEY)) || [];
  if (!offlineQueue.length) return;

  console.log(` Syncing ${offlineQueue.length} offline recommendations...`);

  const failedQueue = [];
  for (const recommendation of offlineQueue) {
    try {
      await recommendExercise(recommendation);
      console.log("Synced:", recommendation);
    } catch (error) {
      console.error(" Failed to sync:", error);
      failedQueue.push(recommendation);
    }
  }
  await set(OFFLINE_QUEUE_KEY, failedQueue);
};

export const syncOfflineEdits = async () => {
  const offlineQueue = (await get(OFFLINE_EDIT_QUEUE)) || [];
  if (!offlineQueue.length) return;

  console.log(` Syncing ${offlineQueue.length} offline edits...`);
  const failedQueue = [];

  for (const { recommendationId, updatedFields } of offlineQueue) {
    try {
      await editRecommendation(recommendationId, updatedFields);
      console.log(` Synced edit for recommendation ${recommendationId}`);
    } catch (error) {
      console.error(` Failed to sync edit for ${recommendationId}:`, error);
      failedQueue.push({ recommendationId, updatedFields });
    }
  }

  await set(OFFLINE_EDIT_QUEUE, failedQueue);
};

export const syncOfflineDeletes = async () => {
  const offlineQueue = (await get(OFFLINE_DELETE_QUEUE)) || [];
  if (!offlineQueue.length) return;

  console.log(` Syncing ${offlineQueue.length} offline deletions...`);
  const failedQueue = [];

  for (const recommendationId of offlineQueue) {
    try {
      await deleteRecommendation(recommendationId);
      console.log(` Synced deletion for recommendation ${recommendationId}`);
    } catch (error) {
      console.error(` Failed to sync deletion for ${recommendationId}:`, error);
      failedQueue.push(recommendationId);
    }
  }

  await set(OFFLINE_DELETE_QUEUE, failedQueue);
};

export const syncOfflineWorkoutDeletes = async () => {
  const offlineQueue = (await get(OFFLINE_DELETE_WORKOUT_QUEUE)) || [];
  if (!offlineQueue.length) return;

  console.log(` Syncing ${offlineQueue.length} offline workout deletions...`);
  const failedQueue = [];

  for (const workoutId of offlineQueue) {
    try {
      await handleDeleteCompletedWorkout(workoutId);
      console.log(` Synced deletion for workout ${workoutId}`);
    } catch (error) {
      console.error(` Failed to sync workout ${workoutId}:`, error);
      failedQueue.push(workoutId);
    }
  }

  await set(OFFLINE_DELETE_WORKOUT_QUEUE, failedQueue);
};

// Automatically sync recommendations when online
window.addEventListener("online", async () => {
  console.log("Online detected! syncting offline data...");
  await syncRecommendations();
  await syncOfflineEdits();
  await syncOfflineDeletes();
  await syncOfflineWorkoutDeletes();
});
