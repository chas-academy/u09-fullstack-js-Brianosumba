import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CircularProgressBar = ({ label, value, max, color }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const radius = windowWidth > 640 ? 50 : 30; // Responsive radius
  const strokeWidth = windowWidth > 640 ? 10 : 5; // Responsive stroke width
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.min(value, max);
  const strokeDashoffset = circumference - (progress / max) * circumference;

  return (
    <div className="flex flex-col items-center mt-4">
      {/* Label centered above the circle */}
      <p className="text-center mb-2">{label}</p>

      {/* SVG wrapper with relative positioning */}
      <div className="relative">
        <svg height={radius * 2} width={radius * 2}>
          {/* Background circle */}
          <circle
            stroke="#808080"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Foreground circle (progress) */}
          <circle
            className={`transition-all duration-500 ease-in-out`}
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ strokeLinecap: "round" }}
          />
        </svg>

        {/* Percentage text centered inside the circle */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color }}
        >
          <p className="text-xl font-semibold">
            {Math.round((progress / max) * 100)}%
          </p>
        </div>
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
