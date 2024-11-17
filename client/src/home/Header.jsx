import React, { useState } from "react";
import { Menu as MenuIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import useTheme from "../context/Theme"; // Assuming you're using a ThemeContext
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import CalculatorModal from "../admin/CalCulatorModal";

const Header = ({ toggleSidebar }) => {
  const { themeMode, darkTheme, lightTheme } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Assuming you're using an AuthContext
  const [isModalOpen, setModalOpen] = useState(false);
  // Handle theme toggle
  const handleToggle = () => {
    if (themeMode === "light") {
      darkTheme();
    } else {
      lightTheme();
    }
  };

  // Navigate to the user profile with user ID
  const handleProfileClick = () => {
    navigate(`/reports/profile/${user._id}`); // Include user ID in the URL
  };

  return (
    <header
      className={`h-20 right flex items-center justify-between border-b p-4 ${
        themeMode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-yellow-500 border-slate-200"
      }`}
    >
      {/* User profile and theme toggle */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-2 cursor-pointer">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="User profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
              onClick={handleProfileClick}
            />
            <span
              className="text-white font-medium"
              onClick={handleProfileClick}
            >
              {user?.name || "User"}
            </span>
          </div>
        ) : (
          <p className="text-white">Guest</p>
        )}

        {/* Theme toggle button */}
        <button
          onClick={handleToggle}
          className="p-2 rounded-full focus:outline-none"
          aria-label="Toggle theme"
        >
          {themeMode === "light" ? (
            <span className="text-xl">🌞</span>
          ) : (
            <span className="text-xl">🌜</span>
          )}
        </button>
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="bg-green-500 text-white px-6 py-3 rounded"
      >
        <FontAwesomeIcon icon={faCalculator} className="mr-2" />
      </button>
      <CalculatorModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      {/* Sidebar toggle button for small screens */}
      <button
        className="md:hidden p-2"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <MenuIcon size={24} />
      </button>
    </header>
  );
};

export default Header;
