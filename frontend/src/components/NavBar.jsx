import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import useAuthStore from "../pages/Store/store";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL path

  // Zustand state
  const { isAuthenticated, username, logout, isAdmin } = useAuthStore();

  // Handle user logout
  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
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
  }, []);

  // Navigate based on authentication and current page
  const handleLogoClick = () => {
    if (isAuthenticated) {
      if (location.pathname === "/userpage") {
        // If the user is on /userpage, redirect to homepage
        navigate("/");
      } else {
        // If the user is not on /userpage, redirect to /userpage
        navigate("/userpage");
      }
    } else {
      // If not authenticated, always go to the homepage
      navigate("/");
    }
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
        {isAdmin && (
          <li>
            <Link
              to="/admin"
              className="block w-full text-left px-4 py-2 hover:bg-gray-300 transition-colors"
            >
              Admin
            </Link>
          </li>
        )}
        {isAuthenticated ? (
          <li>
            <button
              onClick={() => {
                handleLogout();
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
              onClick={() => {
                setIsDropdownOpen(false);
                navigate("/login");
              }}
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
      <div
        className="text-xl font-semibold cursor-pointer"
        onClick={handleLogoClick}
      >
        TRACKFIT
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
