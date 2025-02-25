// services/authService.js

import axios from "axios"; // Importing axios for making HTTP requests
import { get, set } from "idb-keyval";

//Base URL for your backend
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth`
  : "http://localhost:3000/api/auth";

// Save user session data locally for offline login
const saveUserSession = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// Retrieve stored user data for offline access
export const getOfflineUser = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  return token && user ? { token, user } : null;
};

// Offline login function (returns stored user data if available)
export const offlineLogin = async () => {
  const offlineUser = getOfflineUser();
  if (!offlineUser) throw new Error("No offline user found");
  return offlineUser;
};

// Register a new user, or queue it for later if offline
export const register = async (userData) => {
  if (!navigator.onLine) {
    console.warn("Offline mode: Saving registration for later");

    // Save offline registration data in IndexedDB
    const offlineQueue = (await get("offline-registrations")) || [];
    offlineQueue.push(userData);
    await set("offline-registrations", offlineQueue);

    return { message: "Registered offline. Will sync later" };
  }

  try {
    // Sending a POST request to register a new user
    const response = await axios.post(`${BASE_URL}/register`, userData, {
      withCredentials: true, // Include credentials for authentication
    });

    const { token, user } = response.data;

    // Save session for offline login
    saveUserSession(token, user);

    return { token, user };
  } catch (error) {
    // Handle any errors that occur during the request
    const errorMessage =
      error.response?.data?.message || "Registration failed.";
    console.error("Registration failed:", errorMessage);
    throw new Error(errorMessage);
  }
};

// Login user and save session locally for offline access
export const loginWithCredentials = async (email, password) => {
  if (!navigator.onLine) {
    console.warn("offline mode detected: Using stored data");
    const offlineUser = getOfflineUser();
    if (offlineUser) return offlineUser;
    throw new Error("No offline user found. Please connect to the internet");
  }
  try {
    // Sending a POST request to the /api/login endpoint with userData
    const response = await axios.post(
      `${BASE_URL}/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true, // Include cookies or JWT tokens in the request
      }
    );

    const { token, user } = response.data;

    // Save session for offline login
    saveUserSession(token, user);

    return { token, user };
  } catch (error) {
    // Handle any errors that occur during the request
    const errorMessage =
      error.response?.data?.message || "Login failed. Please try again.";
    console.error("Login failed:", errorMessage);
    throw new Error(errorMessage);
  }
};

// Sync any queued offline registrations when back online
export const syncRegistrations = async () => {
  const offlineQueue = (await get("offline-registrations")) || [];

  if (offlineQueue.length === 0) return;

  console.log(`Syncing ${offlineQueue.length} offline registrations...`);

  for (const userData of offlineQueue) {
    try {
      await register(userData);
    } catch (error) {
      console.error("Failed to sync registration:", error);
    }
  }

  // Clear queue after syncing
  await set("offline-registrations", []);
};

// Listen for network connection and sync registrations
window.addEventListener("online", syncRegistrations);
