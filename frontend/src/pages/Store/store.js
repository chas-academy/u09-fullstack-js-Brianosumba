// We'll create a global store that handles authentication state.
//Think of the store as a shared vault where all components can access and update values.

import create from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  username: "",

  //Action to log in a user
  login: (username) => set({ isAuthenticated: true, username }),

  //Action to log out a user
  logout: () => set({ isAuthenticated: false, username: "" }),

  //Action to check if token exists (for auto-login)
  checkAuth: () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ isAuthenticated: true });
    }
  },
}));

export default useAuthStore;
