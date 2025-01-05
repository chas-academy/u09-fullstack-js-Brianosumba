const BASE_URL = "http://localhost:3000/api"; // Base URL for the API

/**
 * Fetches the valid token from localStorage or a token handler utility
 * @returns {string} token - The valid token
 */
const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Session expired. Please log in again.");
    window.location.href = "/login";
    throw new Error("No token found. Please log in again.");
  }
  return token;
};

/**
 * Handles API responses and throws errors for non-OK responses
 * @param {Response} response - The fetch response object
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorDetails = await response.json().catch(() => null); // Fallback for non-JSON responses
    console.error("API Error:", errorDetails || response.statusText);
    throw new Error(errorDetails?.message || response.statusText);
  }
  return response.json();
};

/**
 * Fetches users from the backend
 */
export const fetchUsers = async () => {
  const token = getToken();

  try {
    console.log("Fetching users with token:", token);
    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response details:", response);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error in fetchUsers:", error.message || error);
    throw error;
  }
};

/**
 * Updates the status of a user
 * @param {string} userId - The ID of the user
 */
export const updateUserStatus = async (userId) => {
  const token = getToken();

  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Error in updateUserStatus:", error.message || error);
    throw error;
  }
};

/**
 * Recommends a workout to a user
 * @param {string} userId - The ID of the user
 * @param {string} workoutId - The ID of the workout
 */
export const recommendWorkout = async (userId, workoutId) => {
  const token = getToken();

  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ workoutId }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Error in recommendWorkout:", error.message || error);
    throw error;
  }
};

/**
 * Edits user details
 * @param {string} userId - The ID of the user
 * @param {object} updates - The updated user data
 */
export const editUser = async (userId, updates) => {
  const token = getToken();

  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Error in editUser:", error.message || error);
    throw error;
  }
};

/**
 * Deletes a user
 * @param {string} userId - The ID of the user
 */
export const deleteUser = async (userId) => {
  const token = getToken();

  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Error in deleteUser:", error.message || error);
    throw error;
  }
};

// // Function to toggle user status
// export const updateUserStatus = async (userId) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     alert("Session expired. Please log in again.");
//     window.location.href = "/login";
//     throw new Error("No token found. Please log in again");
//   }

//   try {
//     const response = await fetch(
//       `http://localhost:3000/api/users/${userId}/status`,
//       {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token},`,
//         },
//       }
//     );

//     if (!response.ok) {
//       const errorDetails = await response.text(); // Get detailed error message
//       console.error("Failed to update user status:", errorDetails);
//       throw new Error(`Failed to update user status: ${response.status}`);
//     }

//     const updatedUser = await response.json();
//     console.log("Updated user status:", updatedUser);

//     return updatedUser;
//   } catch (error) {
//     console.error("Error in updateUserStatus", error);
//   }
// };
