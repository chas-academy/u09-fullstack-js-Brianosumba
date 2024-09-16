import React from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 text-center">
      <h2 className="text-2xl font-semibold mb-4">Download our fitness app</h2>
      <p className="mb-8">Stay fit. All day. Everyday</p>
      <div className="flex justify-center space-x-4">
        <a
          href="https://www.apple.com/se/app-store/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          <FaApple className="h-6 w-6 text-gray-800 mr-2" />{" "}
          {/* Icon for Apple */}
          <span>Download on the App Store</span>
        </a>
        <a
          href="https://play.google.com/store/games"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          <FaGooglePlay className="h-6 w-6 text-gray-800 mr-2" />{" "}
          {/* Icon for Google Play */}
          <span>Download on Google Play</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
