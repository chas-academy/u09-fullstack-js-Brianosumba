import { useNavigate } from "react-router-dom";
import { GiWeightLiftingUp } from "react-icons/gi"; // Importing the weightlifting icon
import { useRef } from "react"; // Import useRef for scrolling

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

// Custom hook for scrolling
const useScroll = (ref) => {
  const scroll = (direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200, // Scroll amount
        behavior: "smooth",
      });
    }
  };

  return scroll;
};

const ExerciseCategories = () => {
  const navigate = useNavigate();
  const categoriesRef = useRef(null);
  const scroll = useScroll(categoriesRef); // Use the custom hook

  const handleCategoryClick = (categoryName) => {
    navigate(`/exercise/${categoryName.toLowerCase()}`);
  };

  return (
    <div className="flex items-center p-6">
      <button
        onClick={() => scroll("left")}
        className="bg-gray-300 rounded-full p-2 hover:bg-gray-400 transition-colors"
        aria-label="Scroll left"
      >
        ◀
      </button>
      <div
        className="overflow-x-auto whitespace-nowrap flex-grow mx-4"
        ref={categoriesRef}
      >
        <div className="flex space-x-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-gray-300 p-4 rounded-lg text-center cursor-pointer hover:shadow-lg hover:scale-105 transition-transform"
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
      <button
        onClick={() => scroll("right")}
        className="bg-gray-300 rounded-full p-2 hover:bg-gray-400 transition-colors"
        aria-label="Scroll right"
      >
        ▶
      </button>
    </div>
  );
};

export default ExerciseCategories;
