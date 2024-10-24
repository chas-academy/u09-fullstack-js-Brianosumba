import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import useAuthStore from "../pages/Store/store";
import { Link } from "react-router-dom";
const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  //Zustand state
  const { isAuthenticated, username, logout, isAdmin } = useAuthStore();

  // Handle user logout
  const handleLogout = () => {
    logout(); //logout action from zustand
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
        {isAdmin ? (
          <li>
            <Link
              to="/admin"
              className="block w-full text-left px-4 py-2 hover:bg-gray-300 transition-colors"
            >
              Admin
            </Link>
          </li>
        ) : null}
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
      <div className="text-xl font-semibold">
        <Link to="/">TRACKFIT</Link>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          aria-label="User menu"
          onClick={toggleDropdown}
          className="flex items-center bg-transparent text-white p-2 rounded"
        >
          <FaUserCircle className="h-8 w-8 text-gray-300 hover:shadow-lg hover:scale-110 transition duration-300" />
          {isAuthenticated && <span className="ml-2">{username}</span>}
        </button>
        {isDropdownOpen && renderDropdownMenu()}
      </div>
    </nav>
  );
};

export default NavBar;
