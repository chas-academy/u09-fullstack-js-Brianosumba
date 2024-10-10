import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import AdminCard from "../../components/Admincard";
import SearchField from "../../components/SearchField";
import { FaBell } from "react-icons/fa";
import { useState } from "react";

const usersData = [
  {
    id: 1,
    name: "John Doe",
    workoutType: "Pushups",
    target: "Chest",
    isActive: true,
    level: "Beginner",
  },
  {
    id: 2,
    name: "Jane Smith",
    workoutType: "Squats",
    target: "Legs",
    isActive: false,
    level: "Intermediate",
  },
  {
    id: 3,
    name: "Bob Johnson",
    workoutType: "Deadlift",
    target: "Backt",
    isActive: true,
    level: "Advanced",
  },
];

const Admin = () => {
  const [users, setUsers] = useState(usersData);

  const toggleStatus = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const recommendWorkout = (name) => {
    console.log(`Recommended workout for ${name}`);
  };

  const editWorkout = (name) => {
    console.log(`Edit workout for ${name}`);
  };

  const deleteWorkout = (userId) => {
    //Remove user from the list and confirmation before deletion
    if (
      window.confirm(`Are you sure you want to delete user width ID: ${userId}`)
    ) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      console.log(`Deleted workout for user with ID: ${userId}`);
    }
  };

  const topWorkoutsData = [
    { name: "Pushups", count: 5 },
    { name: "Squats", count: 10 },
    { name: "Deadlifts", count: 10 },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <NavBar />

      <div className="container mx-auto py-8 flex-grow">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          Welcome to Your Admin Dashboard
        </h1>

        {/* Center the search field and notification icon */}
        <div className="flex justify-center items-center mb-8 px-4">
          <div className="flex w-full md:w-3/4 lg:w-2/3 xl:w-1/2 items-center">
            {/* SearchField Component */}
            <SearchField />
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative text-gray-600 hover:text-gray-800 transition duration-300 ml-4"
          >
            <FaBell className="h-8 w-8 text-blue-600" />
            {/* Notification badge */}
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AdminCard
            title="Total Users"
            onClick={() => console.log("Show all users")}
          >
            <p className="text-2xl font-semibold text-blue-600">
              {users.length} users
            </p>
          </AdminCard>
          <AdminCard
            title="Active Users"
            onClick={() => console.log("Show active users")}
          >
            <p className="text-2xl font-semibold text-green-600">
              {users.filter((user) => user.isActive).length} active
            </p>
          </AdminCard>
          <AdminCard
            title="Top Workouts"
            onClick={() => console.log("Show top workouts")}
          >
            <p className="text-2xl font-semibold text-blue-400">
              {topWorkoutsData.length} workouts
            </p>
            <ul className="mt-2">
              {topWorkoutsData.map((workout, index) => (
                <li key={index} className="text-gray-600">
                  {workout.name} - {workout.count} times
                </li>
              ))}
            </ul>
          </AdminCard>
        </div>

        {/* Placeholder for the user table */}
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
                      onClick={() => toggleStatus(user.id)} // Add a function toggle status
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
                      onClick={() => recommendWorkout(user.name)}
                      className="text-green-500 transition-all duration-500 ease-in-out transform hover:scale-110 hover:opacity-80 hover:shadow-lg"
                    >
                      Recommend
                    </button>
                    <button
                      onClick={() => editWorkout(user.name)}
                      className="text-blue-500 transition-all duration-500 ease-in-out transform hover:scale-110 hover:opacity-80 hover:shadow-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteWorkout(user.id)}
                      className="text-red-500 transition-all duration-500 ease-in-out transform hover:scale-110 hover:opacity-80 hover:shadow-lg"
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
