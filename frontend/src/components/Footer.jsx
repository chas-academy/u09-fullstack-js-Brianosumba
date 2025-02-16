import { FaApple, FaGooglePlay } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className=" py-2 px-4 text-center w-full">
      <div className="container mx-auto py-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          Download our fitness app
        </h2>
        <p className="mb-8 text-sm sm:text-base">Stay fit. All day. Everyday</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-sm mx-auto text-gray-800">
          <a
            href="https://www.apple.com/se/app-store/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-white px-4 py-1 rounded-lg shadow-md hover:bg-gray-300 transition whitespace-nowrap"
          >
            <FaApple className="h-4 w-4  mr-2" />
            <span className="text-sm sm:text-base">
              Download on the App Store
            </span>
          </a>
          <a
            href="https://play.google.com/store/games"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-white px-4 py-1  rounded-lg shadow-md hover:bg-gray-300 transition whitespace-nowrap"
          >
            <FaGooglePlay className="h-4 w-4  mr-2" />
            Download on Google Play
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
