import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

const ExerciseCardList = ({ exercises }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);

  // Update cardsPerView based on the screen size
  const updateCardsPerView = () => {
    if (window.innerWidth < 640) {
      setCardsPerView(1);
    } else if (window.innerWidth < 1024) {
      setCardsPerView(2);
    } else {
      setCardsPerView(4);
    }
  };

  useEffect(() => {
    // Initial check for screen size
    updateCardsPerView();

    // Update cardsPerView on window resize
    window.addEventListener("resize", updateCardsPerView);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", updateCardsPerView);
    };
  }, []);

  const handleNext = () => {
    if (currentIndex < exercises.length - cardsPerView) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Memoize the displayed exercises to prevent unnecessary re-renders
  const displayedExercises = useMemo(() => {
    return exercises.slice(currentIndex, currentIndex + cardsPerView);
  }, [currentIndex, cardsPerView, exercises]);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedExercises.map((exercise) => (
          <div
            key={exercise.id} // Ensure each exercise has a unique 'id'
            className="bg-white p-4 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <p className="text-center mt-2 font-semibold">{exercise.name}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 rounded-full p-2 hover:bg-gray-400 transition-colors"
        disabled={currentIndex === 0}
        aria-label="Previous"
      >
        ◀
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 rounded-full p-2 hover:bg-gray-400 transition-colors"
        disabled={currentIndex >= exercises.length - cardsPerView}
        aria-label="Next"
      >
        ▶
      </button>
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
