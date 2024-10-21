import { useState, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const SearchField = ({ onSearchResults }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);

      if (query.trim()) {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://exercisedb.p.rapidapi.com/exercises/name/${query}`,
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
            onSearchResults(response.data);
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
    [query, onSearchResults]
  );

  const handleInputChange = (e) => {
    setQuery(e.target.value); // Simply update the query state
  };

  return (
    <div className="flex justify-center items-center mt-6">
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSearch} className="flex w-full md:w-1/2">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search exercises"
          className="border p-4 rounded-lg w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-4 rounded-lg ml-2"
          disabled={loading}
        >
          Search
        </button>
      </form>
    </div>
  );
};

SearchField.propTypes = {
  onSearchResults: PropTypes.func.isRequired,
};

export default SearchField;
