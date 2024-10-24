// userService.js

export const fetchUsers = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("WOOOW sätt en token");
  }
  const response = await fetch("http://localhost:3000/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }

  return response.json(); // Return the parsed JSON data
};

// Define the updateUserStatus function
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
    throw new Error("Failed to update user status: " + response.statusText);
  }

  return response.json(); // Return the updated user data if needed
};
