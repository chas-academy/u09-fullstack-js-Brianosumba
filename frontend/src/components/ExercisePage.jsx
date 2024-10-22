import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Exercisepage = ({ exerciseName }) => {
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

        console.log("fetched exercises:", response.data);

        const allExercises = response.data;

        // Manually categorize exercises by difficulty
        const beginnerExercises = allExercises.filter(
          (exercise) =>
            exercise.intensity === "low" || exercise.level === "beginner"
        );
        const intermediateExercises = allExercises.filter(
          (exercise) =>
            exercise.intensity === "medium" || exercise.level === "intermediate"
        );
        const advancedExercises = allExercises.filter(
          (exercise) =>
            exercise.intensity === "high" || exercise.level === "advanced"
        );

        setExercises({
          beginner: beginnerExercises,
          intermediate: intermediateExercises,
          advanced: advancedExercises,
        });
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    };

    fetchExercises();
  }, [exerciseName]);

  // Handle when a user clicks on an exercise to see details
  const handleExerciseClick = (exerciseId, level) => {
    navigate(`/exercise-detail/${exerciseId}/${level}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 capitalize">
        {exerciseName} Exercises
      </h1>

      <div>
        <h2 className="text-2xl font-bold mt-6">Beginner</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {exercises.beginner.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-blue-100 p-4 rounded-lg cursor-pointer"
              onClick={() => handleExerciseClick(exercise.id, "beginner")}
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

        <h2 className="text-2xl font-bold mt-6">Intermediate</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {exercises.intermediate.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-yellow-100 p-4 rounded-lg cursor-pointer"
              onClick={() => handleExerciseClick(exercise.id, "intermediate")}
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

        <h2 className="text-2xl font-bold mt-6">Advanced</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {exercises.advanced.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-red-100 p-4 rounded-lg cursor-pointer"
              onClick={() => handleExerciseClick(exercise.id, "advanced")}
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
      </div>
    </div>
  );
};

// Define prop types for the Exercisepage component
Exercisepage.propTypes = {
  exerciseName: PropTypes.string.isRequired, // Specify that exerciseName is a required string
};

export default Exercisepage;
