import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import PropTypes from "prop-types";

const NavBar = ({ isAuthenticated, setIsAuthenticated }) => {
  console.log("navbar", isAuthenticated);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle user logout
  const handleLogout = () => {
    setIsAuthenticated(false); // Set to false when the user logs out
    localStorage.removeItem("token"); // Clear the token from local storage
    navigate("/"); // Redirect to homepage after logout
  };

  // Handle clicks outside the dropdown to close it
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

  // Navigate to login page
  const handleLoginClick = () => {
    setIsDropdownOpen(false);
    navigate("/login");
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Render the dropdown menu
  const renderDropdownMenu = () => (
    <div
      className={`absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded-lg shadow-lg z-50 transition-all duration-300 transform ${
        isDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <ul className="py-2">
        {isAuthenticated ? (
          <li>
            <button
              onClick={() => {
                handleLogout(); // Call the logout function
                setIsDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <button
              onClick={handleLoginClick} // Redirect to login page
              className="block w-full text-left px-4 py-2 hover:bg-gray-300 transition-colors"
            >
              Login
            </button>
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center relative">
      <div className="text-xl font-semibold">TRACKFIT</div>
      <div className="relative" ref={dropdownRef}>
        <button
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          aria-label="User menu"
          onClick={toggleDropdown}
          className="flex items-center bg-transparent text-white p-2 rounded"
        >
          <FaUserCircle className="h-8 w-8 text-gray-300 hover:shadow-lg hover:scale-110 transition duration-300" />
        </button>
        {isDropdownOpen && renderDropdownMenu()}
      </div>
    </nav>
  );
};

// Define prop types for the NavBar component
NavBar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired, // isAuthenticated should be a required boolean
  setIsAuthenticated: PropTypes.func.isRequired, // handleLogout should be a required function
};

export default NavBar;
