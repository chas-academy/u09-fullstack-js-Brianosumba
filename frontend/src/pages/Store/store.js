import { create } from "zustand";
import {
  loginWithCredentials,
  registerUser,
  checkAuth,
} from "../../services/authService";
import { socket } from "../../services/exerciseService";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  username: "",
  isAdmin: false,
  token: "",
  userId: "",

  // ✅ Register Function
  register: async ({ username, email, password }) => {
    console.log(" Registering user...");
    try {
      const { token, user } = await registerUser({ username, email, password });

      if (!token || !user) {
        console.error(" Registration failed: No token/user returned.");
        return { success: false, message: "Registration failed." };
      }

      //  Store Token & User Info in Local Storage
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin || false,
        })
      );

      set({
        isAuthenticated: true,
        username: user.username,
        token,
        isAdmin: user.isAdmin || false,
        userId: user.id,
      });

      console.log(" Registration successful:", user);
      return { success: true, user };
    } catch (error) {
      console.error(" Registration error:", error.message || error);
      return {
        success: false,
        message: error.message || "Registration failed.",
      };
    }
  },

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
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin || false,
        })
      );

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
      //  Parse stored user info (Ensuring `isAdmin` is always retrieved)
      const parsedUser = JSON.parse(storedUser);
      console.log(" Retrieved user from localStorage:", parsedUser);

      const session = await checkAuth(storedToken);

      if (session && session.user) {
        set({
          isAuthenticated: true,
          username: session.user.username || "",
          token: storedToken,
          userId: session.user.id || "",
          isAdmin: session.user.isAdmin ?? parsedUser.isAdmin,
        });

        console.log(" User session restored:", {
          isAuthenticated: true,
          username: session.user.username,
          isAdmin: session.user.isAdmin,
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
