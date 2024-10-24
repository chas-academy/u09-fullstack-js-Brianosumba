import { useState, useEffect, useMemo } from "react";
import { ExerciseCard } from "./ExcerciseCard";
import PropTypes from "prop-types";

const ExerciseCardList = ({ exercises }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(4);

  // Update cardsPerPage based on the screen size
  const updateCardsPerPage = () => {
    if (window.innerWidth < 640) {
      setCardsPerPage(1);
    } else if (window.innerWidth < 1024) {
      setCardsPerPage(2);
    } else {
      setCardsPerPage(4);
    }
  };

  useEffect(() => {
    // Initial check for screen size
    updateCardsPerPage();

    // Update cardsPerPage on window resize
    window.addEventListener("resize", updateCardsPerPage);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", updateCardsPerPage);
    };
  }, []);

  // Calculate the total number of pages
  const totalPages = Math.ceil(exercises.length / cardsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Memoize the displayed exercises to prevent unnecessary re-renders
  const displayedExercises = useMemo(() => {
    const start = currentPage * cardsPerPage;
    return exercises.slice(start, start + cardsPerPage);
  }, [currentPage, cardsPerPage, exercises]);

  return (
    <div className="container container-md mx-auto py-4">
      {/* Update the card layout to use larger cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            id={exercise.id}
            name={exercise.name}
            gifUrl={exercise.gifUrl}
          />
        ))}
      </div>

      {/* Pagination buttons */}
      <div className="max-w-sm mx-auto">
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            className="bg-gray-300 rounded-full p-2 hover:bg-gray-400 transition-colors"
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            className="bg-gray-300 rounded-full p-2 hover:bg-gray-400 transition-colors"
            disabled={currentPage >= totalPages - 1}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

ExerciseCardList.propTypes = {
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Ensure id is a required string
      gifUrl: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ExerciseCardList;
