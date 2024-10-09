import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import CircularProgressBar from "./CircularProgressBar";

const ExerciseDetail = () => {
  const { exerciseName, level } = useParams();
  const userName = "Taylor"; // This will be dynamic later

  // Track workouts and initialize progress
  const [workoutsToday, setWorkoutsToday] = useState(0);
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0);
  const [workoutsThisMonth, setWorkoutsThisMonth] = useState(0);
  const [strengthProgress, setStrengthProgress] = useState(0);

  // Reset functions
  const resetDay = () => setWorkoutsToday(0);
  const resetWeek = () => setWorkoutsThisWeek(0);
  const resetMonth = () => {
    setWorkoutsThisMonth(0);
    setStrengthProgress(0);
  };

  // Reset logic
  useEffect(() => {
    const resetDaily = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetDay();
      }
    }, 60000);

    const resetWeekly = setInterval(() => {
      const now = new Date();
      if (
        now.getDay() === 1 &&
        now.getHours() === 0 &&
        now.getMinutes() === 0
      ) {
        resetWeek();
      }
    }, 60000);

    const resetMonthly = setInterval(() => {
      const now = new Date();
      if (
        now.getDate() === 1 &&
        now.getHours() === 0 &&
        now.getMinutes() === 0
      ) {
        resetMonth();
      }
    }, 60000);

    return () => {
      clearInterval(resetDaily);
      clearInterval(resetWeekly);
      clearInterval(resetMonthly);
    };
  }, []);

  // Handle workout completion
  const handleDoneClick = () => {
    setWorkoutsToday((prev) => Math.min(prev + 1, 1));
    setWorkoutsThisWeek((prev) => Math.min(prev + 1, 3));
    setWorkoutsThisMonth((prev) => Math.min(prev + 1, 12));

    if (strengthProgress < 100) {
      const newStrength = Math.min(strengthProgress + 100 / 12, 100);
      setStrengthProgress(newStrength);
    }

    console.log("Done clicked!");
  };

  // Exercise details
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
      // Add intermediate and advanced details...
    },
  };

  const exerciseDetail = exercisesDetails[exerciseName]?.[level] || [];

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
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="w-full md:w-1/3 h-auto"
              />
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
        <div className="text-center my-8">
          <button
            onClick={handleDoneClick}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Done
          </button>
        </div>
        <div className="mt-8 space-y-4">
          <CircularProgressBar
            label="Workouts Completed Today"
            value={workoutsToday}
            max={1}
            color="green"
          />
          <CircularProgressBar
            label="Workouts Completed This Week"
            value={workoutsThisWeek}
            max={3}
            color="orange"
          />
          <CircularProgressBar
            label="Workouts Completed This Month"
            value={workoutsThisMonth}
            max={12}
            color="red"
          />
          <CircularProgressBar
            label="Strength Growth"
            value={strengthProgress}
            max={100}
            color="blue"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExerciseDetail;
