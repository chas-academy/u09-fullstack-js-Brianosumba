// userService.js

//Function to fetch users
export const fetchUsers = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired. Please log in again.");
    window.location.href = "/login"; //Redirect to login page
    throw new Error("No token found. Please log in again.");
  }

  try {
    console.log("Fetching users with token:", token);
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
      throw new Error(`Network response was not ok:  ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched users data:", data);

    if (!Array.isArray(data) || !data.every((user) => user?.id)) {
      throw new Error(
        "Invalid data structure: Users must be an array of objects with `id`."
      );
    }
    return data;
  } catch (error) {
    console.error("Error in fetchUsers", error);
    throw error;
  }
};

// Function to toggle user status
export const updateUserStatus = async (userId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired. Please log in again.");
    window.location.href = "/login";
    throw new Error("No token found. Please log in again");
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/users/${userId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token},`,
        },
      }
    );

    if (!response.ok) {
      const errorDetails = await response.text(); // Get detailed error message
      console.error("Failed to update user status:", errorDetails);
      throw new Error(`Failed to update user status: ${response.status}`);
    }

    const updatedUser = await response.json();
    console.log("Updated user status:", updatedUser);

    return updatedUser;
  } catch (error) {
    console.error("Error in updateUserStatus", error);
  }
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
