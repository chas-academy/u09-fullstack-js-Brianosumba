import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import AdminCard from "../../components/AdminCard";
import { FaBell } from "react-icons/fa";
import io from "socket.io-client";
import {
  handleRecommendExercise,
  handleUpdateRecommendation,
  handleDeleteRecommendation,
} from "./ExerciseCrud";
import { fetchUsers, updateUserStatus } from "../../services/userService";
import EditRecommendationModal from "../../components/EditRecommendationModal";
import axios from "axios";
import {
  fetchAllRecommendations,
  fetchExercisesfromDB,
  handleDeleteCompletedWorkout,
} from "../../services/exerciseService";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [exerciseCompletions, setExerciseCompletions] = useState([]);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecommendation, setEditingRecommendation] = useState(null);

  const token = localStorage.getItem("token");

  // redirect to login if no valid token is found
  useEffect(() => {
    if (!token) {
      alert("Session expired. Please log in again");
      window.location.href = "/login";
    }
  }, [token]);

  // Fetch users
  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
        console.log("Fetched users:", usersData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again later");
      }
    };

    loadData();
  }, [token]);

  // Fetch recommendations and exercises
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const recommendationData = await fetchAllRecommendations();
        console.log("Fetched Recommendations:", recommendationData);

        if (!Array.isArray(recommendationData)) {
          console.error("Invalid recommendations format:", recommendationData);
          return;
        }

        const exerciseData = await fetchExercisesfromDB();
        const recommendationsWithDetails = recommendationData.map((rec) => ({
          ...rec,
          exerciseDetails: exerciseData.find((ex) => ex.id === rec.exerciseId),
        }));

        console.log(
          "Processed Recommendations with Exercise Details:",
          recommendationsWithDetails
        );
        setRecommendations(recommendationsWithDetails);
      } catch (error) {
        console.error("Error fetching recommendations:", error.message);
      }
    };

    const loadExercises = async () => {
      try {
        const exerciseData = await fetchExercisesfromDB();
        console.log("Fetched Exercises:", exerciseData);
        setExercises(exerciseData);
      } catch (error) {
        console.error("Error fetching exercises:", error.message);
      }
    };

    loadRecommendations();
    loadExercises();
  }, [setRecommendations, setExercises]);

  // Fetch completed workouts from the backend
  useEffect(() => {
    const fetchCompletedWorkouts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/exercises/completed`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setExerciseCompletions(response.data);
      } catch (error) {
        console.error("Error fetching completed workouts:", error.message);
      }
    };

    fetchCompletedWorkouts();
  }, [token]);

  // Setup Socket.IO
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("joinAdminRoom");
    });

    // Listen for workout completion updates
    socket.on("exerciseCompleted", (data) => {
      console.log("Received workout completion:", data);

      // Update admin’s workout completion table in real-time
      setExerciseCompletions((prevCompletions) => [data, ...prevCompletions]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleStatus = async (userId) => {
    const updatedUsers = users.map((user) =>
      user._id === userId ? { ...user, isActive: !user.isActive } : user
    );

    setUsers(updatedUsers);

    try {
      await updateUserStatus(userId, token);
      addNotification("User status updated successfully", "success");
    } catch (err) {
      console.error("Error updating user status:", err);
      // Revert status on error
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );
      setError("Failed to update user status. Please try again.");
    }
  };

  // **Add a notification**
  const addNotification = (message, type) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { message, type },
    ]);
    setNotificationCount((prevCount) => prevCount + 1);
  };

  // **Handle notifications click**
  const handleNotificationClick = () => {
    if (notifications.length > 0) {
      alert(notifications.map((n) => n.message).join("\n"));
      setNotifications([]);
      setNotificationCount(0);
    } else {
      alert("No new notifications");
    }
  };

  const onRecommendClick = async (userId, exerciseId) => {
    if (!userId || !exerciseId) {
      alert("Please provide valid user and exercise details.");
      console.error("Invalid userId or exerciseId:", { userId, exerciseId });
      return;
    }

    try {
      // Call API to recommend exercise
      const newRecommendation = await handleRecommendExercise(
        userId,
        exerciseId,
        token
      );

      if (!newRecommendation || !newRecommendation._id) {
        console.error("Error: No recommendation received from API.");
        return;
      }

      addNotification("Exercise recommended successfully!", "success");

      // Directly update the state
      setRecommendations((prev) => [
        ...prev,
        {
          ...newRecommendation,
          exerciseDetails: exercises.find(
            (ex) => ex.id === newRecommendation.exerciseId
          ),
        },
      ]);

      console.log("Updated Recommendations:", newRecommendation);
    } catch (error) {
      console.error(
        "Failed to recommend exercise:",
        error.response?.data || error.message
      );
      addNotification(
        "Failed to recommend exercise. Please try again.",
        "error"
      );
    }
  };

  const openEditModal = async (data) => {
    console.log("User data passed to openEditModal:", data);

    if (!data || !data.recommendationId || !data.exerciseId) {
      console.error("Invalid recommendation data:", data);
      alert("The selected user does not have a valid recommendation to edit.");
      return;
    }

    setEditingRecommendation({
      id: data.recommendationId,
      currentExerciseId: data.exerciseId || "",
      notes: data.notes || "",
    });

    console.log("Editing recommendation:", {
      id: data.recommendationId,
      currentExerciseId: data.exerciseId || "",
      notes: data.notes || "",
    });

    setIsModalOpen(true);
  };

  const handleSaveRecommendation = async (recommendationId, updatedFields) => {
    if (!recommendationId || !updatedFields.exerciseId) {
      console.error("Invalid recommendation or updated data:", {
        recommendationId,
        updatedFields,
      });
      return;
    }

    try {
      //  Use `getAuthHeaders()` to always send a valid token
      const headers = getAuthHeaders();

      //  Send API request to update the recommendation
      const response = await handleUpdateRecommendation(
        recommendationId,
        updatedFields,
        headers
      );

      //  Ensure API response contains updated data
      if (!response || !response.data || !response.data.data) {
        console.error("Error: No updated recommendation received from API.");
        return;
      }

      const updatedRecommendation = response.data.data;
      console.log("Updated recommendation received:", updatedRecommendation);

      addNotification("Recommendation updated successfully", "success");

      //  Update the recommendations state
      setRecommendations((prev) =>
        prev.map((rec) =>
          rec._id === recommendationId
            ? {
                ...rec,
                exerciseId: updatedRecommendation.exerciseId, //  Ensure we use the updated exerciseId
                notes: updatedRecommendation.notes, //  Ensure we use the updated notes
                exerciseDetails:
                  exercises.find(
                    (ex) => ex.id === updatedRecommendation.exerciseId
                  ) || rec.exerciseDetails, //  Fallback to existing details if not found
              }
            : rec
        )
      );

      //  Close modal
      setEditingRecommendation(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        "Failed to update recommendation:",
        error.response?.data || error.message
      );

      addNotification(
        "Failed to update recommendation. Please try again.",
        "error"
      );
    }
  };

  const onDeleteRecommendation = async (recommendationId) => {
    if (!recommendationId) {
      alert("Recommendation ID is required.");
      return;
    }

    try {
      console.log("Deleting recommendation ID:", recommendationId);

      await handleDeleteRecommendation(recommendationId, token);
      addNotification("Recommendation deleted successfully!", "success");

      // Remove deleted recommendation from state
      setRecommendations((prev) =>
        prev.filter((rec) => rec._id !== recommendationId)
      );

      console.log("Updated recommendations after deletion");
    } catch (error) {
      console.error(
        "Failed to delete recommendation:",
        error.response?.data || error.message
      );
      addNotification(
        "Failed to delete recommendation. Please try again.",
        "error"
      );
    }
  };

  const onDeleteCompletedWorkout = async (workoutId) => {
    console.log("Workout ID being deleted:", workoutId);

    if (!workoutId) {
      alert("Workout ID is required.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workout?"
    );
    if (!confirmDelete) return;

    try {
      console.log("Sending delete request for workout:", workoutId);

      await handleDeleteCompletedWorkout(workoutId);

      alert("Workout deleted successfully!");

      // Update state to remove deleted workout
      setExerciseCompletions((prev) =>
        prev.filter((workout) => workout._id !== workoutId)
      );

      console.log("Updated workout completions after deletion.");
    } catch (error) {
      console.error(
        "Failed to delete workout:",
        error.response?.data || error.message
      );
      alert("Failed to delete workout. Please try again.");
    }
  };

  if (!users.length && !error) return <p>Loading data... </p>;
  {
    error && <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 via-gray-100 to-blue-200">
      <NavBar />
      <div className="container mx-auto py-8 flex-grow">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-800 mb-8 drop-shadow-lg">
          Welcome to Your Admin Dashboard
        </h1>

        {error && <p className="text-red-500 text-center text-lg">{error}</p>}

        {/* Notifications Button */}
        <div className="flex justify-center items-center mb-8 px-4">
          <button
            type="button"
            aria-label="Notifications"
            className="relative text-gray-800 hover:text-gray-900 transition duration-300 ml-4"
            onClick={handleNotificationClick}
          >
            <FaBell className="h-8 w-8 text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-125" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AdminCard title="Total Users">
            <p className="text-3xl font-bold text-blue-700">
              {users.length} users
            </p>
          </AdminCard>
          <AdminCard title="Active Users">
            <p className="text-3xl font-bold text-green-600">
              {users.filter((user) => user.isActive).length} active
            </p>
          </AdminCard>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg mb-8">
          <table className="min-w-full border border-gray-200 text-sm text-gray-800">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Name
                </th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Email
                </th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Status
                </th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Level
                </th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => user && user._id)
                .map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="py-4 px-6">{user.username}</td>
                    <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleStatus(user._id)}
                        className={`py-1 px-3 rounded text-sm font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        } transition duration-300`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4 px-6">{user.level}</td>
                    <td className="py-4 px-6">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          const exerciseId = e.target.value;
                          if (!exerciseId) return;
                          onRecommendClick(user._id, exerciseId);
                        }}
                        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
                      >
                        <option value="" disabled>
                          Select Exercise
                        </option>
                        {exercises.map((exercise) => (
                          <option key={exercise.id} value={exercise.id}>
                            {exercise.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Recommendations Table */}
        <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-blue-800">
          Recommended Exercises
        </h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg mb-8">
          <table className="min-w-full border border-gray-200 text-sm text-gray-800">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  User
                </th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Exercise
                </th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Notes
                </th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec) => {
                const user = users.find(
                  (user) => user && user._id === rec.userId
                );

                const exercise = rec.exerciseDetails;

                return (
                  <tr
                    key={rec._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="py-4 px-6">
                      {user?.username || `User not found (ID: ${rec.userId})`}
                    </td>
                    <td className="py-4 px-6">
                      {exercise?.name || "Exercise details not available"}
                    </td>
                    <td className="py-4 px-6">
                      {rec.notes || "No notes provided"}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() =>
                          openEditModal({
                            recommendationId: rec._id,
                            exerciseId: rec.exerciseId,
                            notes: rec.notes,
                          })
                        }
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteRecommendation(rec._id)}
                        className="text-red-500 hover:underline ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Recent Exercise Completions Table */}
        <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-blue-800">
          Recent Exercise Completions
        </h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full border border-gray-200 text-sm text-gray-800">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Username
                </th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Workout Type
                </th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Target
                </th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Level
                </th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Completed At
                </th>
                <th className="py-4 px-6 text-left font-semibold uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {exerciseCompletions.map((completion, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="py-4 px-6">
                    {completion.username || "Unknown User"}
                  </td>
                  <td className="py-4 px-6">{completion.workoutType}</td>
                  <td className="py-4 px-6">{completion.target}</td>
                  <td className="py-4 px-6">{completion.level}</td>
                  <td className="py-4 px-6">
                    {new Date(completion.completedAt).toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => {
                        console.log(
                          "Workout ID being sent to delete:",
                          completion._id
                        ); // Debugging
                        onDeleteCompletedWorkout(completion._id);
                      }}
                      className="text-red-500 hover:underline ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Recommendation Modal */}
      <EditRecommendationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecommendation}
        exercises={exercises}
        currentExerciseId={editingRecommendation?.currentExerciseId || ""}
        currentNotes={editingRecommendation?.notes || ""}
        recommendationId={editingRecommendation?.id}
      />

      <Footer />
    </div>
  );
};

export default Admin;
