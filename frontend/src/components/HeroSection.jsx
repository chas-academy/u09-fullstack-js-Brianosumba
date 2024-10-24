import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="flex flex-col items-center justify-center  text-white text-center py-12 px-4 min-h-[56vh]">
      <h1 className="hero-section-title text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8">
        Welcome to Track Fit
      </h1>
      <p className="text-base sm:text-lg md:text-2xl lg:text-2xl xl:text-3xl mb-4 sm:mb-6 lg:mb-8">
        Track your workouts, set goals, and see your progress all in one place.
        Join TrackFit today and start your journey to a healthier, stronger you!
      </p>
      <div>
        <Link
          to="/login"
          className="bg-yellow-500 text-gray-800 px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg font-semibold hover:bg-yellow-600 transition"
        >
          Get Started Now
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
