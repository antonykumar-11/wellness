import React from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const WelcomePage = () => {
  const { user } = useAuth(); // Get user data from AuthContext
  const navigate = useNavigate(); // Get the navigate function

  const handleRedirect = () => {
    navigate("/transactions/expensecreate"); // Redirect to the specified route
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">
        Welcome {user?.name || "Guest"}!
      </h1>
      <div className="flex space-x-2 mb-8">
        {/* Loader animations */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="animate-ping w-8 h-8 bg-blue-500 rounded-full"
            style={{ animationDelay: `${index * 200}ms` }} // Add delay for a staggered effect
          />
        ))}
      </div>
      <p
        className="text-lg cursor-pointer hover:underline"
        onClick={handleRedirect} // Handle click to redirect
      >
        Let’s start your personal transaction with us, so click me...
      </p>
    </div>
  );
};

export default WelcomePage;
