// src/Staffmanagement/SalaryContext.js
import React, { createContext, useState, useContext } from "react";

// Create a context with a default value
const SalaryContext = createContext();

// Provider component
export const SalaryProvider = ({ children }) => {
  const [salaryData, setSalaryData] = useState([]);

  return (
    <SalaryContext.Provider value={{ salaryData, setSalaryData }}>
      {children}
    </SalaryContext.Provider>
  );
};

// Custom hook to use the SalaryContext
export const useSalaryContext = () => {
  return useContext(SalaryContext);
};
