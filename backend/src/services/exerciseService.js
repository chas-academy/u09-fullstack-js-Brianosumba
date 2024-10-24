const dotenv = require("dotenv");

dotenv.config();

// Dynamic import for node-fetch
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Function to fetch a list of exercises with pagination
const fetchExercises = async (limit = 10, offset = 0) => {
  const url = `https://exercisedb.p.rapidapi.com/exercises?limit=${limit}&offset=${offset}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "exercisedb.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPIDAPI_KEY, // Accessing the RapidAPI key
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json(); // Parse and return the JSON response
};

// Function to fetch a specific exercise by ID
const fetchExerciseById = async (id) => {
  const url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "exercisedb.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPIDAPI_KEY, // Accessing the RapidAPI key
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json(); // Parse and return the JSON response
};

// Export the functions for use in other parts of the application
module.exports = { fetchExercises, fetchExerciseById }; // Use CommonJS export
