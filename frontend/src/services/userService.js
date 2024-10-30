// userService.js

//Function to fetch users
export const fetchUsers = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. Please log in again.");
  }

  const response = await fetch("http://localhost:3000/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  //error handling with detailed logging
  if (!response.ok) {
    const errorDetails = await response.text(); // Get detailed error message
    console.error("Error fetching users:", errorDetails); // Log error details
    throw new Error("Network response was not ok: " + errorDetails);
  }

  return response.json(); // Return the parsed JSON data
};

// Function to toggle user status
export const updateUserStatus = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:3000/api/users/${userId}/status`,
    {
      method: "PATCH", // Use PATCH to update the user's status
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorDetails = await response.text(); // Get detailed error message
    console.error("Failed to update user status:", errorDetails);
    throw new Error("Failed to update user status: " + errorDetails);
  }

  return response.json(); // Return the updated user data if needed
};

// function to recommend a workout to a user
export const recommendWorkout = async (userId, workoutId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:3000/api/users/${userId}/recommend`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ workoutId }),
    }
  );

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error("Failed to recommend workout:", errorDetails);
    throw new Error("Failed to recommend workout: " + errorDetails);
  }

  return response.json();
};

//Function to edit user details
export const editUser = async (userId, updates) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error("Failed to update user details:", errorDetails);
    throw new Error("Failed to update user details: " + errorDetails);
  }
  return response.json();
};

//Function to delete a user
export const deleteUser = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error("Failed to delete user:", errorDetails);
    throw new Error("Failed to delete user:" + errorDetails);
  }
  return response.json();
};
