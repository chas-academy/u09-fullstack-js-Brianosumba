import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import "./index.css";
import AppComponent from "./components/AppComponent";
import UserPage from "./pages/Userpage/UserPage";
import Exercise from "./pages/Exercisepage/Exercise";
import ExerciseDetail from "./components/ExerciseDetail";
import Login from "./pages/Loginpage/Login";
import Register from "./pages/Loginpage/Register";
import Admin from "./pages/AdminPage/Admin";
import useAuthStore from "./pages/Store/store";
//teest

const App = () => {
  const { checkAuth } = useAuthStore(); // check if the user is already authenticated

  useEffect(() => {
    checkAuth(); // check for token in local storage on mount
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <div className="bg-gray-800 text-white">
        <Routes>
          <Route path="/" element={<AppComponent />} />

          <Route path="userpage" element={<UserPage />} />
          <Route path="exercise/:bodyPartName" element={<Exercise />} />
          <Route
            path="exercise-detail/:exerciseId"
            element={<ExerciseDetail />}
          />
          <Route path="admin" element={<Admin />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

// // Define the router with your routes
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//   },
//   {
//     path: "/login",
//     element: <Login />,
//   },
//   {
//     path: "/register",
//     element: <Register />,
//   },
//   {
//     path: "/userpage",
//     element: <UserPage />,
//   },
//   {
//     path: "/exercise/:exerciseName",
//     element: <Exercise />, // This renders the Exercisepage
//   },
//   {
//     path: "/exercise-detail/:exerciseName/:level", // Fixed path
//     element: <ExerciseDetailPage />, // The detail page for the exercise level
//   },
//   {
//     path: "/admin",
//     element: <Admin />,
//   },
// ]);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <RouterProvider router={router} />
// );
