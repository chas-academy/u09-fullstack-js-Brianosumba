// // src/services/exerciseService.js

// Function to fetch a list of exercises with pagination
export const fetchExercises = async (limit = 10, offset = 0) => {
  const url = `https://exercisedb.p.rapidapi.com/exercises?limit=${limit}&offset=${offset}`;

  try {
    //make a request to fetch exercises
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "exercisedb.p.rapidapi.com", // Host for the API
        "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY, // Accessing the RapidAPI key from environment variables
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch exercises.");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};

//Function to fetch detailed information for a specific exercise by ID
export const fetchExerciseById = async (id) => {
  const url = `https://exercisedb.p.rapidapi.com/exercises/${id}`;

  try {
    //Request to fetch a specific exeercise by ID
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "exercisedb.p.rapidapi.com", // Host for the API
        "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY, // Accessing the RapidAPI key from environment variables
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch exercise with ID ${id}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching exercise by ID:", error);
    throw error;
  }
};

//function to delet a specific exercise by ID
export const deleteExercise = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. Please log in again.");
  }

  const url = `http://localhost:3000/api/exercises/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete exercise with ID ${id}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error deleteing exercise:", error);
    throw error;
  }
};

// // Function to fetch a list of exercises with pagination
// const fetchExercises = async (limit = 10, offset = 0) => {
//   const url = `https://exercisedb.p.rapidapi.com/exercises?limit=${limit}&offset=${offset}`;

//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       "x-rapidapi-host": "exercisedb.p.rapidapi.com", // Host for the API
//       "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY, // Accessing the RapidAPI key from environment variables
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }

//   return response.json(); // Parse and return the JSON response
// };

// // Function to fetch a specific exercise by ID
// const fetchExerciseById = async (id) => {
//   const url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`;

//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       "x-rapidapi-host": "exercisedb.p.rapidapi.com",
//       "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }

//   return response.json(); // Parse and return the JSON response
// };

// // Export the functions for use in other parts of the application
// export { fetchExercises, fetchExerciseById };
