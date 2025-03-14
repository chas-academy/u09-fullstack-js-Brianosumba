import axios from "axios";
import { io } from "socket.io-client";
import { isTokenExpired } from "./authService";

// Base URLs
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const EXERCISE_DB_API = "https://exercisedb.p.rapidapi.com/exercises";
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const RECONNECT_DELAY = 3000;
let reconnectAttempts = 0;

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // Start disconnected, connect manually
  reconnection: true, // ✅ Allow auto-reconnect with delay
  reconnectionAttempts: 5, // ✅ Max attempts before stopping
  transports: ["websocket"], // Use WebSocket transport
});

// Connect WebSocket with Error Handling
export const connectWebsocket = () => {
  if (!socket.connected) {
    console.log("Connecting to WebSocket...");
    socket.connect();
  }
};

// Attach WebSocket event listeners
socket.on("connect", () => {
  console.log("✅ WebSocket Connected:", socket.id);
  reconnectAttempts = 0; // Reset attempts
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ WebSocket Disconnected:", reason);
  attemptReconnect();
});

socket.on("connect_error", (error) => {
  console.error("❌ WebSocket Connection Error:", error.message);
});

// WebSocket Reconnection with Delay
export const attemptReconnect = () => {
  if (reconnectAttempts < 5) {
    const delay = RECONNECT_DELAY * (reconnectAttempts + 1);
    console.log(`🔄 Retrying WebSocket Connection in ${delay / 1000}s...`);

    setTimeout(() => {
      reconnectAttempts++;
      connectWebsocket();
    }, delay);
  } else {
    console.error("❌ WebSocket Failed to Reconnect After Multiple Attempts.");
  }
};
// API Headers
export const HEADERS = {
  "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    console.warn("⚠️ Token missing or expired! Logging out user...");

    // Clear stored data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Show alert instead of auto-redirect
    alert("Your session has expired. Please log in again.");

    return null; // ⛔ Prevents sending invalid headers
  }

  console.log("🔑 Token being sent in headers:", token);

  return {
    Authorization: `Bearer ${token.trim()}`,
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
 * Fetch  Details by ID
 */
export const fetchExerciseDetails = async (exerciseId) => {
  if (!exerciseId) {
    console.error("❌ fetchExerciseDetails: Missing exerciseId.");
    return null;
  }

  try {
    console.log(`🔍 Fetching details for Exercise ID: ${exerciseId}`);

    const response = await axios.get(
      `${EXERCISE_DB_API}/exercise/${exerciseId}`,
      {
        headers: HEADERS,
      }
    );

    console.log("✅ Exercise details fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error fetching exercise details for ID ${exerciseId}:`,
      error.message
    );
    throw new Error("Failed to fetch exercise details.");
  }
};

/**
 * Fetch All Recommendations (Admin Panel)
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

export const fetchRecommendations = async (userId, setRecommendedWorkouts) => {
  if (!userId) {
    console.error("User ID is required to fetch recommendations.");
    return;
  }

  try {
    console.log("fetching recommendations for user:", userId);

    const response = await axios.get(`${BASE_URL}/recommendations/${userId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.data.success) {
      console.warn("No recommendations found for user:", userId);
      return [];
    }

    let recommendations = response.data.data;

    const recommendationsWithDetails = await Promise.all(
      recommendations.map(async (rec) => {
        if (
          !rec.exerciseDetails ||
          Object.keys(rec.exerciseDetails).length === 0
        ) {
          rec.exerciseDetails = await fetchExerciseDetails(rec.exerciseId);
        }
        return rec;
      })
    );

    console.log("Final recommendations returned:", recommendationsWithDetails);
    return recommendationsWithDetails;
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    return [];
  }
};

/**
 * Recommend an Exercise
 */

export const recommendExercise = async (recommendationData) => {
  try {
    console.log("Sending recommendation to backend:", recommendationData);

    if (!recommendationData.exerciseId) {
      console.error("Missing exerciseId in request payload");
      throw new Error("Invalid exercise ID");
    }

    const headers = getAuthHeaders();
    if (!headers) {
      console.error(" No valid authorization token. Aborting request.");
      return;
    }

    const response = await axios.post(
      `${BASE_URL}/recommendations`,
      recommendationData,
      { headers }
    );

    console.log(" Recommendation saved:", response.data);

    //  Emit WebSocket event only after success
    if (response.data?.success) {
      socket.emit("recommendationUpdated", {
        userId: String(recommendationData.userId),
      });
    }

    return response.data;
  } catch (error) {
    console.error(
      " Error recommending exercise:",
      error.response?.data || error.message
    );

    if (error.response) {
      console.error(" Server Response:", error.response.data);
    }

    throw error;
  }
};

/**
 * Edit an Existing Recommendation
 */
export const editRecommendation = async (recommendationId, updatedFields) => {
  if (
    !recommendationId ||
    !updatedFields ||
    Object.keys(updatedFields).length === 0
  ) {
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

    //Emit websocket event
    socket.emit("recommendationUpdated", { userId: response.data.data.userId });

    return response.data;
  } catch (error) {
    console.error(
      `Error editing recommendation (ID: ${recommendationId}):`,
      error.response?.data || error.message
    );

    return {
      success: false,
      message: "Failed to edit recommendation. Try again.",
    };
  }
};

/**
 * Delete Recommendation
 */
export const deleteRecommendation = async (recommendationId) => {
  if (!recommendationId) {
    throw new Error("❌ Missing recommendation ID for deletion.");
  }

  try {
    console.log(`🗑️ Deleting recommendation ${recommendationId}...`);

    const headers = getAuthHeaders();
    if (!headers) {
      console.error("🚨 No valid authorization token. Aborting request.");
      return;
    }

    const response = await axios.delete(
      `${BASE_URL}/recommendations/${recommendationId}`,
      { headers }
    );

    console.log("✅ Recommendation deleted:", response.data);

    // ✅ Emit WebSocket event only if userId exists
    if (response.data?.userId) {
      socket.emit("recommendationUpdated", { userId: response.data.userId });
    } else {
      console.warn(
        "⚠️ User ID missing in API response, skipping WebSocket update."
      );
    }

    return response.data;
  } catch (error) {
    console.error("❌ Error deleting recommendation:", error.message);
    throw error;
  }
};

/**
 * Complete an Exercise
 */
export const completeExercise = async (completionData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/exercises/complete`,
      completionData,
      { headers: getAuthHeaders() }
    );

    // ✅ Emit WebSocket event
    if (socket && socket.connected) {
      socket.emit("exerciseCompleted", completionData);
      socket.emit("adminWorkoutUpdate", completionData);
    } else {
      console.warn("⚠️ WebSocket is NOT connected! Trying to reconnect...");
      socket.connect(); // ✅ Reconnect WebSocket if disconnected
    }

    return response.data;
  } catch (error) {
    console.error("Error completing exercise:", error.message);
    throw error;
  }
};

/**
 * Fetch Completed Workouts
 */
export const fetchCompletedWorkouts = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch completed workouts");
    }

    const url = `${BASE_URL}/exercises/completed?userId=${userId}`;

    const response = await axios.get(url, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error fetching completed workouts:", error.message);
    return [];
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

    const headers = getAuthHeaders();
    console.log("Auth Headers Sent:", headers);

    const response = await axios.delete(
      `${BASE_URL}/exercises/completed/${workoutId}`,
      {
        headers,
      }
    );

    console.log("Workout deleted successfully:", response.data);

    if (socket && socket.connected) {
      socket.emit("workoutDeleted", { workoutId });
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting workout:",
      error.response?.data || error.message
    );
    throw error;
  }
};
