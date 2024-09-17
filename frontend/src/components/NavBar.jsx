import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for user icon dropdown

  // Function to toggle user icon dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-blue-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold">TRACKFIT</div>

        {/* User Icon (visible on all screens) */}
        <ul className="flex items-center space-x-4">
          <li className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center focus:outline-none"
            >
              <FaUserCircle className="h-8 w-8 text-gray-100 hover:text-gray-200 transition-transform transform hover:scale-110" />
            </button>

            {/* Dropdown Menu (for both mobile and desktop) */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-25 bg-white text-gray-800 rounded-lg shadow-lg flex justify-center">
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
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
