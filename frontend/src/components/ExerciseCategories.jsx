import { useNavigate } from "react-router-dom";
import { GiWeightLiftingUp } from "react-icons/gi";

// Define categories outside of the component to prevent re-definition on each render
const categories = [
  {
    name: "Biceps",
    icon: (
      <GiWeightLiftingUp className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
    ),
  },
  {
    name: "Triceps",
    icon: (
      <GiWeightLiftingUp className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
    ),
  },
  {
    name: "Shoulders",
    icon: (
      <GiWeightLiftingUp className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
    ),
  },
  {
    name: "Chest",
    icon: (
      <GiWeightLiftingUp className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
    ),
  },
  {
    name: "Back",
    icon: (
      <GiWeightLiftingUp className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
    ),
  },
  {
    name: "Quads",
    icon: (
      <GiWeightLiftingUp className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
    ),
  },
  {
    name: "Hamstrings",
    icon: (
      <GiWeightLiftingUp className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
    ),
  },
  {
    name: "Core",
    icon: (
      <GiWeightLiftingUp className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
    ),
  },
];

const ExerciseCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/exercise/${categoryName.toLowerCase()}`);
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
