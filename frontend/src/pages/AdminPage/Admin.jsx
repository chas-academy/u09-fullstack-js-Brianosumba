import NavBar from "../../components/NavBar";
import Footer from "../../components/footer";
import AdminCard from "../../components/AdminCard";
import { FaBell } from "react-icons/fa";
import { useState, useEffect } from "react";
import { editExercise, deleteExercise } from "../../services/exerciseService";
import {
  fetchUsers,
  recommendWorkout,
  updateUserStatus,
} from "../../services/userService";
import io from "socket.io-client";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [error, setError] = useState(null);
  const [exerciseCompletions, setExerciseCompletions] = useState([]); // New state for exercise completions

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        console.log("Fetched users", usersData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      }
    };
    loadUsers();

    // Set up Socket.IO connection
    const socket = io("http://localhost:3000", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("joinAdminRoom"); // Join the 'admins' room
    });

    socket.on("exerciseCompleted", (data) => {
      console.log("Received exercise completion:", data);
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
    } catch (error) {
      console.error("Error updating user status:", error);
      setError("Failed to update user status. Please try again.");
    }
  };

  const handleRecommend = async (userId) => {
    const workoutId = prompt("Enter the workout ID to recommend:");
    const notes = prompt("Add any notes:");
    if (workoutId) {
      try {
        await recommendWorkout({ userId, workoutId, notes });
        alert("Workout recommended successfully");
      } catch (error) {
        console.error("Error recommending workout:", error);
        setError("Failed to recommend workout. Please try again.");
      }
    }
  };

  const handleEdit = async (exerciseId) => {
    const updatedFields = prompt("Enter updated field values in JSON format:");
    try {
      await editExercise({
        exerciseId,
        updatedFields: JSON.parse(updatedFields),
      });
      alert("Workout edited successfully");
    } catch (error) {
      console.error("Error editing workout:", error);
      setError("Failed to edit workout. Please try again.");
    }
  };

  const handleDelete = async (exerciseId) => {
    try {
      await deleteExercise(exerciseId);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== exerciseId)
      );
      addNotification("Workout deleted successfully", "danger");
    } catch (error) {
      console.error("Error deleting workout:", error);
      setError("Failed to delete workout. Please try again.");
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

  return (
    <>
      <div className="min-h-screen flex flex-col justify-between bg-gray-100">
        <NavBar />
        <div className="container mx-auto py-8 flex-grow">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
            Welcome to Your Admin Dashboard
          </h1>

          {error && <p className="text-red-500 text-center">{error}</p>}

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <AdminCard title="Top Workouts">
              <p className="text-2xl font-semibold text-blue-600">3 workouts</p>
            </AdminCard>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full border border-gray-300 text-black">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-4 px-6 text-left">Name</th>
                  <th className="py-4 px-6 text-left">Email</th>
                  <th className="py-4 px-6 text-left">Target</th>
                  <th className="py-4 px-6 text-left">Status</th>
                  <th className="py-4 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="border-b border-gray-300 p-4">
                      {user.username}
                    </td>
                    <td className="border-b border-gray-300 p-4">
                      {user.email}
                    </td>
                    <td className="border-b border-gray-300 p-4">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`py-1 px-2 rounded text-white ${
                          user.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="border-b border-gray-300 p-4">
                      {user.level}
                    </td>
                    <td className="border-b border-gray-300 p-4 flex space-x-2">
                      <button
                        onClick={() => handleRecommend(user.id)}
                        className="text-green-500"
                      >
                        Recommend
                      </button>
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Exercise Completions table*/}
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
        <Footer />
      </div>
    </>
  );
};

export default Admin;
