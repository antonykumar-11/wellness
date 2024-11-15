import React from "react";
import useTheme from "../context/Theme"; // Adjust the path accordingly

const ThemeToggle = () => {
  const { themeMode, darkTheme, lightTheme } = useTheme();

  const handleToggle = () => {
    if (themeMode === "light") {
      darkTheme();
    } else {
      lightTheme();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full focus:outline-none"
      aria-label="Toggle theme"
    >
      {themeMode === "light" ? (
        <span className="text-xl">🌞</span> // Light mode icon
      ) : (
        <span className="text-xl">🌜</span> // Dark mode icon
      )}
    </button>
  );
};

export default ThemeToggle;
