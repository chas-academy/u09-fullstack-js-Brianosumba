import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const SearchField = ({ onSearchResults }) => {
  const [query, setQuery] = useState(""); // stores the user's input
  const [loading, setLoading] = useState(false); // loading state
  const [error, setError] = useState(null); // error state

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    if (query.trim()) {
      setLoading(true); // Start loading
      try {
        // Fetch Exercises from ExerciseDB API
        const response = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/name/${query}`, // Search by exercise name
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY, // Use your RapidAPI key
              "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
          }
        );
        // Pass the data to the parent component
        onSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setError("Failed to fetch exercises. Please try again.");
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  return (
    <div className="flex justify-center items-center mt-6">
      {error && <p className="text-red-500">{error}</p>} {/* Error message */}
      {loading && <p>Loading...</p>} {/* Loading indicator */}
      <form onSubmit={handleSearch} className="flex w-full md:w-1/2">
        <label htmlFor="exerciseSearch" className="sr-only">
          Search Exercises
        </label>
        <input
          id="exerciseSearch"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exercises"
          className="border border-gray-400 p-4 rounded-lg w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 hover:shadow-lg transition duration-300 text-black font-semibold p-4 rounded-lg ml-2"
        >
          Search
        </button>
      </form>
    </div>
  );
};

// Define PropTypes for SearchField
SearchField.propTypes = {
  onSearchResults: PropTypes.func.isRequired, // 'onSearchResults' is a required function
};

export default SearchField;
