import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth`
  : "http://localhost:3000/api/auth";

//  Check for token expiration
export const isTokenExpired = (token) => {
  try {
    const payloadBase64 = token.split(".")[1]; // Extract JWT payload
    const decodedPayload = JSON.parse(atob(payloadBase64)); // Decode it
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

    return decodedPayload.exp && currentTime > decodedPayload.exp; // Check expiration
  } catch (error) {
    console.error("Token decoding failed:", error);
    return true; // Assume expired if decoding fails
  }
};

//  Save user session in localStorage
export const saveUserSession = (token, user) => {
  if (!token || !user) {
    console.warn("Attempted to save an invalid session.");
    return;
  }

  console.log("Saving user session...");
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  console.log("User session saved:", { token, user });
};

//  Retrieve stored user session
export const getStoredUser = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  console.log("Checking localStorage for user session:", { token, user });

  if (!token || !user) {
    console.warn("No valid user session found.");
    return { token: null, user: null };
  }

  //  If the token is expired, remove it and return null
  if (isTokenExpired(token)) {
    console.warn("Stored token is expired! Logging out user...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { token: null, user: null };
  }

  return { token, user: JSON.parse(user) };
};

//  Check if user is authenticated
export const checkAuth = () => {
  console.log("Running checkAuth()...");
  const storedUser = getStoredUser();

  console.log("Retrieved user:", storedUser);

  if (
    !storedUser ||
    !storedUser.user ||
    Object.keys(storedUser.user).length === 0
  ) {
    console.warn("No authenticated user found.");
    return { token: null, user: {} };
  }

  console.log(
    "User is authenticated:",
    storedUser.user?.username || "No Username Found"
  );
  return storedUser;
};

// Register a user
export const register = async (userData) => {
  try {
    console.log("Registering user...");
    const response = await axios.post(`${BASE_URL}/register`, userData, {
      withCredentials: true,
    });

    const { token, user } = response.data;
    saveUserSession(token, user);

    console.log("Registration successful.");
    return { token, user };
  } catch (error) {
    console.error("Registration failed:", error.message || error);
    throw new Error("Registration failed. Please try again.");
  }
};

//  Login user
export const loginWithCredentials = async (email, password) => {
  try {
    console.log("Logging in...");
    const response = await axios.post(
      `${BASE_URL}/login`,
      { email, password },
      { withCredentials: true }
    );

    const { token, user } = response.data;
    saveUserSession(token, user);

    console.log("Login successful.");
    return { token, user };
  } catch (error) {
    console.error("Login failed:", error.response?.data?.message || error);
    throw new Error("Login failed. Please check your credentials.");
  }
};
