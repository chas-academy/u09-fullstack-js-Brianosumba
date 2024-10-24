// services/authService.js

// The services folder acts as the communication center for your app.
// It manages how your frontend (React app) interacts with your backend (Node.js/Express) through HTTP requests.

import axios from "axios"; // Importing axios for making HTTP requests

//Base URL for your backend
const API_URL = "http://localhost:3000/api/auth";

// Register API call function
// This function sends a POST request to the server to register a new user.
// It takes userData as an argument, which contains the registration information.
export const register = async (userData) => {
  try {
    // Sending a POST request to the /api/register endpoint with userData
    const response = await axios.post(`${API_URL}/register`, userData, {
      withCredentials: true, //Include credentials in the request if needed for authentication
    });
    // Returning the response data from the server (usually user info or a success message)
    return response.data;
  } catch (error) {
    // Handle any errors that occur during the request
    throw new Error("Registration failed: " + error.message);
  }
};

/**
 * @param {string} username
 * @param {string} password
 * @desription Login API call function
 * This function sends a POST request to the server to log in a user.
 *  It takes userData as an argument, which contains the login credentials.
 */
export const loginWithCredentials = async (username, password) => {
  try {
    // Sending a POST request to the /api/login endpoint with userData
    const response = await axios.post(
      `${API_URL}/login`,
      {
        email: username,
        password,
      },
      {
        withCredentials: true, //Include cookies or jwt tokens in the request
      }
    );

    // Returning the response data from the server (usually user info or a success message)
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    // Handle any errors that occur during the request
    throw new Error("Login failed: " + error.message);
  }
};
