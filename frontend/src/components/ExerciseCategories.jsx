import { GiWeightLiftingUp } from "react-icons/gi";
import { Link } from "react-router-dom";
// Define categories outside of the component to prevent re-definition on each render
const categories = [
  {
    name: "back",
    icon: <GiWeightLiftingUp className="w-8 h-8" />,
    bgColor: "bg-pink-500",
    href: "/exercise/back",
  },
  {
    name: "upper arms",
    icon: <GiWeightLiftingUp className="w-8 h-8" />,
    bgColor: "bg-blue-500",
    href: "/exercise/upper arms",
  },
  {
    name: "shoulders",
    icon: <GiWeightLiftingUp className="w-8 h-8" />,
    bgColor: "bg-red-500",
    href: "/exercise/shoulders",
  },
  {
    name: "chest",
    icon: <GiWeightLiftingUp className="w-8 h-8" />,
    bgColor: "",
    href: "/exercise/chest",
  },
  {
    name: "lower arms",
    icon: <GiWeightLiftingUp className="w-8 h-8" />,
    bgColor: "",
    href: "/exercise/lower arms",
  },
  {
    name: "lower legs",
    icon: <GiWeightLiftingUp className="w-8 h-8" />,
    bgColor: "",
    href: "/exercise/lower legs",
  },
  {
    name: "upper legs",
    icon: <GiWeightLiftingUp className="w-8 h-8" />,
    bgColor: "",
    href: "/exercise/upper leg",
  },
  {
    name: "waist",
    icon: <GiWeightLiftingUp className="w-8 h-8" />,
    bgColor: "",
    href: "/exercise/waist",
  },
  {
    name: "cardio",
    icon: <GiWeightLiftingUp className="w-8 h-8" />,
    bgColor: "",
    href: "/exercise/cardio",
  },
  {
    name: "neck",
    icon: <GiWeightLiftingUp className="w-8 h-8" />,
    bgColor: "",
    href: "/exercise/neck",
  },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const ExerciseCategories = () => {
  return (
    <div className="p-6">
      <h2 className="text-sm font-medium text-gray-500">Workout categories</h2>
      <ul role="list" className="mt-3 flex gap-5 items-center justify-center">
        {categories.map((project) => (
          <Link to={project.href} key={project.name}>
            <li className=" flex rounded-md shadow-sm border border-gray-100 border-sm hover:border-gray-500 rounded-r-md">
              <div
                className={classNames(
                  project.bgColor,
                  "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
                )}
              >
                {project.icon}
              </div>

              <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                  <p
                    href={project.href}
                    className="font-medium text-gray-900 hover:text-gray-600 capitalize"
                  >
                    {project.name}
                  </p>
                </div>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};
/*   return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="bg-slate-400 rounded-lg text-center cursor-pointer hover:shadow-lg hover:scale-105 transition-transform"
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
 */
export default ExerciseCategories;
