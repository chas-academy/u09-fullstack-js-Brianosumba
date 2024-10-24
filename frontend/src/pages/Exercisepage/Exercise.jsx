import Exercisepage from "../../components/ExercisePage";
import Footer from "../../components/footer";
import NavBar from "../../components/NavBar";
import useAuthStore from "../Store/store";

const Exercise = () => {
  // Use the useParams hook to get the dynamic exerciseName from the URL

  const { isAuthenticated, logout } = useAuthStore();

  return (
    <div className="min-h-screen">
      <NavBar isAuthenticated={isAuthenticated} logout={logout} />
      {/* Pass exerciseName as a prop to the Exercisepage component */}
      <Exercisepage />
      <Footer />
    </div>
  );
};

export default Exercise;
