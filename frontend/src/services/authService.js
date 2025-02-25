import axios from "axios";
import { get, set } from "idb-keyval"; // IndexedDB for offline storage

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth`
  : "http://localhost:3000/api/auth";

//  Save user session in localStorage
export const saveUserSession = (token, user) => {
  if (!token || !user) {
    console.warn(" Attempted to save an invalid session.");
    return;
  }

  console.log(" Saving user session...");
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  //  Ensure session is saved
  console.log(" User session saved:", { token, user });
};

//  Retrieve stored user session for offline login
export const getOfflineUser = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  return token && user ? { token, user } : null;
};

//  Offline login function (returns stored user data if available)
export const offlineLogin = async () => {
  console.warn("Trying offline login...");
  const offlineUser = getOfflineUser();
  if (!offlineUser) {
    console.error("No offline user found. Make sure you log in online first");
    throw new Error("No offline user found. Please log in online first.");
  }
  console.log(" Offline login successful:", offlineUser);
  return offlineUser;
};

//  Check if user is already authenticated
export const checkAuth = () => {
  return getOfflineUser();
};

//  Register a user (offline support)
export const register = async (userData) => {
  if (!navigator.onLine) {
    console.warn("Offline mode: Saving registration for later...");
    const offlineQueue = (await get("offline-registrations")) || [];
    offlineQueue.push(userData);
    await set("offline-registrations", offlineQueue);
    return { message: "Registered offline. Will sync later." };
  }

  try {
    console.log("Online mode: Registering user...");
    const response = await axios.post(`${BASE_URL}/register`, userData, {
      withCredentials: true,
    });

    const { token, user } = response.data;
    saveUserSession(token, user); //  Save user session for offline access

    return { token, user };
  } catch (error) {
    console.error(
      " Registration failed:",
      error.response?.data?.message || error
    );
    throw new Error("Registration failed. Please try again.");
  }
};

// 🔹 Login user (offline support)
export const loginWithCredentials = async (email, password) => {
  if (!navigator.onLine) {
    console.warn(" Offline mode detected: Using stored data...");
    const offlineUser = getOfflineUser();
    if (offlineUser) return offlineUser;
    throw new Error("No offline user found. Please connect to the internet.");
  }

  try {
    console.log(" Online mode: Logging in...");
    const response = await axios.post(
      `${BASE_URL}/login`,
      { email, password },
      { withCredentials: true }
    );
    const { token, user } = response.data;

    saveUserSession(token, user); // Save user session for offline access
    console.log("Login successful. Session stored for offline access");

    return { token, user };
  } catch (error) {
    console.error(" Login failed:", error.response?.data?.message || error);
    throw new Error("Login failed. Please check your credentials.");
  }
};

//  Sync any offline registrations when back online
export const syncRegistrations = async () => {
  const offlineQueue = (await get("offline-registrations")) || [];
  if (offlineQueue.length === 0) return;

  console.log(` Syncing ${offlineQueue.length} offline registrations...`);
  for (const userData of offlineQueue) {
    try {
      await register(userData);
    } catch (error) {
      console.error(" Failed to sync registration:", error);
    }
  }
  await set("offline-registrations", []);
};

window.addEventListener("online", syncRegistrations);
