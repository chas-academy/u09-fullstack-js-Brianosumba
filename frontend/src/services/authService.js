import axios from "axios";
import { get, set } from "idb-keyval"; // IndexedDB for offline storage

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth`
  : "http://localhost:3000/api/auth";

// 🔹 Save user session in localStorage
export const saveUserSession = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// 🔹 Retrieve stored user session for offline login
export const getOfflineUser = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  return token && user ? { token, user } : null;
};

// 🔹 Check if user is already authenticated
export const checkAuth = () => {
  return getOfflineUser();
};

// 🔹 Register a user (offline support)
export const register = async (userData) => {
  if (!navigator.onLine) {
    console.warn(" Offline mode: Saving registration for later...");
    const offlineQueue = (await get("offline-registrations")) || [];
    offlineQueue.push(userData);
    await set("offline-registrations", offlineQueue);
    return { message: "Registered offline. Will sync later." };
  }

  try {
    const response = await axios.post(`${BASE_URL}/register`, userData, {
      withCredentials: true,
    });

    const { token, user } = response.data;
    saveUserSession(token, user); // save user session

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
    console.warn(" Offline mode: Using stored data...");
    const offlineUser = getOfflineUser();
    if (offlineUser) return offlineUser;
    throw new Error("No offline user found. Please connect to the internet.");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      { email, password },
      { withCredentials: true }
    );
    const { token, user } = response.data;

    saveUserSession(token, user); // Save user session

    return { token, user };
  } catch (error) {
    console.error(" Login failed:", error.response?.data?.message || error);
    throw new Error("Login failed. Please check your credentials.");
  }
};

// 🔹 Sync any offline registrations when back online
export const syncRegistrations = async () => {
  const offlineQueue = (await get("offline-registrations")) || [];
  if (offlineQueue.length === 0) return;

  console.log(`🔄 Syncing ${offlineQueue.length} offline registrations...`);
  for (const userData of offlineQueue) {
    try {
      await register(userData);
    } catch (error) {
      console.error(" Failed to sync registration:", error);
    }
  }
  await set("offline-registrations", []);
};

window.addEventListener("online", syncRegistrations); //  Auto-sync on network reconnect
