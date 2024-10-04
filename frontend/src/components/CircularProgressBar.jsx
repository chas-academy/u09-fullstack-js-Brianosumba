// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";

const CircularProgressBar = ({ label, value, max, color }) => {
  const radius = 50; // Radius of the circle
  const strokeWidth = 10; // Width of the stroke
  const normalizedRadius = radius - strokeWidth * 0.5; // Adjust radius for stroke width
  const circumference = normalizedRadius * 2 * Math.PI; // Circumference of the circle

  // Calculate the progress
  const progress = Math.min(value, max); // Ensure value doesn't exceed max
  const strokeDashoffset = circumference - (progress / max) * circumference; // Calculate stroke dash offset

  return (
    <div className="flex flex-col items-center mt-4">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e6e6e6" // Background circle color
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`text-${color}-500 transition-all duration-500 ease-in-out`} // Dynamic color and transition classes
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference} // Total length of the circle
          strokeDashoffset={strokeDashoffset} // Amount of progress
        />
      </svg>
      <div className="absolute">
        <p className="text-center">{label}</p>
        <p className="text-xl font-semibold" style={{ color: color }}>
          {Math.round((progress / max) * 100)}% {/* Calculate percentage */}
        </p>
      </div>
    </div>
  );
};

// proptypes validation
CircularProgressBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};
export default CircularProgressBar;
