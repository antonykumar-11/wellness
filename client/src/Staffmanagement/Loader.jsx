// Loader.js
import React from "react";
import "./Loader.css"; // Ensure you have a CSS file for the styles

const Loader = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`loader bounce animation-${index + 1}`}
        ></div>
      ))}
    </div>
  );
};

export default Loader;
