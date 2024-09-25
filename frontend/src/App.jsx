import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage/HomePage";
import Footer from "./components/Footer";
import ExercisePage from "./components/ExercisePage";
import ExerciseDetailPage from "./pages/Exercisedetailpage/ExerciseDetailPage";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exercises" element={<ExercisePage />} />
          <Route
            path="/exercise-detail/:level"
            element={<ExerciseDetailPage />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
