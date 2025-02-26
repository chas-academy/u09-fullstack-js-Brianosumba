import { create } from "zustand";
import { loginWithCredentials, checkAuth } from "../../services/authService";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  username: "",
  isAdmin: false,
  token: "",
  userId: "",

  // Login action (calls `loginWithCredentials` from `authService.js`)
  login: async (email, password) => {
    console.log("🔑 Logging in user:", email);
    try {
      const { token, user } = await loginWithCredentials(email, password);

      if (token && user) {
        set({
          isAuthenticated: true,
          username: user.username || "",
          token,
          isAdmin: user.isAdmin || false,
          userId: user.id || "",
        });

        console.log("User logged in successfully:", {
          isAuthenticated: true,
          username: user.username,
        });

        return true;
      }
    } catch (error) {
      console.error(" Login failed:", error.message || error);
      return false;
    }
  },

  //  Logout action
  logout: () => {
    console.log("🚪 Logging out user...");
    set({
      isAuthenticated: false,
      username: "",
      token: "",
      isAdmin: false,
      userId: "",
    });

    // Clear session data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    console.log(" User logged out.");
  },

  //  Auto-login if session exists
  checkAuth: async () => {
    console.log(" Checking authentication...");

    try {
      const session = await checkAuth(); //  Make sure to await this!

      if (session && session.user) {
        set({
          isAuthenticated: true,
          username: session.user.username || "",
          token: session.token || "",
          userId: session.user.id || "",
          isAdmin: session.user.isAdmin || false,
        });

        console.log(" User session restored:", {
          isAuthenticated: true,
          username: session.user.username,
        });
      } else {
        console.log(" No active session found.");
        set({ isAuthenticated: false, username: "", token: "", userId: "" });
      }
    } catch (error) {
      console.error(" Error checking auth:", error.message || error);
      set({ isAuthenticated: false, username: "", token: "", userId: "" });
    }
  },
}));

export default useAuthStore;
