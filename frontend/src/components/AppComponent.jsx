import NavBar from "./NavBar";
import HomePage from "../pages/Homepage/HomePage";
import Footer from "./Footer";
import PropTypes from "prop-types";

const AppComponent = ({ isAuthenticated, setIsAuthenticated }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <HomePage />
      <Footer />
    </div>
  );
};

AppComponent.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired, // isAuthenticated should be a required boolean
  setIsAuthenticated: PropTypes.func.isRequired, // handleLogout should be a required function
};
export default AppComponent;
