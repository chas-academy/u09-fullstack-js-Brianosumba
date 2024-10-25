import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const ExerciseCard = ({ id, gifUrl, name, target }) => {
  return (
    <Link to={`/exercise-detail/${id}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 text-black cursor-pointer">
        <img
          src={gifUrl}
          alt={name}
          className="w-full h-60 object-cover rounded-md"
        />
        <div className="flex flex-col gap-2">
          <p className="text-center mt-4 text-lg font-semibold capitalize">
            {name}
          </p>
          {target && (
            <p className="text-center text-lg font-semibold capitalize">
              {target}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

ExerciseCard.propTypes = {
  id: PropTypes.string.isRequired,
  gifUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  target: PropTypes.string,
};
