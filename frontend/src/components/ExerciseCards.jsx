import { GiWeightLiftingUp } from "react-icons/gi";

const ExerciseCards = ({ title }) => {
  return (
    <div className="bg-slate-300 border border-gray-400 rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg trasition duration-300 hover:scale-105">
      <div className="flex items-center justify-center mb-2">
        <GiWeightLiftingUp className="text-4xl text-gray-700" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">{title}</p>
      </div>
    </div>
  );
};

export default ExerciseCards;
