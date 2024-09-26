import { GiWeightLiftingUp } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ExerciseCards = ({ title }) => {
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
      </div>
    </div>
  );
};

ExerciseCards.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ExerciseCards;
