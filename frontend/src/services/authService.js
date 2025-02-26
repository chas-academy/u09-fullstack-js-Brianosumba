import axios from "axios";
import { get, set } from "idb-keyval"; // IndexedDB for offline storage

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth`
  : "http://localhost:3000/api/auth";

//  Save user session in localStorage
export const saveUserSession = async (token, user) => {
  if (!token || !user) {
    console.warn(" Attempted to save an invalid session.");
    return;
  }

  console.log(" Saving user session...");
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  //  'await' now works inside this function
  await set("offline-user-session", { token, user });

  console.log(" User session saved:", { token, user });
};

//  Retrieve stored user session for offline login
export const getOfflineUser = async () => {
  let token = localStorage.getItem("token");
  let user = localStorage.getItem("user");

  console.log("🛠 Checking localStorage for offline user:", { token, user });

  if (!token || !user) {
    console.warn(" No session found in localStorage. Checking IndexedDB...");
    const offlineSession = await get("offline-user-session"); // IndexedDB backup
    if (offlineSession) {
      token = offlineSession.token;
      user = JSON.stringify(offlineSession.user);
      console.log(" Restored user session from IndexedDB:", offlineSession);
    }
  }

  if (!token || !user) {
    console.warn(" No valid user session found.");
    return { token: null, user: null }; //  Return a valid object instead of `null`
  }

  return { token, user: JSON.parse(user) };
};

//  Offline login function (returns stored user data if available)
export const offlineLogin = async () => {
  console.warn(" Trying offline login...");
  const offlineUser = await getOfflineUser();

  if (!offlineUser) {
    console.error(" No offline user found in localStorage or IndexedDB.");
    throw new Error("No offline user found. Please log in online first.");
  }

  console.log(" Offline login successful:", offlineUser);
  return offlineUser;
};

//  Check if user is already authenticated
export const checkAuth = async () => {
  console.log(" Running checkAuth()...");
  const offlineUser = await getOfflineUser();

  console.log("🛠 Retrieved user:", offlineUser);

  if (
    !offlineUser ||
    !offlineUser.user ||
    Object.keys(offlineUser.user).length === 0
  ) {
    console.warn(" No authenticated user found.");
    return { token: null, user: {} }; // Always return an empty object for `user`
  }

  console.log(
    " User is authenticated:",
    offlineUser.user?.username || "No Username Found"
  );
  return offlineUser; //  Safe return
};

//  Register a user (offline support)
export const register = async (userData) => {
  if (!navigator.onLine) {
    console.warn(" Offline mode detected. Saving registration for later...");

    const offlineQueue = (await get("offline-registrations")) || [];
    offlineQueue.push(userData);
    await set("offline-registrations", offlineQueue);

    console.log(" Registration saved for offline sync.");
    return { message: "Registered offline. Will sync when online." };
  }

  try {
    console.log(" Online mode: Registering user...");
    const response = await axios.post(`${BASE_URL}/register`, userData, {
      withCredentials: true,
    });

    const { token, user } = response.data;
    await saveUserSession(token, user);

    console.log(" Registration successful.");
    return { token, user };
  } catch (error) {
    console.error(" Registration failed:", error.message || error);
    throw new Error("Registration failed. Please try again.");
  }
};

//  Login user (offline support)
export const loginWithCredentials = async (email, password) => {
  if (!navigator.onLine) {
    console.warn(" Offline mode detected: Using stored data...");
    const offlineUser = await getOfflineUser();
    if (offlineUser) {
      console.log("Offline login successful:", offlineUser);
      return offlineUser;
    }
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

  if (offlineQueue.length === 0) {
    console.log(" No offline registrations to sync.");
    return;
  }

  console.log(` Syncing ${offlineQueue.length} offline registrations...`);
  const failedQueue = [];

  for (const userData of offlineQueue) {
    try {
      await register(userData);
      console.log(" Successfully synced:", userData.email);
    } catch (error) {
      console.error(" Failed to sync:", userData.email, error);
      failedQueue.push(userData); // Keep failed registrations
    }
  }

  await set("offline-registrations", failedQueue);
};

window.addEventListener("online", syncRegistrations);
