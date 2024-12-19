import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import AdminCard from "../../components/AdminCard";
import { FaBell } from "react-icons/fa";
import io from "socket.io-client";
import {
  getExercises,
  handleRecommendExercise,
  handleUpdateRecommendation,
  handleDeleteRecommendation,
} from "./ExerciseCrud";
import { fetchUsers, updateUserStatus } from "../../services/userService";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [exerciseCompletions, setExerciseCompletions] = useState([]);
  const [error, setError] = useState(null);

  // Fetch users and exercises
  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await fetchUsers();
        console.log("Fetched users:", usersData);
        setUsers(usersData || []);

        await getExercises(setExercises);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again later.");
      }
    };

    loadData();
  }, []);

  // Setup Socket.IO
  useEffect(() => {
    const socket = io("http://localhost:3000", { withCredentials: true });

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("joinAdminRoom");
    });

    socket.on("exerciseCompleted", (data) => {
      setExerciseCompletions((prev) => [...prev, data]);
      addNotification(`${data.username} completed an exercise`, "info");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleStatus = async (userId) => {
    try {
      await updateUserStatus(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );
      addNotification("User status updated", "info");
    } catch (err) {
      setError("Failed to update user status.");
    }
  };

  const addNotification = (message, type) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { message, type },
    ]);
    setNotificationCount((prevCount) => prevCount + 1);
  };

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
      console.error("Invalid parameters. userId or exerciseId is missing");
      alert("Please provide valid user and exercise details.");
      return;
    }

    try {
      await handleRecommendExercise(userId, exerciseId);
      addNotification("Exercise recommended successfully!", "success");
    } catch (error) {
      console.error("Failed to recommend exercise:", error);
      addNotification(
        "Failed to recommend exercise. Please try again.",
        "error"
      );
    }
  };

  const onEditRecommendation = async (exerciseId, updatedFields) => {
    try {
      await handleUpdateRecommendation(
        recommendationId,
        updatedFields,
        setExercises
      );
      addNotification("Exercise recommendation updated!", "success");
    } catch (error) {
      console.error("Failed to edit exercise recommendation:", error);
      addNotification(
        "Failed to edit recommendation. Please try again.",
        "error"
      );
    }
  };

  const onDeleteRecommendation = async (recommendationId) => {
    try {
      await handleDeleteRecommendation(recommendationId, setExercises);
      addNotification("Exercise recommendation deleted!", "success");
    } catch (error) {
      console.error("Failed to delete recommendation:", error);
      addNotification(
        "Failed to delete recommendation. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <NavBar />
      <div className="container mx-auto py-8 flex-grow">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          Welcome to Your Admin Dashboard
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Notifications Button */}
        <div className="flex justify-center items-center mb-8 px-4">
          <button
            type="button"
            aria-label="Notifications"
            className="relative text-gray-600 hover:text-gray-800 transition duration-300 ml-4"
            onClick={handleNotificationClick}
          >
            <FaBell className="h-8 w-8 text-blue-600 hover:text-goldenrod transition duration-300 ease-in-out transform hover:scale-110" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AdminCard title="Total Users">
            <p className="text-2xl font-semibold text-red-600">
              {users.length} users
            </p>
          </AdminCard>
          <AdminCard title="Active Users">
            <p className="text-2xl font-semibold text-green-600">
              {users.filter((user) => user.isActive).length} active
            </p>
          </AdminCard>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full border border-gray-300 text-black">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-4 px-6 text-left">Name</th>
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Level</th>
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id || `user-${index}`}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`py-1 px-2 rounded text-white ${
                        user.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>{user.level}</td>
                  <td>
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        const exerciseId = e.target.value;
                        if (exerciseId) onRecommendClick(user.id, exerciseId);
                      }}
                      className="p-1 rounded border"
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
                    <button
                      onClick={() =>
                        onEditRecommendation(user.recommendationId, {
                          notes: "Updated recommendation notes",
                        })
                      }
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        onDeleteRecommendation(user.recommendationId)
                      }
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Recent Exercise Completions Table */}
          <h2 className="text-2xl font-bold mt-8 mb-4">
            Recent Exercise Completions
          </h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full border border-gray-300 text-black">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-4 px-6 text-left">Username</th>
                  <th className="py-4 px-6 text-left">Workout Type</th>
                  <th className="py-4 px-6 text-left">Target</th>
                  <th className="py-4 px-6 text-left">Level</th>
                  <th className="py-4 px-6 text-left">Completed At</th>
                </tr>
              </thead>
              <tbody>
                {exerciseCompletions.map((completion, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="border-b border-gray-300 p-4">
                      {completion.username}
                    </td>
                    <td className="border-b border-gray-300 p-4">
                      {completion.workoutType}
                    </td>
                    <td className="border-b border-gray-300 p-4">
                      {completion.target}
                    </td>
                    <td className="border-b border-gray-300 p-4">
                      {completion.level}
                    </td>
                    <td className="border-b border-gray-300 p-4">
                      {new Date(completion.completedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
