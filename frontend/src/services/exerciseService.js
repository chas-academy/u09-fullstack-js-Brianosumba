const EXERCISE_DB_API = "https://exercisedb.p.rapidapi.com/exercises";
const HEADERS = {
  "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
};

const BASE_URL = "http://localhost:3000/api/exercises";

export const fetchExercisesfromDB = async (limit = 10, offset = 0) => {
  try {
    const response = await fetch(
      `${EXERCISE_DB_API}?limit=${limit}&offset=${offset}`,
      {
        headers: HEADERS,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exercises.");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching exercises:", error.message || error);
    throw error;
  }
};

export const fetchRecommendations = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/recommendations/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch recommendations.");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching recommendations:", error.message || error);
    throw error;
  }
};

export const recommendExercise = async (recommendationData) => {
  try {
    const response = await fetch(`${BASE_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recommendationData),
    });

    if (!response.ok) {
      throw new Error("Failed to recommend exercise.");
    }

    return response.json();
  } catch (error) {
    console.error("Error recommending exercise:", error.message || error);
    throw error;
  }
};

export const deleteRecommendation = async (recommendationId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/recommendation/${recommendationId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete recommendation.");
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting recommendation:", error.message || error);
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
      throw new Error("Failed to edit recommendation.");
    }

    return response.json();
  } catch (error) {
    console.error("Error editing recommendation:", error.message || error);
    throw error;
  }
};
