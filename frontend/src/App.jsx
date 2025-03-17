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
