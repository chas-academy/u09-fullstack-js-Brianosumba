import { isTokenExpired } from "./authService";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Utility: Fetch token from localStorage
const getToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error(" No token found in localStorage.");
    return null;
  }

  if (isTokenExpired(token)) {
    console.warn(" Token expired! Redirecting to login...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Redirect user to login
    return null;
  }

  console.log(" Token retrieved successfully.");
  return token;
};

// Utility: Get headers
const getHeaders = (isJson = true) => {
  const token = getToken();
  if (!token) throw new Error("Unauthorized: Token missing");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  console.log(" Headers being sent:", headers);
  return headers;
};

// Utility: Handle API responses
const handleResponse = async (response) => {
  let errorDetails;

  try {
    errorDetails = await response.json();
  } catch {
    errorDetails = { message: response.statusText };
  }
  if (!response.ok) {
    console.error("API Error:", errorDetails);
    throw new Error(errorDetails?.message || "Error occured");
  }
  return errorDetails;
};

// Fetch all users
export const fetchUsers = async () => {
  try {
    const headers = getHeaders();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.isAdmin) {
      console.error(" User is not an admin:", user);
      throw new Error("Access denied: Admin privileges required");
    }

    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: headers,
    });

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
