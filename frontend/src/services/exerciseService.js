// src/services/exerciseService.js

const EXERCISEDB_BASE_URL = "https://exercisedb.p.rapidapi.com/exercises";

// // Utility function to get token
// const getToken = () => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     console.error("No token found in localStorage.");
//     throw new Error("No token found. Please log in again.");
//   }
//   return token;
// };

//Headers for ExerciseDB API
const HEADERS = {
  "Content-Type": "application/json",
  "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
  "X_Rapid-Host": "exercisedb.p.rapidapi.com",
};

// Function to fetch exercises from ExerciseDB API
/**
 * @returns {Promise<Array} - Resolves with an array of exercises
 */
export const fetchExercises = async () => {
  try {
    const response = await fetch(EXERCISEDB_BASE_URL, {
      method: "GET",
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch exercises.");
    }

    const exercises = await response.json();

    // Validate that the response is an array
    if (!Array.isArray(exercises)) {
      console.error("Invalid data format received:", exercises);
      throw new Error("Invalid data format: Exercises should be an array.");
    }

    console.log("Fetched exercises from ExerciseDB:", exercises); // Debugging log
    return exercises;
  } catch (error) {
    console.error(
      "Error fetching exercises from ExerciseDB:",
      error.message || error
    );
    throw error;
  }
};

// // Function to fetch detailed information for a specific exercise by ID
// /**
//  *
//  * @param {string} id - ID of the exercise
//  * @returns {Promise<Object>} - Resolves with exercise details
//  */
// export const fetchExerciseById = async (id) => {
//   if (!id) {
//     throw new Error("Exercise ID is required to fetch details.");
//   }

//   const url = `${EXERCISEDB_BASE_URL}/${id}`;

//   try {
//     const response = await fetch(url, {
//       method: "GET",
//       headers: HEADERS,
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch exercise with ID ${id}`);
//     }
//     const data = await response.json();

//     console.log(`Fetched exercise with ID ${id}:`, data); // Debbuging log
//     return data;
//   } catch (error) {
//     console.error("Error fetching exercise by ID:", error.message || error);
//     throw error;
//   }
// };

// Function to fetch recommendations for a specific user
/**
 *
 * @param {string} userId - ID of the user
 * @returns {Promise<Array>} - Resolves with an array of recommendations
 */
export const fetchRecommendations = async (userId) => {
  const RECOMMENDATIONS_URL = `${EXERCISEDB_BASE_URL}/recommendations/${userId}`;

  try {
    const response = await fetch(RECOMMENDATIONS_URL, {
      method: "GET",
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recommendations for user ${userId}`);
    }
    const data = await response.json();

    // Validate response format
    if (!Array.isArray(data)) {
      console.error("Invalid recommendations format received:", data);
      throw new Error(
        "Invalid data format: Recommendations should be an array."
      );
    }
    console.log("Fetched recommendations:", data); //Debugging log
    return data;
  } catch (error) {
    console.error("Error fetching recommendations:", error.message || error);
    throw error;
  }
};

// Function to recommend an exercise to a user
/**
 *
 * @param {Object} payload - Recommendation payload
 * @param {string} - payload.userId - ID pf the user
 * @param {string} - payload.exerciseId - ID of the exercise
 * @param {string} - payload.notes - Additional notes
 * @param {Array} - payload.tags - Tags associated with recommendation
 * @returns {Promise<Object>} - Resolves with the recommendation response
 */
export const recommendExercise = async ({
  userId,
  exerciseId,
  notes,
  tags,
}) => {
  const Recommend_URL = `${EXERCISEDB_BASE_URL}/recommend`;

  if (!userId || !exerciseId) {
    throw new Error("userId and exrciseId are required.");
  }

  try {
    const payload = { userId, exerciseId, notes, tags };
    console.log("Payload being sent to backend:", payload); // Debugging log

    const response = await fetch(Recommend_URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(payload), // Serialize the payload as JSON
    });

    if (!response.ok) {
      const errorDetails = await response.text(); // Log detailed error
      console.error("Error recommending exercise:", errorDetails);
      throw new Error("Failed to recommend exercise.");
    }

    const responseData = await response.json();
    console.log("Recommendatin Ressponse:", responseData); //Debugging log
    return responseData;
  } catch (error) {
    console.error("Error recommending exercise:", error.message || error);
    throw error;
  }
};

// Function to update an exisiting recommendation
/**
 *
 * @param {string} recommendationId - ID of the recommendation to update
 * @param {Object} updatedFields - Fields to update (e.g, notes, tags, exerciseId)
 * @returns  {Promise<Object>} - Resolves with the updated recommendation
 */
export const updateRecommendation = async ({
  recommendationId,
  updatedFields,
}) => {
  const UPDATE_URL = `${EXERCISEDB_BASE_URL}/recommendation/${recommendationId}`;

  if (!recommendationId || !updatedFields) {
    throw new Error("recommendationId and updatedFields are required");
  }

  try {
    const response = await fetch(UPDATE_URL, {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
      throw new Error(`Failed to update recommendation ${errorDetails}`);
    }

    const responseData = await response.json();
    console.log(`Updated recommendation ${recommendationId}:`, responseData);
    return responseData;
  } catch (error) {
    console.error("Error updating recommendation:", error.message || error);
    throw error;
  }
};

// // Function to delete a specific exercise by ID
// export const deleteExercise = async (id) => {
//   const url = `${BASE_URL}/${id}`;

//   try {
//     const response = await fetch(url, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getToken()}`,
//       },
//     });
//     if (!response.ok) {
//       throw new Error(`Failed to delete exercise with ID ${id}`);
//     }
//     return response.json();
//   } catch (error) {
//     console.error("Error deleting exercise:", error);
//     throw error;
//   }
// };

// Function to delete a recommendation
/**
 *
 * @param {string} recommendationId -ID of the recommendation to delete
 * @returns {Promise<Object>} - Resolves with the deletion response
 */
export const deleteRecommendation = async (recommendationId) => {
  const DELETE_URL = `${EXERCISEDB_BASE_URL}/recommendation/${recommendationId}`;

  if (!recommendationId) {
    throw new Error("recommendationsId is required");
  }

  try {
    const response = await fetch(DELETE_URL, {
      method: "DELETE",
      headers: HEADERS,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to delete recommendation: ${errorDetails}`);
    }

    const responseData = await response.json();
    console.log(`Deleted recommendation ${recommendationId}:, responseData`);
    return responseData;
  } catch (error) {
    console.error("Error deleting recommendation:", error.message || error);
    throw error;
  }
};
