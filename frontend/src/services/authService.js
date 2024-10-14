// services/authService.js
//The services folder is like your app’s communication center.
// It handles how your frontend (React app) talks to your backend (Node.js/Express) through HTTP requests
import axios from "axios";

//Register API call
export const register = async (userData) => {
  const response = await axios.post("/api/register", userData);
  return response.data;
};

// Login API call
export const login = async (userData) => {
  const response = await axios.post("/api/login", userData);
  return response.data;
};
