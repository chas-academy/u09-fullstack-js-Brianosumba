// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";

const ProgressBar = ({ label, value, max, color }) => (
  <div className="mt-4">
    <p className="text-center">{label}</p>
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className={`${color} h-4 rounded-full`}
        style={{ width: `${(value / max) * 100}%` }} //Calculate percantage
      ></div>
    </div>
  </div>
);

// proptypes validation
ProgressBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};
export default ProgressBar;
