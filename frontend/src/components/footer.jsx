import { FaApple, FaGooglePlay } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 text-center w-full">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          Download our fitness app
        </h2>
        <p className="mb-8 text-sm sm:text-base">Stay fit. All day. Everyday</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="https://www.apple.com/se/app-store/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-gray-300 transition"
          >
            <FaApple className="h-6 w-6 text-gray-800 mr-2" />
            <span className="text-sm sm:text-base">
              Download on the App Store
            </span>
          </a>
          <a
            href="https://play.google.com/store/games"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-gray-300 transition"
          >
            <FaGooglePlay className="h-6 w-6 text-gray-800 mr-2" />
            <span className="text-sm sm:text-base">
              Download on Google Play
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
