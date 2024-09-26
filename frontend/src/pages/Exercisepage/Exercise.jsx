import { useParams } from "react-router-dom";
import Exercisepage from "../../components/ExercisePage";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";

const Exercise = () => {
  // Use the useParams hook to get the dynamic exerciseName from the URL
  const { exerciseName } = useParams();

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      {/* Pass exerciseName as a prop to the Exercisepage component */}
      <Exercisepage exerciseName={exerciseName} />
      <Footer />
    </div>
  );
};

export default Exercise;
