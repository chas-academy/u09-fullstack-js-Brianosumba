import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";

const ExerciseDetail = () => {
  const { exerciseName, level } = useParams();
  const userName = "Taylor"; // This will be dynamic later

  // track workouts and initialize progress
  const [workoutsToday, setWorkoutsToday] = useState(0);
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0);
  const [workoutsThisMonth, setWorkoutsThisMonth] = useState(0);
  const [strengthProgress, setStrengthProgress] = useState(0);

  // reset logic -  handles daily, weekly and monthly resets
  useEffect(() => {
    //resets daily workout at midnight
    const resetDay = () => setWorkoutsToday(0);
    const resetWeek = () => setWorkoutsThisWeek(0);
    const resetMonth = () => {
      setWorkoutsThisMonth(0);
      setStrengthProgress(0);
    };

    //daily reset
    const resetDaily = setInterval(() => {
      const now = new Date(); //Get the current date and time
      if (now.getHours() === 0 && now.getMiutes() === 0) {
        resetDay(); //reset daily progress at midnight
      }
    }, 60000); // checks every minute (60000ms)

    //weekly reset
    const resetWeekly = setInterval(() => {
      const now = new Date(); // Get the current date and time

      //checks if its Monday and its exactly 00:00 (midnight)
      if (
        now.getDay() === 1 &&
        now.getHours() === 0 &&
        now.getMinutes() === 0
      ) {
        resetWeek(); // call the reser function when its monday midnight
      }
    }, 60000); // check every minute

    // monthly reset
    const resetMonthly = setInterval(() => {
      const now = new Date();

      //check if its the first day of the month and exactly 00:00(midnight)
      if (
        now.getDate() === 1 &&
        now.getHours() === 0 &&
        now.getMinutes() === 0
      ) {
        resetMonth(); // call the reset function when its the first day of the month at midnight
      }
    }, 60000);

    //clean up intervals
    return () => {
      clearInterval(resetDaily);
      clearInterval(resetWeekly);
      clearInterval(resetMonthly);
    };
  }, []);

  // handle Workout completion
  const handleDoneClick = () => {
    setWorkoutsToday(workoutsToday + 1);
    setWorkoutsThisWeek(workoutsThisWeek + 1);
    setWorkoutsThisMonth(workoutsThisMonth + 1);

    // TODO: Backend implementation
    // Save the updated progress to the backend (MongoDB):
    // You would likely send a request to your Node.js/Express API here
    // Example:
    // fetch('/api/saveProgress', { method: 'POST', body: JSON.stringify({ workoutsToday, workoutsThisWeek, workoutsThisMonth }) })
    // This will store the current progress in MongoDB for this user

    //increase strength progress slowly and reset after a month
    if (strengthProgress < 100) {
      const newStrength = (workoutsThisMonth / 12) * 100;
      setStrengthProgress(newStrength);
    }

    // TODO: Backend implementation
    // Save the updated strength progress to the backend
    // Example:
    // fetch('/api/saveStrengthProgress', { method: 'POST', body: JSON.stringify({ strengthProgress: newStrength }) })

    console.log("Done clicked!");
  };

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
          <ProgressBar
            label="Workouts Completed Today"
            value={workoutsToday}
            max={1}
            color="bg-blue-400"
          />

          <ProgressBar
            label="Workouts Completed This Week"
            value={workoutsThisWeek}
            max={3}
            color="bg-orange-500"
          />

          <ProgressBar
            label="Workouts Completed This Month"
            value={workoutsThisMonth}
            max={12}
            color="bg-green-500"
          />

          <ProgressBar
            label="Strength Growth"
            value={strengthProgress}
            max={100}
            color="bg-red-500"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExerciseDetail;
