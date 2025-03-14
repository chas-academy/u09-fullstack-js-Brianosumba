import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import AdminCard from "../../components/AdminCard";
import { FaBell } from "react-icons/fa";
import { fetchExerciseDetails, socket } from "../../services/exerciseService";
import {
  handleRecommendExercise,
  handleUpdateRecommendation,
  handleDeleteRecommendation,
} from "./ExerciseCrud";
import { fetchUsers, updateUserStatus } from "../../services/userService";
import EditRecommendationModal from "../../components/EditRecommendationModal";
import {
  fetchAllRecommendations,
  fetchExercisesfromDB,
  handleDeleteCompletedWorkout,
  getAuthHeaders,
} from "../../services/exerciseService";
import useAuthStore from "../Store/store";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const Admin = () => {
  const { isAuthenticated, token, logout } = useAuthStore();

  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [exerciseCompletions, setExerciseCompletions] = useState([]);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecommendation, setEditingRecommendation] = useState(null);

  //  Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !token) {
      alert("Session expired. Please log in again.");
      logout();
      setTimeout(() => (window.location.href = "/login"), 500);
    }
  }, []);

  //  Fetch All Admin Data at Once (Users, Exercises, Recommendations)
  useEffect(() => {
    if (!token) return;

    const loadAdminData = async () => {
      try {
        const usersData = await fetchUsers();
        const exerciseData = await fetchExercisesfromDB();
        const recommendationData = await fetchAllRecommendations();

        console.log("✅ Loaded exercises:", exerciseData);
        exerciseData.forEach((ex, index) =>
          console.log(`Exercise ${index}:`, ex)
        );
        if (!usersData || !exerciseData || !recommendationData) {
          throw new Error("One or more API responses are empty.");
        }

        setUsers(usersData);
        setExercises(exerciseData);

        console.log("Fetched recommendations:", recommendationData);

        const formattedRecommendations = (recommendationData ?? []).map(
          (rec) => ({
            ...rec,
            exerciseDetails: exerciseData.find(
              (ex) => ex.id === rec.exerciseId
            ) || { name: "Unknown Exercise" },
            userDetails: usersData.find((user) => user._id === rec.userId) || {
              username: "Unkown User",
            },
          })
        );

        setRecommendations(formattedRecommendations);
      } catch (err) {
        console.error("Error loading admin data:", err);
        setError("Failed to load admin data. Please try again later.");
      }
    };

    loadAdminData();
  }, [token]);

  // Fetch Completed Workouts
  useEffect(() => {
    if (!token) return;

    const fetchCompletedWorkouts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/exercises/completed`, {
          headers: getAuthHeaders(),
        });
        setExerciseCompletions(response.data);
      } catch (error) {
        console.error("Error fetching completed workouts:", error.message);
        setError("Failed to load completed workouts. Please try again");
      }
    };

    fetchCompletedWorkouts();
  }, [token]);

  //Websocket event listners
  useEffect(() => {
    const handleExerciseCompleted = (data) => {
      setExerciseCompletions((prev) =>
        prev.some((comp) => comp._id === data._id) ? prev : [data, ...prev]
      );
    };

    const handleRecommendationUpdated = (data) => {
      setRecommendations((prev) => {
        const updatedRecommendations = (data?.recommendations ?? []).map(
          (rec) => {
            const existingRec = prev.find(
              (existing) => existing._id === rec._id
            );
            return existingRec ? { ...existingRec, ...rec } : rec;
          }
        );

        return [
          ...updatedRecommendations,
          ...prev.filter(
            (rec) => !updatedRecommendations.some((upd) => upd._id === rec._id)
          ),
        ];
      });
    };

    // Attach event listeners
    socket.on("exerciseCompleted", handleExerciseCompleted);
    socket.on("recommendationUpdated", handleRecommendationUpdated);

    return () => {
      //  Remove specific event handlers
      socket.off("exerciseCompleted", handleExerciseCompleted);
      socket.off("recommendationUpdated", handleRecommendationUpdated);
    };
  }, []);

  const toggleStatus = async (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );

    try {
      await updateUserStatus(userId, token);
      addNotification("User status updated successfully", "success");
    } catch (err) {
      console.error("Error updating user status:", err);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isActive: !user.isActive } : user
        )
      ); // Rollback if API fails
      setError("Failed to update user status. Please try again.");
    }
  };

  //  Notifications Handling
  const addNotification = (message, type) => {
    setNotifications((prev) => [...prev, { message, type }]);
    setNotificationCount((prev) => prev + 1);
  };

  const handleNotificationClick = () => {
    if (notifications.length > 0) {
      alert(notifications.map((n) => n.message).join("\n"));
      setNotifications([]); //  Clears notifications
      setNotificationCount(0); //  Ensures notification count resets properly
    } else {
      alert("No new notifications");
    }
  };

  const onRecommendClick = async (userId, exerciseId) => {
    console.log(" Debugging onRecommendClick");
    console.log(" User ID:", userId);
    console.log(" Exercise ID:", exerciseId);

    if (!exerciseId.match(/^[a-zA-Z0-9-_]+$/)) {
      console.error("🚨 Invalid exercise ID format:", exerciseId);
      alert("Invalid exercise selection. Please select a valid exercise.");
      return;
    }

    //  Retrieve token safely
    const headers = getAuthHeaders();
    if (!headers || !headers.Authorization) {
      console.error(" Missing or invalid token. Cannot proceed.");
      alert("Authentication issue. Please log in again.");
      return;
    }
    const token = headers.Authorization.split("Bearer ")[1];

    if (!userId || !exerciseId || !token) {
      console.error(" Missing userId, exerciseId, or token:", {
        userId,
        exerciseId,
        token,
      });
      alert("Invalid user, exercise selection, or authentication issue.");
      return;
    }

    //  Ensure exerciseId is a valid string
    const validExerciseId = String(exerciseId).trim();
    if (
      !validExerciseId ||
      validExerciseId === "undefined" ||
      validExerciseId === "null"
    ) {
      console.error(" Invalid exercise ID:", validExerciseId);
      alert("Invalid exercise selection.");
      return;
    }

    try {
      console.log(" Calling handleRecommendExercise with:", {
        userId,
        validExerciseId,
        token,
      });

      //  Call handleRecommendExercise
      const newRecommendation = await handleRecommendExercise(
        userId,
        validExerciseId,
        token
      );

      if (!newRecommendation || !newRecommendation.id) {
        console.error(" Error: No recommendation received from API.");
        return;
      }

      console.log(" New Recommendation:", newRecommendation);

      const formattedRecommendation = {
        ...newRecommendation,
        exerciseDetails: exercises.find((ex) => ex._id === validExerciseId) || {
          name: "Unknown Exercise",
        },
        userDetails: users.find((user) => user._id === userId) || {
          username: "Unknown User",
        },
      };

      //  Prevent adding duplicate recommendations
      setRecommendations((prev) => {
        if (prev.some((rec) => rec._id === newRecommendation._id)) return prev;
        return [...prev, formattedRecommendation];
      });

      addNotification(" Exercise recommended successfully!", "success");

      //  Emit WebSocket event to update recommendations in real-time
      socket.emit("recommendationUpdated", {
        userId: String(userId),
        recommendations: [formattedRecommendation],
      });
    } catch (error) {
      console.error(
        " Failed to recommend exercise:",
        error.response?.data || error.message
      );
      addNotification(
        " Failed to recommend exercise. Please try again.",
        "error"
      );
    }
  };

  const handleSaveRecommendation = async (recommendationId, updatedFields) => {
    if (!recommendationId || !updatedFields.exerciseId) {
      console.error("Invalid recommendation ID or exercise ID:", {
        recommendationId,
        updatedFields,
      });
      addNotification(
        "Invalid recommendation data. Please try again.",
        "error"
      );
      return;
    }

    try {
      const response = await handleUpdateRecommendation(
        recommendationId,
        updatedFields,
        getAuthHeaders()
      );

      if (!response || !response.data) {
        console.error("Error: No updated recommendation received from API.");
        addNotification(
          "Failed to update recommendation. Please try again.",
          "error"
        );
        return;
      }

      const updatedRecommendation = response.data;

      setRecommendations((prev) =>
        prev.map((rec) =>
          rec._id === recommendationId
            ? {
                ...rec,
                exerciseId: updatedRecommendation.exerciseId,
                notes: updatedRecommendation.notes,
                exerciseDetails:
                  exercises.find(
                    (ex) => ex._id === updatedRecommendation.exerciseId
                  ) || rec.exerciseDetails,
              }
            : rec
        )
      );

      addNotification("Recommendation updated successfully!", "success");

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

  const openEditModal = (data) => {
    console.log(" Opening Edit Modal for:", data);

    if (!data || !data.recommendationId) {
      console.error(" Invalid recommendation data:", data);
      alert("The selected recommendation is invalid and cannot be edited.");
      return;
    }

    setEditingRecommendation({
      id: data.recommendationId,
      currentExerciseId: data.exerciseId || "", // Fallback to an empty string
      notes: data.notes || "",
    });

    setIsModalOpen(true);
  };

  const onDeleteRecommendation = async (recommendationId, userId) => {
    try {
      await handleDeleteRecommendation(recommendationId, token);

      setRecommendations((prev) =>
        prev.filter((rec) => rec._id !== recommendationId)
      );

      addNotification("Recommendation deleted successfully!", "success");
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

  // Emit socket event when recommendations change
  useEffect(() => {
    socket.emit("recommendationUpdated", { recommendations });
  }, [recommendations]);

  const onDeleteCompletedWorkout = async (workoutId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workout?"
    );
    if (!confirmDelete) return;

    try {
      await handleDeleteCompletedWorkout(workoutId);

      setExerciseCompletions((prev) => {
        const updatedWorkouts = prev.filter((w) => w._id !== workoutId);

        // ✅ Emit event **after** UI update (Reduced delay for better UX)
        setTimeout(() => {
          socket.emit("workoutDeleted", workoutId);
        }, 50);

        return updatedWorkouts;
      });

      addNotification("Workout deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete workout:", error.message);
      addNotification("Failed to delete workout. Please try again.", "error");
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
              {(users ?? [])
                .filter((user) => user && user._id)
                .map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="py-4 px-6">{user.username || "Unknown"}</td>
                    <td className="py-4 px-6">{user.email || "No Email"}</td>
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
                    <td className="py-4 px-6">{user.level || "N/A"}</td>
                    <td className="py-4 px-6">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          const selectedExerciseId = e.target.value;
                          console.log(
                            "🔍 Selected Exercise ID:",
                            selectedExerciseId
                          ); // Debugging
                          if (!selectedExerciseId) return;
                          onRecommendClick(user._id, selectedExerciseId);
                        }}
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
              {Array.isArray(recommendations) && recommendations.length > 0 ? (
                recommendations.map((rec, index) => {
                  const user = users.find((user) => user?._id === rec.userId);
                  const exercise = rec.exerciseDetails || {
                    name: "Unknown Exercise",
                  };

                  return (
                    <tr
                      key={
                        rec._id || `${rec.userId}-${rec.exerciseId}-${index}`
                      }
                      className="border-b hover:bg-gray-100 transition"
                    >
                      <td className="py-4 px-6">
                        {user?.username || `User not found (ID: ${rec.userId})`}
                      </td>
                      <td className="py-4 px-6">{exercise.name}</td>
                      <td className="py-4 px-6">
                        {rec.notes || "No notes provided"}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => openEditModal(rec)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            onDeleteRecommendation(rec._id, rec.userId)
                          }
                          className="text-red-500 hover:underline ml-2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-600">
                    No recommendations found.
                  </td>
                </tr>
              )}
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
