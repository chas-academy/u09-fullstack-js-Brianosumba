import { Link } from "react-router-dom";

const Exercisepage = () => {
  // Placeholder data with GIF URLs for each exercise
  const exercises = {
    beginner: [
      {
        name: "Pushups",
        gifUrl: "https://gymvisual.com/img/p/2/0/9/4/8/20948.gif", // Placeholder GIF
        link: "/exercise-detail/beginner1",
      },
      {
        name: "Band Bench Press",
        gifUrl: "https://gymvisual.com/img/p/6/5/2/1/6521.gif", // Placeholder GIF
        link: "/exercise-detail/beginner2",
      },
      {
        name: "Dumbbell Flyes",
        gifUrl: "https://gymvisual.com/img/p/2/1/7/5/5/21755.gif", // Placeholder GIF
        link: "/exercise-detail/beginner3",
      },
    ],
    intermediate: [
      {
        name: "Incline Dumbbell Press",
        gifUrl: "https://gymvisual.com/img/p/1/4/1/1/4/14114.gif",
        link: "/exercise-detail/intermediate1",
      },
      {
        name: "Cable Chest Flyes",
        gifUrl: "https://gymvisual.com/img/p/2/8/9/5/9/28959.gif",
        link: "/exercise-detail/intermediate2",
      },
      {
        name: "Dips",
        gifUrl: "https://gymvisual.com/img/p/4/7/4/0/4740.gif",
        link: "/exercise-detail/intermediate3",
      },
    ],
    advanced: [
      {
        name: "Barbell Bench Press",
        gifUrl: "https://gymvisual.com/img/p/1/8/5/6/4/18564.gif",
        link: "/exercise-detail/advanced1",
      },
      {
        name: "Incline Dumbbell Press (slow)",
        gifUrl: "https://gymvisual.com/img/p/1/8/3/6/7/18367.gif",
        link: "/exercise-detail/advanced2",
      },
      {
        name: "Weighted Dips",
        gifUrl: "https://gymvisual.com/img/p/7/5/5/9/7559.gif",
        link: "/exercise-detail/advanced3",
      },
    ],
    recomendedworkouts: [
      {
        name: "Elbow Dips",
        gifUrl: "https://gymvisual.com/img/p/1/3/1/3/6/13136.gif",
        link: "/exercise-detail/recomendedworkouts1",
      },
      {
        name: "Elbow Dips",
        gifUrl: "https://gymvisual.com/img/p/1/3/1/3/6/13136.gif",
        link: "/exercise-detail/recomendedworkouts1",
      },
      {
        name: "Elbow Dips",
        gifUrl: "https://gymvisual.com/img/p/1/3/1/3/6/13136.gif",
        link: "/exercise-detail/recomendedworkouts1",
      },
    ],
  };

  return (
    <>
      {/* Motivational Section */}
      <div className="text-center my-8">
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl text-gray-800">
          Let’s Go, Brian! Time to Rumble!
        </h1>
        <p className="text-lg sm:text-xl mt-4 text-gray-700">
          Every rep counts. You’ve already shown up. Now, let’s crush it and
          unleash your potential!
        </p>
      </div>

      {/* Fitness Level Section */}
      <div className="text-center my-8">
        <h2 className="font-bold text-2xl sm:text-3xl mb-6 text-gray-800">
          Chest Day Baby!
        </h2>
        <p className="text-lg sm:text-xl mb-8 text-gray-600">
          Pick your fitness level below and get started.
        </p>

        {/* Fitness Level Titles with Exercise Cards */}
        <div className="space-y-12">
          {/* Beginner Level */}
          <div>
            <h3 className="font-bold text-xl sm:text-2xl mb-4 text-gray-800">
              Beginner
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.beginner.map((exercise, index) => (
                <Link
                  to={exercise.link}
                  key={index}
                  className="bg-white p-6 rounded-lg hover:shadow-lg border border-gray-300"
                >
                  <img
                    src={exercise.gifUrl}
                    alt={exercise.name}
                    className="w-full h-40 object-cover mb-4"
                  />
                  <p className="text-center font-semibold text-gray-800">
                    {exercise.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Intermediate Level */}
          <div>
            <h3 className="font-bold text-xl sm:text-2xl mb-4 text-gray-800">
              Intermediate
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.intermediate.map((exercise, index) => (
                <Link
                  to={exercise.link}
                  key={index}
                  className="bg-white p-6 rounded-lg hover:shadow-lg border border-gray-300"
                >
                  <img
                    src={exercise.gifUrl}
                    alt={exercise.name}
                    className="w-full h-40 object-cover mb-4"
                  />
                  <p className="text-center font-semibold text-gray-800">
                    {exercise.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Advanced Level */}
          <div>
            <h3 className="font-bold text-xl sm:text-2xl mb-4 text-gray-800">
              Advanced
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.advanced.map((exercise, index) => (
                <Link
                  to={exercise.link}
                  key={index}
                  className="bg-white p-6 rounded-lg hover:shadow-lg border border-gray-300"
                >
                  <img
                    src={exercise.gifUrl}
                    alt={exercise.name}
                    className="w-full h-40 object-cover mb-4"
                  />
                  <p className="text-center font-semibold text-gray-800">
                    {exercise.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recommended Workouts */}
          <div>
            <h3 className="font-bold text-xl sm:text-2xl mb-4 text-gray-800">
              Recommended Workouts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.recomendedworkouts.map((exercise, index) => (
                <Link
                  to={exercise.link}
                  key={index}
                  className="bg-white p-6 rounded-lg hover:shadow-lg border border-gray-300"
                >
                  <img
                    src={exercise.gifUrl}
                    alt={exercise.name}
                    className="w-full h-40 object-cover mb-4"
                  />
                  <p className="text-center font-semibold text-gray-800">
                    {exercise.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Exercisepage;
