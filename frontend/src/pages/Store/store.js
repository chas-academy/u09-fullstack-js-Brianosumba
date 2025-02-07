// We'll create a global store that handles authentication state.
//Think of the store as a shared vault where all components can access and update values.

import { create } from "zustand";
import { loginWithCredentials } from "../../services/authService";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  username: "",
  isAdmin: false,
  token: "",
  userId: "",

  /**
   * @param {string} email
   * @param {string} password
   * @desription Action to log in a user
   */
  login: async (email, password) => {
    console.log("Logging in user:", email);
    try {
      const { token, user } = await loginWithCredentials(email, password);

      if (token) {
        set({
          isAuthenticated: true,
          username: user.username || "",
          token,
          isAdmin: user.isAdmin || false,
          userId: user.id || "",
        });

        //store token and userId in localstorage for persistence
        localStorage.setItem("token", token);
        localStorage.setItem("username", user.username);
        localStorage.setItem("userId", user.id);
        console.log("User logged in successfully:", {
          isAuthenticated: true,
          username: user.username,
        });
        return true;
      }
    } catch (error) {
      console.error("Login failed", error.message || error);
      return false;
    }
  },

  // Action to log out a user
  logout: () => {
    console.log("Logging out user");
    set({
      isAuthenticated: false,
      username: "",
      token: "",
      isAdmin: false,
      userId: "",
    });

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    console.log("User logged out:", { isAuthenticated: false, username: "" });
  },

  // Action to check if token exists (for auto-login)
  checkAuth: () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    console.log(
      "Checking auth. Token found:",
      !!token,
      "User ID found:",
      !!username
    );
    if (token && username) {
      set({ isAuthenticated: true, username, token }); // Restore username from localStorage
      console.log("User session restored:", {
        isAuthenticated: true,
        username,
      }); // Optionally restore token if needed in other areas
    } else {
      console.log("No active session found.");
    }
  },
}));

export default useAuthStore;
