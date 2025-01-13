const BASE_URL = "http://localhost:3000/api";

// Utility: Fetch token from localStorage
const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage.");
    throw new Error("No token found. Please log in again.");
  }
  return token;
};

// Utility: Get headers
const getHeaders = (isJson = true) => {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };
  console.log("Headers being sent:", headers);
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

// Utility: Handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorDetails = await response.json().catch(() => null);
    console.error("Error details from backend:", errorDetails);
    throw new Error(errorDetails?.message || response.statusText);
  }
  return response.json();
};

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: getHeaders(),
    });
    console.log("Response from /api/users:", response);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error in fetchUsers:", error.message);
    throw error;
  }
};

// Update user status
export const updateUserStatus = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/status`, {
      method: "PATCH",
      headers: getHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error in updateUserStatus:", error.message || error);
    throw error;
  }
};

// Recommend a workout
export const recommendWorkout = async (userId, workoutId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/recommend`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ workoutId }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error in recommendWorkout:", error);
    throw error;
  }
};

// Edit user
export const editUser = async (userId, updates) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error in editUser:", error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error in deleteUser:", error);
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
