import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./index.css";
import AppComponent from "./components/AppComponent";
import UserPage from "./pages/Userpage/UserPage";
import Exercise from "./pages/Exercisepage/Exercise";
import ExerciseDetailPage from "./pages/ExerciseDetailPage/ExerciseDetailPage";
import Login from "./pages/Loginpage/Login";
import Register from "./pages/Loginpage/Register";
import Admin from "./pages/AdminPage/Admin";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppComponent
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />

        <Route
          path="userpage"
          element={
            <UserPage
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        <Route
          path="exercise/:exerciseName"
          element={
            <Exercise
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        <Route
          path="exercise-detail/:exerciseName/:level"
          element={<ExerciseDetailPage />}
        />
        <Route
          path="admin"
          element={
            <Admin
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />

        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/register" element={<Register />} />
      </Routes>
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
