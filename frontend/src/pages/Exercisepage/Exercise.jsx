import { useParams } from "react-router-dom";
import Exercisepage from "../../components/ExercisePage";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import PropTypes from "prop-types";

const Exercise = ({ isAuthenticated, setIsAuthenticated }) => {
  // Use the useParams hook to get the dynamic exerciseName from the URL
  const { exerciseName } = useParams();

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      {/* Pass exerciseName as a prop to the Exercisepage component */}
      <Exercisepage exerciseName={exerciseName} />
      <Footer />
    </div>
  );
};

Exercise.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired, // isAuthenticated should be a required boolean
  setIsAuthenticated: PropTypes.func.isRequired, // handleLogout should be a required function
};

export default Exercise;
