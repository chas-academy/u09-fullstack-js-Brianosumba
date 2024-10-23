import NavBar from "../../components/NavBar";
import Footer from "../../components/footer";
import AdminCard from "../../components/AdminCard";
import { FaBell } from "react-icons/fa";
import { useState, useEffect } from "react";
import useAuthStore from "../Store/store";
import axios from "axios"; // To make API calls

const Admin = () => {
  const [users, setUsers] = useState([]); // State for users
  const [topWorkouts, setTopWorkouts] = useState([]); // State for top workouts
  const [notifications, setNotifications] = useState([]); // Notifications state
  const [notificationCount, setNotificationCount] = useState(0); // Notification badge count
  const { isAuthenticated, logout } = useAuthStore();

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users"); // Assuming an API endpoint exists
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch top workouts from the backend
  useEffect(() => {
    const fetchTopWorkouts = async () => {
      try {
        const res = await axios.get("/api/workouts/top"); // Assuming an API endpoint for top workouts
        setTopWorkouts(res.data);
      } catch (error) {
        console.error("Error fetching top workouts", error);
      }
    };
    fetchTopWorkouts();
  }, []);

  // Toggle user active status
  const toggleStatus = async (userId) => {
    try {
      const updatedUser = await axios.patch(`/api/users/${userId}/status`); // Update status
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, isActive: updatedUser.data.isActive } // Make sure to access the correct property
            : user
        )
      );

      // Add notification
      const statusMessage = updatedUser.data.isActive
        ? `${updatedUser.data.name} is on fire!`
        : `${updatedUser.data.name} has been set to inactive.`;
      addNotification(statusMessage, "status");
    } catch (error) {
      console.error("Error updating user status", error);
    }
  };

  // Add a notification message
  const addNotification = (message, type) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { message, type },
    ]);
    setNotificationCount((prevCount) => prevCount + 1);
  };

  // Handle notification click to show all
  const handleNotificationClick = () => {
    if (notifications.length > 0) {
      alert(notifications.map((n) => n.message).join("\n"));
      setNotifications([]); // Clear notifications
      setNotificationCount(0); // Reset count
    } else {
      alert("No new notifications");
    }
  };

  // Admin CRUD operations
  const recommendWorkout = async (userId) => {
    try {
      await axios.post(`/api/users/${userId}/recommend`); // Send recommendation
      addNotification(
        `Recommended a workout for user ID: ${userId}`,
        "recommendation"
      );
    } catch (error) {
      console.error("Error recommending workout", error);
    }
  };

  const editWorkout = (userId) => {
    console.log(`Edit workout for user ID: ${userId}`);
    // Add logic for editing workout via API if necessary
  };

  const deleteWorkout = async (userId) => {
    if (
      window.confirm(`Are you sure you want to delete user with ID: ${userId}?`)
    ) {
      try {
        await axios.delete(`/api/users/${userId}`); // Delete user
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        addNotification(`Deleted user ${userId}`, "deletion");
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <NavBar isAuthenticated={isAuthenticated} logout={logout} />

      <div className="container mx-auto py-8 flex-grow">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          Welcome to Your Admin Dashboard
        </h1>

        {/* Search and Notification Icon */}
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

        {/* Admin Cards */}
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
            <p className="text-2xl font-semibold text-blue-600">
              {topWorkouts.length} workouts
            </p>
            <ul className="mt-2">
              {topWorkouts.map((workout, index) => (
                <li key={index} className="text-gray-600">
                  {workout.name} - {workout.count} times
                </li>
              ))}
            </ul>
          </AdminCard>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-4 px-6 text-left">Name</th>
                <th className="py-4 px-6 text-left">Workout Type</th>
                <th className="py-4 px-6 text-left">Target</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Level</th>
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="border-b border-gray-300 p-4">{user.name}</td>
                  <td className="border-b border-gray-300 p-4">
                    {user.workoutType}
                  </td>
                  <td className="border-b border-gray-300 p-4">
                    {user.target}
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
                  <td className="border-b border-gray-300 p-4">{user.level}</td>
                  <td className="border-b border-gray-300 p-4 flex space-x-2">
                    <button
                      onClick={() => recommendWorkout(user.id)}
                      className="text-green-500 transition-all duration-500 ease-in-out transform hover:scale-110"
                    >
                      Recommend
                    </button>
                    <button
                      onClick={() => editWorkout(user.id)}
                      className="text-blue-500 transition-all duration-500 ease-in-out transform hover:scale-110"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteWorkout(user.id)}
                      className="text-red-500 transition-all duration-500 ease-in-out transform hover:scale-110"
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

      <Footer />
    </div>
  );
};

export default Admin;
