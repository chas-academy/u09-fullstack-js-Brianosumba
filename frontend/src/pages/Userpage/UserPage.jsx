import NavBar from "../../components/NavBar";
import SearchField from "../../components/SearchField";
import HeroBannerCarousel from "../../components/HeroBannerCarousel";
import ExerciseCardList from "../../components/ExerciseCardList";
import Footer from "../../components/Footer";
import PropTypes from "prop-types";

const UserPage = ({ isAuthenticated, setIsAuthenticated }) => {
  return (
    <>
      <div className="bg-gray-300 min-h-screen">
        <NavBar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <HeroBannerCarousel />
        <SearchField />
        <ExerciseCardList />
        <Footer />
      </div>
    </>
  );
};

UserPage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired, // isAuthenticated should be a required boolean
  setIsAuthenticated: PropTypes.func.isRequired, // handleLogout should be a required function
};

export default UserPage;
