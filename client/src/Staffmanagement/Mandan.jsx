// DisplaySalaries.js
import React from "react";
import { useSalaryContext } from "./SalaryContext";

const DisplaySalaries = () => {
  const { salaryData } = useSalaryContext();

  if (!salaryData.length) {
    return <p>No salary data available.</p>;
  }

  return (
    <div>
      <h1>Salary Data</h1>
      <ul>
        {salaryData.map((record, index) => (
          <li key={index}>
            <strong>{record.employee.name}</strong>: $
            {record.totalSalary.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplaySalaries;
