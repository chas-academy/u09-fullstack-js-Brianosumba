import { GiWeightLiftingUp } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ExerciseCards = ({ title, gifUrl }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the exercise page with the exercise title
    navigate(`/exercise/${title.toLowerCase()}`);
  };

  return (
    <div
      className="bg-gray-400 border border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition duration-300 hover:scale-105 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center justify-center mb-2">
        <GiWeightLiftingUp className="text-4xl text-gray-700" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">{title}</p>
        {gifUrl && (
          <img
            src={gifUrl}
            alt={title}
            className="mt-2 w-full h-auto rounded-md"
          />
        )}{" "}
        {/* Display GIF */}
      </div>
    </div>
  );
};

ExerciseCards.propTypes = {
  title: PropTypes.string.isRequired,
  gifUrl: PropTypes.string.isRequired, // Add gifUrl prop validation
};

export default ExerciseCards;
