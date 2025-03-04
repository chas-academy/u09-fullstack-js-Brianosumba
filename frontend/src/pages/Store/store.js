import { create } from "zustand";
import { loginWithCredentials, checkAuth } from "../../services/authService";
import { socket } from "../../services/exerciseService";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  username: "",
  isAdmin: false,
  token: "",
  userId: "",

  //  Login Function
  login: async (email, password) => {
    console.log(" Logging in user:", email);
    try {
      const { token, user } = await loginWithCredentials(email, password);

      if (!token || !user) {
        console.error(" Login failed: Invalid credentials.");
        return { success: false, message: "Invalid email or password." };
      }

      // Store Token & User Info in Local Storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        isAuthenticated: true,
        username: user.username || "",
        token,
        isAdmin: user.isAdmin || false,
        userId: user.id || "",
      });

      console.log(" User logged in successfully:", {
        username: user.username,
        isAdmin: user.isAdmin,
      });

      return { success: true };
    } catch (error) {
      console.error(" Login failed:", error.message || error);
      return {
        success: false,
        message:
          error.response?.data?.message || "An error occurred. Try again.",
      };
    }
  },

  // Logout Function
  logout: () => {
    console.log(" Logging out user...");

    // Remove WebSocket event listeners
    socket.off("recommendationUpdated");

    // Clear Zustand state
    set({
      isAuthenticated: false,
      username: "",
      token: "",
      isAdmin: false,
      userId: "",
    });

    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    console.log(" User logged out successfully.");
  },

  // Auto-login if session exists
  checkAuth: async () => {
    console.log(" Checking authentication...");

    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken || !storedUser) {
        console.warn(" No active session found.");
        set({
          isAuthenticated: false,
          username: "",
          token: "",
          userId: "",
          isAdmin: false,
        });
        return;
      }

      const session = await checkAuth(storedToken);

      if (session && session.user) {
        set({
          isAuthenticated: true,
          username: session.user.username || "",
          token: storedToken,
          userId: session.user.id || "",
          isAdmin: session.user.isAdmin || false,
        });

        console.log(" User session restored:", {
          isAuthenticated: true,
          username: session.user.username,
        });
      } else {
        console.warn(" Session invalid or expired.");
        set({
          isAuthenticated: false,
          username: "",
          token: "",
          userId: "",
          isAdmin: false,
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error(" Error checking auth:", error.message || error);
      set({
        isAuthenticated: false,
        username: "",
        token: "",
        userId: "",
        isAdmin: false,
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
}));

export default useAuthStore;
