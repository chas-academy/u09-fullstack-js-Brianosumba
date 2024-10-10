// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";

const AdminCard = ({ title, children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-blue-300 shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-lg transition duration-300 hover:scale-105"
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div>{children}</div> {/* Add dynamic content inside cards */}
    </div>
  );
};

AdminCard.propTypes = {
  title: PropTypes.string.isRequired, // Title should be a string and is required
  children: PropTypes.node, // Children can be any renderable node
  onClick: PropTypes.func, // onClick should be a function
};

export default AdminCard;
