// src/services/exerciseService.js

// Function to fetch a list of exercises with pagination
const fetchExercises = async (limit = 10, offset = 0) => {
  const url = `https://exercisedb.p.rapidapi.com/exercises?limit=${limit}&offset=${offset}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "exercisedb.p.rapidapi.com", // Host for the API
      "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY, // Accessing the RapidAPI key from environment variables
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
      "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json(); // Parse and return the JSON response
};

// Export the functions for use in other parts of the application
export { fetchExercises, fetchExerciseById };
