import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-slate-600 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-semibold">TRACKFIT</div>
      <ul className="flex space-x-4">
        <li>
          <Link
            to="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
