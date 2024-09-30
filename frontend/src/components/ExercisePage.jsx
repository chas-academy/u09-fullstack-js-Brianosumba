import { Link, useNavigate } from "react-router-dom";

const Exercisepage = () => {
  const navigate = useNavigate();

  const exercises = {
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
    recommendedWorkouts: [
      {
        name: "Elbow Dips",
        gifUrl: "https://gymvisual.com/img/p/1/3/1/3/6/13136.gif",
      },
    ],
  };

  const handleClick = (exerciseName, level) => {
    navigate(`/exercise-detail/${exerciseName}/${level}`);
  };

  return (
    <>
      <div className="text-center my-8">
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl text-gray-800">
          Let’s Go, Brian! Time to Rumble!
        </h1>
        <p className="text-lg sm:text-xl mt-4 text-gray-700">
          Every rep counts. You’ve already shown up. Now, let’s crush it and
          unleash your potential!
        </p>
      </div>

      <div className="text-center my-8">
        <h2 className="font-bold text-2xl sm:text-3xl mb-6 text-gray-800">
          Chest Day Baby!
        </h2>
        <p className="text-lg sm:text-xl mb-8 text-gray-600">
          Pick your fitness level below and get started.
        </p>

        <div className="space-y-12">
          {["beginner", "intermediate", "advanced", "recommendedWorkouts"].map(
            (level) => (
              <div key={level}>
                <Link to="#" onClick={() => handleClick("Chest", level)}>
                  <h3 className="font-bold text-xl sm:text-2xl mb-4 text-gray-800 hover:text-blue-600 cursor-pointer">
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </h3>
                </Link>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exercises[level].map((exercise, index) => (
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
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Exercisepage;
