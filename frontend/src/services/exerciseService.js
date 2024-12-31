const EXERCISE_DB_API = "https://exercisedb.p.rapidapi.com/exercises";
const HEADERS = {
  "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
};

const BASE_URL = "http://localhost:3000/api/exercises";

export const fetchExercisesfromDB = async (limit = 30, offset = 0) => {
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

    const response = await fetch(`${BASE_URL}/recommend`, {
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

    if (!data?.recommendation || !data.recommendation._id) {
      console.error("Invalid recommendation data:", data);
      throw new Error("Invalid recommendation data from backend");
    }

    const reformatted = {
      id: data.recommendation._id,
      ...data.recommendation,
    };

    console.log("Reformatted Recommendation:", reformatted);
    return reformatted;
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
