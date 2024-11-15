import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const PayPage = () => {
  const { employeeId } = useParams(); // Get employeeId from URL parameters
  console.log("employeeId", employeeId);
  const navigate = useNavigate();

  const handleChoice = (choice) => {
    if (choice === "employee") {
      navigate(`/staff/employees/${employeeId}`);
    } else if (choice === "driver") {
      navigate(`/staff/driver/${employeeId}`);
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          For whom do you want to define salary?
        </h1>
      </div>
      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={() => handleChoice("employee")}
          className="w-full bg-blue-500 text-white p-4 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Create Salary
        </button>
        <button
          onClick={() => handleChoice("driver")}
          className="w-full bg-green-500 text-white p-4 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Update Salary Details
        </button>
      </div>
    </div>
  );
};

export default PayPage;
