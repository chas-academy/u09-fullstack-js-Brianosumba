// services/authService.js

// The services folder acts as the communication center for your app.
// It manages how your frontend (React app) interacts with your backend (Node.js/Express) through HTTP requests.

import axios from "axios"; // Importing axios for making HTTP requests

//Base URL for your backend
const BASE_URL = import.meta.env.VITE_API_URL + "/auth";

// Register API call function
// This function sends a POST request to the server to register a new user.
// It takes userData as an argument, which contains the registration information.
export const register = async (userData) => {
  try {
    // Sending a POST request to the /api/register endpoint with userData
    const response = await axios.post(`${BASE_URL}/register`, userData, {
      withCredentials: true, //Include credentials in the request if needed for authentication
    });
    // Returning the response data from the server (usually user info or a success message)
    return response.data;
  } catch (error) {
    // Handle any errors that occur during the request
    const errorMessage =
      error.response?.data?.message || "Registration failed.";
    console.error("Refistration failed:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * @param {string} username
 * @param {string} password
 * @desription Login API call function
 * This function sends a POST request to the server to log in a user.
 *  It takes userData as an argument, which contains the login credentials.
 */
export const loginWithCredentials = async (email, password) => {
  try {
    // Sending a POST request to the /api/login endpoint with userData
    const response = await axios.post(
      `${BASE_URL}/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true, //Include cookies or jwt tokens in the request
      }
    );

    const { token, user } = response.data;

    // Savve token locally for persistance
    localStorage.setItem("token", token);
    return { token, user };
  } catch (error) {
    // Handle any errors that occur during the request
    const errorMessage =
      error.response?.data?.message || "Login failed. Please try again.";
    console.error("Login failed:", errorMessage);
    throw new Error(errorMessage);
  }
};
