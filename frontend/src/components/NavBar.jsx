import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav
      style={{ backgroundColor: "#000080" }} // Inline style for navy blue
      className="text-white p-4 flex justify-between items-center relative"
    >
      <div className="text-xl font-semibold">TRACKFIT</div>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center bg-transparent text-white p-2 rounded"
        >
          <FaUserCircle className="h-8 w-8 text-gray-300 hover:shadow-lg hover:scale-110 transition duration-300" />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded-lg shadow-lg z-50">
            <ul className="py-2">
              <li>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-center hover:bg-gray-300 transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
