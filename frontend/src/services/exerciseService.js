const EXERCISE_DB_API = "https://exercisedb.p.rapidapi.com/exercises";
const HEADERS = {
  "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
};

/**
 * Fetch exercises from the ExerciseDB API.
 * @param {number} limit - The maximum number of results to fetch.
 * @param {number} offset - The offset for paginated results.
 * @returns {object[]} Array of exercises from the API.
 */
export const fetchExercisesfromDB = async (limit = 30, offset = 0) => {
  try {
    console.log(
      `Fetching exercises with limit=${limit} and offset=${offset}...`
    );
    const response = await axios.get(EXERCISE_DB_API, {
      headers: HEADERS,
      params: { limit, offset },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching exercises from ExerciseDB API:",
      error.message
    );
    throw new Error("Failed to fetch exercises. Please try again later.");
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
