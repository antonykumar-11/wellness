// EmployeeManagementSystem.js
import React from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader"; // Ensure this path is correct

function EmployeeManagementSystem() {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 bg-[url('assets/Design.jpeg')] bg-cover bg-center filter blur-lg"></div>
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>
      <div className="relative flex flex-col items-center justify-center h-full space-y-4">
        <Loader />
        <Link
          to="/staff/payHeadDetails"
          className="inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition-colors duration-300"
        >
          Welcome to staff management
        </Link>
      </div>
    </div>
  );
}

export default EmployeeManagementSystem;
