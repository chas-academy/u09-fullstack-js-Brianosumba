import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ExerciseCard } from "./ExcerciseCard";
const Exercisepage = () => {
  const { bodyPartName } = useParams(); // Get the exerciseName from URL parameters
  const [exercises, setExercises] = useState([]); // State to hold exercises

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPartName}`,
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
              "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
          }
        );
        setExercises(response.data); // Set the exercises for the selected body part
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    };

    fetchExercises();
  }, [bodyPartName]);

  return (
    <div className="p-4">
      <h3 className="mb-3 font-bold font-lg capitalize text-center">
        {bodyPartName} Exercises
      </h3>

      <div className="container container-md mx-auto py-4">
        {/* Update the card layout to use larger cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              name={exercise.name}
              gifUrl={exercise.gifUrl}
              href={`/exercise-detail/${exercise.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exercisepage;
