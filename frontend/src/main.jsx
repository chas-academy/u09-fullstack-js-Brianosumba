import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import UserPage from "./pages/Userpage/UserPage";
import Exercise from "./pages/Exercisepage/Exercise";
import ExerciseDetailPage from "./pages/ExerciseDetailPage/ExerciseDetailPage";
import Login from "./pages/Loginpage/Login";
import Register from "./pages/Loginpage/Register";

// Define the router with your routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/userpage",
    element: <UserPage />,
  },
  {
    path: "/exercise/:exerciseName",
    element: <Exercise />, // This renders the Exercisepage
  },
  {
    path: "/exercise-detail/:exerciseName/:level", // Fixed path
    element: <ExerciseDetailPage />, // The detail page for the exercise level
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
