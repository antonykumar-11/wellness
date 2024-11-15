import React from "react";
import { Route, Navigate } from "react-router-dom";

// Assume the authentication status is passed in as a prop.
const ProtectedRoute = ({ isAuthenticated, element }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
