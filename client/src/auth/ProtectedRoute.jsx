// // src/auth/ProtectedRoute.js
// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();

//   if (!isAuthenticated) {
//     // If the user is not authenticated, redirect to the login page
//     return <Navigate to="/login" />;
//   }

//   // If authenticated, render the children components (protected routes)
//   return children;
// };

// export default ProtectedRoute;
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; // Show loading until authentication is resolved
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
