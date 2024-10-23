import { useState } from "react";
import NavBar from "../../components/NavBar";
import SearchField from "../../components/SearchField";
import HeroBannerCarousel from "../../components/HeroBannerCarousel";
import ExerciseCardList from "../../components/ExerciseCardList";
import Footer from "../../components/footer";
import ExerciseCategories from "../../components/ExerciseCategories"; // Import the ExerciseCategories component
import useAuthStore from "../Store/store";

const UserPage = () => {
  // Access Zustand store state
  const { isAuthenticated, logout } = useAuthStore();

  // State for holding search results from the ExerciseDB API
  const [searchedExercises, setSearchedExercises] = useState([]);

  const handleSearchResults = (results) => {
    setSearchedExercises(results);
  };

  return (
    <div className="bg-gray-300 min-h-screen">
      {/* Navbar with authentication props */}
      <NavBar isAuthenticated={isAuthenticated} logout={logout} />

      {/* Hero Carousel Banner */}
      <HeroBannerCarousel />

      {/* SearchField component with onSearchResults to handle search results */}
      <SearchField onSearchResults={handleSearchResults} />

      {/* Render Exercise Categories */}
      <ExerciseCategories />

      {/* Conditionally render ExerciseCardList if searchResults exist */}
      {searchedExercises.length > 0 && (
        <ExerciseCardList exercises={searchedExercises} />
      )}

      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default UserPage;
