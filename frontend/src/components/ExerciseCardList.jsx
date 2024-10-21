import { useState } from "react";
import PropTypes from "prop-types";
import ExerciseCards from "./ExerciseCards";

const ExerciseCardList = ({ exercises }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate how many cards to show per scroll
  const cardsPerView = 8;

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

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Show all</h2>
        <div className="space-x-2">
          <button onClick={handlePrev} disabled={currentIndex === 0}>
            &lt; Prev
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= exercises.length - cardsPerView}
          >
            Next &gt;
          </button>
        </div>
      </div>

      {/* Card Scrolling Area */}
      <div className="flex space-x-4 overflow-x-hidden">
        {exercises
          .slice(currentIndex, currentIndex + cardsPerView)
          .map((exercise, index) => (
            <ExerciseCards
              key={index}
              title={exercise.name} // Ensure the exercise name is used
              gifUrl={exercise.gifUrl} // Ensure the exercise GIF URL is used
            />
          ))}
      </div>
    </div>
  );
};

// PropTypes validation for ExerciseCardList
ExerciseCardList.propTypes = {
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      gifUrl: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ExerciseCardList;
