import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

const Exercisepage = () => {
  const { exerciseName } = useParams(); // Get the exerciseName from URL parameters
  const [exercises, setExercises] = useState({
    beginner: [],
    intermediate: [],
    advanced: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${exerciseName}`,
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
              "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
          }
        );

        console.log(response.data);

        const allExercises = response.data;

        if (Array.isArray(allExercises)) {
          const beginnerExercises = allExercises.filter(
            (exercise) => exercise.level === "beginner"
          );
          const intermediateExercises = allExercises.filter(
            (exercise) => exercise.level === "intermediate"
          );
          const advancedExercises = allExercises.filter(
            (exercise) => exercise.level === "advanced"
          );

          setExercises({
            beginner: beginnerExercises,
            intermediate: intermediateExercises,
            advanced: advancedExercises,
          });
        } else {
          console.error("Unexpected data structure:", allExercises);
        }
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    };

    fetchExercises();
  }, [exerciseName]);

  const handleExerciseClick = (exerciseId, level) => {
    navigate(`/exercise-detail/${exerciseId}/${level}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 capitalize">
        {exerciseName} Exercises
      </h1>

      {/* Render the exercises by level */}
      {["beginner", "intermediate", "advanced"].map((level) => (
        <div key={level}>
          {" "}
          {/* Replaced fragment with a div and added key here */}
          <h2 className="text-2xl font-bold mt-6">
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {exercises[level].map((exercise) => (
              <div
                key={exercise.id} // Ensure each exercise has a unique key
                className={`bg-${
                  level === "beginner"
                    ? "blue"
                    : level === "intermediate"
                    ? "yellow"
                    : "red"
                }-100 p-4 rounded-lg cursor-pointer`}
                onClick={() => handleExerciseClick(exercise.id, level)}
              >
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  className="w-full h-40 object-cover"
                />
                <p className="text-lg font-bold">{exercise.name}</p>
              </div>
            ))}
          </div>
        </div> // Closing div for the level section
      ))}
    </div>
  );
};

// Define prop types for the Exercisepage component
Exercisepage.propTypes = {
  exerciseName: PropTypes.string.isRequired,
};

export default Exercisepage;
