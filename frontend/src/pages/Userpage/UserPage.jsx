import { useState, useCallback, useEffect } from "react";
import NavBar from "../../components/NavBar";
import SearchField from "../../components/SearchField";
import HeroBannerCarousel from "../../components/HeroBannerCarousel";
import ExerciseCardList from "../../components/ExerciseCardList";
import Footer from "../../components/Footer";
import ExerciseCategories from "../../components/ExerciseCategories"; // Import the ExerciseCategories component
import useAuthStore from "../Store/store";

import axios from "axios";
import { useSearchParams } from "react-router-dom";
const UserPage = () => {
  // Access Zustand store state
  const { isAuthenticated, logout } = useAuthStore();

  // State for holding search results from the ExerciseDB API
  const [searchedExercises, setSearchedExercises] = useState();

  let [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageLoad, setPageload] = useState(false);

  const handleSearch = useCallback(
    async (e) => {
      e?.preventDefault();
      setError(null);

      // Only proceed if query exists and is not null
      if (query && query.trim()) {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://exercisedb.p.rapidapi.com/exercises/name/${query.toLowerCase()}`,
            {
              headers: {
                "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
                "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
              },
            }
          );

          if (response.data.length === 0) {
            setError("No exercises found. Try a different search.");
          } else {
            setSearchedExercises(response.data);
          }
        } catch (error) {
          console.error("Error fetching exercises:", error);
          setError(
            "Failed to fetch exercises. Please check your connection and try again."
          );
        } finally {
          setLoading(false);
        }
      }
    },
    [query, setSearchedExercises]
  );

  useEffect(() => {
    setPageload(true);
    if (pageLoad && !searchedExercises) {
      handleSearch();
    }
  }, [searchedExercises, handleSearch, pageLoad]);
  return (
    <div className="  min-h-screen">
      {/* Navbar with authentication props */}
      <NavBar isAuthenticated={isAuthenticated} logout={logout} />

      {/* Hero Carousel Banner */}
      <HeroBannerCarousel />

      {/* SearchField component with onSearchResults to handle search results */}
      <form onSubmit={handleSearch}>
        <SearchField
          query={query}
          setQuery={setSearchParams}
          loading={loading}
          error={error}
        />
      </form>

      {/* Render Exercise Categories */}
      <ExerciseCategories />

      {/* Conditionally render ExerciseCardList if searchResults exist */}
      {searchedExercises && searchedExercises.length > 0 && (
        <ExerciseCardList exercises={searchedExercises} />
      )}

      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default UserPage;
