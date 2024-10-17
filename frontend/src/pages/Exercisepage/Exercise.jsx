import { useParams } from "react-router-dom";
import Exercisepage from "../../components/ExercisePage";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import useAuthStore from "../Store/store";

const Exercise = () => {
  // Use the useParams hook to get the dynamic exerciseName from the URL
  const { exerciseName } = useParams();

  const { isAuthenticated, logout } = useAuthStore();

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar isAuthenticated={isAuthenticated} logout={logout} />
      {/* Pass exerciseName as a prop to the Exercisepage component */}
      <Exercisepage exerciseName={exerciseName} />
      <Footer />
    </div>
  );
};

export default Exercise;
