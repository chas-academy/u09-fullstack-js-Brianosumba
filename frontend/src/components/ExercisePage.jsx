import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";

const ExercisePage = () => {
  const { exerciseName } = useParams(); // exerciseName will be "biceps", "triceps", etc.
  const [exercises, setExercises] = useState({
    beginner: [],
    intermediate: [],
    advanced: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch exercises based on the category (exerciseName) and assign them to levels
  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError(null); // Reset error state before making a new request
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

        setExercises(response.data); // Store the raw data here for transformation later
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setError("Failed to load exercises. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [exerciseName]);

  // Memoized exercise levels to avoid recalculation on every render
  const categorizedExercises = useMemo(() => {
    const beginnerExercises = exercises.slice(0, 5); // First 5 as beginner
    const intermediateExercises = exercises.slice(5, 10); // Next 5 as intermediate
    const advancedExercises = exercises.slice(10, 15); // Next 5 as advanced

    return {
      beginner: beginnerExercises,
      intermediate: intermediateExercises,
      advanced: advancedExercises,
    };
  }, [exercises]);

  return (
    <div className="p-6">
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading exercises...</p>
      ) : (
        <div>
          {["beginner", "intermediate", "advanced"].map((level) => (
            <div key={level}>
              <h3 className="font-bold text-xl my-4">
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorizedExercises[level]?.map((exercise, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition"
                  >
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      className="h-40 w-full object-cover mb-4"
                    />
                    <p className="font-semibold text-center">{exercise.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExercisePage;
