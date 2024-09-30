import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const ExerciseDetail = () => {
  const { exerciseName, level } = useParams();
  const userName = "Mike"; // This will be dynamic later

  // Define exercises with their details
  const exercisesDetails = {
    Chest: {
      beginner: [
        {
          name: "Pushups",
          gifUrl: "https://gymvisual.com/img/p/2/0/9/4/8/20948.gif",
          sets: 2,
          reps: 10,
          instructions: "Do pushups on your knees.",
        },
        {
          name: "Band Bench Press",
          gifUrl: "https://gymvisual.com/img/p/6/5/2/1/6521.gif",
        },
        {
          name: "Dumbbell Flyes",
          gifUrl: "https://gymvisual.com/img/p/2/1/7/5/5/21755.gif",
        },
      ],
      // ... intermediate and advanced details ...
    },
  };

  const exerciseDetail = exercisesDetails[exerciseName]?.[level] || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-4 capitalize">
          {exerciseName} - {level} Level
        </h1>
        <p className="text-center">User: {userName}</p>
        {exerciseDetail.length > 0 ? (
          exerciseDetail.map((exercise, index) => (
            <div key={index} className="mb-4 text-center">
              <h2 className="text-xl font-semibold">{exercise.name}</h2>
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="mx-auto my-2"
              />
              {exercise.sets && <p>Sets: {exercise.sets}</p>}
              {exercise.reps && <p>Reps: {exercise.reps}</p>}
              {exercise.instructions && (
                <p>Instructions: {exercise.instructions}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center">No exercises found for this level.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ExerciseDetail;
