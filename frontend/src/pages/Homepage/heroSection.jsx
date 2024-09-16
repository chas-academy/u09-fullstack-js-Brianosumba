import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-blue-600 text-white text-center py-16 px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Track Fit</h1>
      <p className="text-lg mb-8">
        Track your workouts, set goals, and see your progress all in one place.
        Join TrackFit today and start your journey to a healthier, stronger you!
      </p>
      <div>
        <Link
          to="/login"
          className="bg-yellow-500 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
        >
          Get Started Now
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
