import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ExerciseCard } from "../components/ExcerciseCard"; // Ensure correct import

const Exercisepage = () => {
  const { bodyPartName } = useParams(); // Get the body part name from URL parameters
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
        console.log(response.data); // Log the fetched data
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id} // Ensure this key is correct
              id={exercise.id} // Ensure this key is correct
              name={exercise.name}
              gifUrl={exercise.gifUrl}
              target={exercise.target} // Optional: include target if it exists
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exercisepage;
