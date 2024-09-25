import { useParams } from "react-router-dom";

import NavBar from "../../components/NavBar";

const ExerciseDetailPage = () => {
  const { level } = useParams(); // Capture the 'level' from the URL
  const userName = "Mike"; // This will be dynamic once you implement the backend

  // Define the exercises based on fitness levels
  const exercisesByLevel = {
    beginner: [
      {
        name: "Pushups",
        gifUrl: "https://gymvisual.com/img/p/2/0/9/4/8/20948.gif",
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
    intermediate: [
      {
        name: "Incline Dumbbell Press",
        gifUrl: "https://gymvisual.com/img/p/1/4/1/1/4/14114.gif",
      },
      {
        name: "Cable Chest Flyes",
        gifUrl: "https://gymvisual.com/img/p/2/8/9/5/9/28959.gif",
      },
      { name: "Dips", gifUrl: "https://gymvisual.com/img/p/4/7/4/0/4740.gif" },
    ],
    advanced: [
      {
        name: "Barbell Bench Press",
        gifUrl: "https://gymvisual.com/img/p/1/8/5/6/4/18564.gif",
      },
      {
        name: "Incline Dumbbell Press (slow)",
        gifUrl: "https://gymvisual.com/img/p/1/8/3/6/7/18367.gif",
      },
      {
        name: "Weighted Dips",
        gifUrl: "https://gymvisual.com/img/p/7/5/5/9/7559.gif",
      },
    ],
    recommended: [
      {
        name: "Elbow Dips",
        gifUrl: "https://gymvisual.com/img/p/1/3/1/3/6/13136.gif",
      },
    ],
  };

  // Get the exercises for the current level
  const exercises = exercisesByLevel[level] || [];

  return (
    <>
      {/* Navbar */}
      <div>
        <NavBar />
      </div>

      {/* Personalized Message */}
      <div className="text-center my-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Let&apos;s Go, {userName}!
        </h2>
        <p className="text-xl text-gray-600">
          Stay focused and smash your workout goals!
        </p>
      </div>

      {/* Exercise Detail Section */}
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 capitalize">
          {level} Exercises
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border border-gray-300 hover:shadow-lg transform hover:scale-105 transition-transform duration-200"
            >
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="w-full h-40 object-cover mb-4"
              />
              <p className="text-center font-semibold text-gray-800">
                {exercise.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ExerciseDetailPage;
