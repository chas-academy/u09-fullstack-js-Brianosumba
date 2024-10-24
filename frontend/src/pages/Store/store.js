// We'll create a global store that handles authentication state.
//Think of the store as a shared vault where all components can access and update values.

import { create } from "zustand";
import { loginWithCredentials } from "../../services/authService";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  username: "",
  isAdmin: false,
  token: "",

  /**
   * @param {string} username
   * @param {string} password
   * @desription Action to log in a user
   */
  login: async (username, password) => {
    console.log("Logging in user:", username);
    const data = await loginWithCredentials(username, password);
    if (data) {
      set({
        isAuthenticated: true,
        username: data?.user?.username,
        token: data?.token,
        isAdmin: data?.user?.isAdmin,
      });
      console.log("User logged in:", { isAuthenticated: true, username });
      return true;
    }
    return false;
  },

  // Action to log out a user
  logout: () => {
    console.log("Logging out user");
    set({ isAuthenticated: false, username: "" });
    console.log("User logged out:", { isAuthenticated: false, username: "" });
  },

  // Action to check if token exists (for auto-login)
  checkAuth: () => {
    const token = localStorage.getItem("token");
    console.log("Checking auth. Token found:", token !== null);
    if (token) {
      set({ isAuthenticated: true });
      console.log("User is authenticated:", { isAuthenticated: true });
    } else {
      console.log("User is not authenticated:", { isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
