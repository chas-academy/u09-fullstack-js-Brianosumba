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
          email: user.email || "",
          token,
          isAdmin: user.isAdmin || false,
          userId: user.id || "",
        });

        //store token and userId in localstorage for persistence
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id); //save userId for later use
        console.log("User logged in successfully:", {
          isAuthenticated: true,
          email: user.email,
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
    localStorage.removeItem("userId");
    console.log("User logged out:", { isAuthenticated: false, username: "" });
  },

  // Action to check if token exists (for auto-login)
  checkAuth: () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    console.log(
      "Checking auth. Token found:",
      !!token,
      "User ID found:",
      !!userId
    );
    if (token && userId) {
      set({ isAuthenticated: true, userId, token }); // Restore userId from localStorage
      console.log("User is authenticated:", { isAuthenticated: true, userId }); // Optionally restore token if needed in other areas
    } else {
      console.log("User is not authenticated:", { isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
