import ExerciseCards from "./ExerciseCards";

const ExerciseCardList = () => {
  const exercises = [
    "Biceps",
    "Triceps",
    "Chest",
    "Back",
    "Quads",
    "Hamstrings",
    "Glutes",
    "Core",
    "Cardio",
    "Shoulders",
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ">
      {exercises.map((exercise, index) => (
        <ExerciseCards key={index} title={exercise} />
      ))}
    </div>
  );
};

export default ExerciseCardList;
