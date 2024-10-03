import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center relative">
      <div className="text-xl font-semibold">TRACKFIT</div>
      <div className="relative" ref={dropdownRef}>
        <button
          aria-expanded={isDropdownOpen}
          aria-label="User menu"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center bg-transparent text-white p-2 rounded"
        >
          <FaUserCircle className="h-8 w-8 text-gray-300 hover:shadow-lg hover:scale-110 transition duration-300" />
        </button>
        {isDropdownOpen && (
          <div
            className={`absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded-lg shadow-lg z-50 transition-all duration-300 transform ${
              isDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
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
