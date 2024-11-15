import React from "react";
import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is imported

export default function Loader() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Loader Animation */}
        <div className="w-16 h-16 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-white text-xl font-semibold">Loading...</p>
        {/* Button */}
        <button
          onClick={handleClick}
          className="mt-4 px-6 py-2 bg-white text-blue-500 rounded-lg shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        >
          Click Me
        </button>
      </div>
    </div>
  );
}
