import { useState } from "react";

const ExerciseDetail = () => {
  //Example data - will be dynamic in future
  const exerciseData = {
    name: "Pushups",
    gifUrl: "https://gymvisual.com/img/p/2/0/9/4/8/20948.gif",
    reps: 15,
    sets: 3,
    instructions:
      "Start in a high plank position with your hands flat on the floor...",
    targetMuscles: " chest, Shoulders, Triceps",
  };

  const [workoutsCompletedToday, setWorkoutsCompletedToday] = useState(0);
  const [workoutsCompletedThisWeek, setWorkoutsCompletedThisWeek] = useState(0);
  const [workoutsCompletedThisMonth, setWorkoutsCompletedThisMonth] =
    useState(0);

  const handleDoneClick = () => {
    setWorkoutsCompletedToday(1); //  1 exercise marks it as 100% for today
    setWorkoutsCompletedThisWeek(workoutsCompletedThisWeek + 1);
    setWorkoutsCompletedThisMonth(workoutsCompletedThisMonth + 1);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        {/* Exercise Info */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{exerciseData.name}</h2>
          <img
            src={exerciseData.gifUrl}
            alt={exerciseData.name}
            className="w-full h-64 object-cover mb-4"
          />
          <p className="text-lg font-semibold">
            Reps: {exerciseData.reps} Sets: {exerciseData.sets}
          </p>
          <p className="text-lg text-gray-700 mt-2">
            {exerciseData.instructions}
          </p>
          <p className="text-md text-gray-600 mt-2">
            Target Muscles: {exerciseData.targetMuscles}{" "}
          </p>
        </div>

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
        <div className="mt-8 space-y-4">{/* Today's Progress */}</div>
        <p>Workouts Completed Today</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${workoutsCompletedToday * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Progress Bars */}
      <div>
        <p>Workouts Completed This Week</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${(workoutsCompletedThisWeek / 3) * 100}%` }} // Assumes 3 workouts/week
          ></div>
        </div>
      </div>

      {/* Monthly Progress */}
      <div>
        <p>Workouts Completed This Month</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${(workoutsCompletedThisMonth / 9) * 100}%` }} // Assumes 9 workouts/month
          ></div>
        </div>
      </div>

      {/* Strength Growth Progress */}
      <div>
        <p>Strength Growth</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-red-500 h-4 rounded-full"
            style={{ width: `${(workoutsCompletedThisMonth / 9) * 100}%` }} // Example logic
          ></div>
        </div>
      </div>
    </>
  );
};

export default ExerciseDetail;
