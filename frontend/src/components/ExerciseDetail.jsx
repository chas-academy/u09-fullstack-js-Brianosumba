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

  //Example state variables for workouts completed(replace later with dynamic data)
  const workoutsCompletedToday = 1; //Replace with actual data
  const workoutsCompletedThisWeek = 3; //Replace with actual data
  const workoutsCompletedThisMonth = 12; //Replace with actual data

  const handleDoneClick = () => {
    //handle the Done click logic here
    console.log("Done clicked!");
  };

  return (
    <div className="bg-gray-200 min-h-screen">
      <NavBar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-4 capitalize">
          {exerciseName} - {level} Level
        </h1>
        <p className="text-center">User: {userName}</p>
        {exerciseDetail.length > 0 ? (
          exerciseDetail.map((exercise, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg overflow-hidden mb-6"
            >
              {/* Exercise GIF */}
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="w-full md:w-1/3 h-auto"
              />

              {/* Exercise Details */}
              <div className="p-4 flex-1">
                <h2 className="text-xl font-semibold mb-2 text-center md:text-left">
                  {exercise.name}
                </h2>
                <div className="text-gray-600 text-center md:text-left">
                  {exercise.sets && <p>Sets: {exercise.sets}</p>}
                  {exercise.reps && <p>Reps: {exercise.reps}</p>}
                  {exercise.instructions && <p>{exercise.instructions}</p>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No exercises found for this level.</p>
        )}
        {/* 'Done' Button */}
        <div className="text-center my-8">
          <button
            onClick={handleDoneClick}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Done
          </button>
        </div>

        {/* Progress Bars */}
        <div className="mt-8 space-y-4">
          {/* Today's Progress */}
          <div>
            <p className="text-center">Workouts Completed Today</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${workoutsCompletedToday * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div>
            <p className="text-center">Workouts Completed This Week</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${(workoutsCompletedThisWeek / 3) * 100}%` }} // Assumes 3 workouts/week
              ></div>
            </div>
          </div>

          {/* Monthly Progress */}
          <div>
            <p className="text-center">Workouts Completed This Month</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${(workoutsCompletedThisMonth / 9) * 100}%` }} // Assumes 9 workouts/month
              ></div>
            </div>
          </div>

          {/* Strength Growth Progress */}
          <div>
            <p className="text-center">Strength Growth</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-red-500 h-4 rounded-full"
                style={{ width: `${(workoutsCompletedThisMonth / 9) * 100}%` }} // Example logic
              ></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExerciseDetail;
