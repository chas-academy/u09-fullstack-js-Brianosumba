import { create } from "zustand";
import { loginWithCredentials, checkAuth } from "../../services/authService";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  username: "",
  isAdmin: false,
  token: "",
  userId: "",

  //  Login action (uses `authService.js`)
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

        console.log(" User logged in successfully:", {
          isAuthenticated: true,
          username: user.username,
        });
        return true;
      }
    } catch (error) {
      console.error(" Login failed", error.message || error);
      return false;
    }
  },

  //  Logout action
  logout: () => {
    console.log(" Logging out user");
    set({
      isAuthenticated: false,
      username: "",
      token: "",
      isAdmin: false,
      userId: "",
    });

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log(" User logged out.");
  },

  //  Auto-login if session exists
  checkAuth: () => {
    const session = checkAuth();
    if (session) {
      set({
        isAuthenticated: true,
        username: session.user.username,
        token: session.token,
        userId: session.user.id,
        isAdmin: session.user.isAdmin || false,
      });
      console.log(" User session restored:", {
        isAuthenticated: true,
        username: session.user.username,
      });
    } else {
      console.log(" No active session found.");
    }
  },
}));

export default useAuthStore;
