import { useNavigate } from "react-router-dom";
import { GiWeightLiftingUp } from "react-icons/gi";

// Define categories outside of the component to prevent re-definition on each render
const categories = [
  { name: "back", icon: <GiWeightLiftingUp className="w-12 h-12" /> },
  { name: "upper arms", icon: <GiWeightLiftingUp className="w-12 h-12" /> },
  { name: "shoulders", icon: <GiWeightLiftingUp className="w-12 h-12" /> },
  { name: "chest", icon: <GiWeightLiftingUp className="w-12 h-12" /> },
  { name: "lower arms", icon: <GiWeightLiftingUp className="w-12 h-12" /> },
  { name: "lower legs", icon: <GiWeightLiftingUp className="w-12 h-12" /> },
  { name: "upper legs", icon: <GiWeightLiftingUp className="w-12 h-12" /> },
  { name: "waist", icon: <GiWeightLiftingUp className="w-12 h-12" /> },
  { name: "cardio", icon: <GiWeightLiftingUp className="w-12 h-12" /> },
  { name: "neck", icon: <GiWeightLiftingUp className="w-12 h-12" /> },
];

const ExerciseCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/exercise/${categoryName.toLowerCase()}`); // Navigate to the ExercisePage with the category name
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="bg-blue-400 p-4 rounded-lg text-center cursor-pointer hover:shadow-lg hover:scale-105 transition-transform"
            onClick={() => handleCategoryClick(category.name)}
            role="button"
            tabIndex={0} // Make it keyboard accessible
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCategoryClick(category.name); // Handle Enter key
            }}
          >
            {category.icon}
            <p className="text-xl font-bold text-gray-700">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseCategories;
