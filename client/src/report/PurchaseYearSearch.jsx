import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PurchaseYearSearch = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const navigate = useNavigate();

  // Function to handle year change
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Function to handle year search
  const handleYearSearch = () => {
    if (selectedYear) {
      // Redirect to the year report page
      navigate(`/reports/purchasereport/${selectedYear}`);
    } else {
      // Optionally, handle the case when no year is selected
      alert("Please select a year.");
    }
  };

  return (
    <div>
      <select
        value={selectedYear}
        onChange={handleYearChange}
        className="mt-2 p-2 border rounded"
      >
        <option value="">Select Year</option>
        {/* Generating years from 2019 to 2029 */}
        {Array.from({ length: 11 }, (_, index) => 2019 + index).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <button
        onClick={handleYearSearch}
        className="mt-2 w-full bg-blue-500 text-white p-2 rounded"
      >
        Search
      </button>
    </div>
  );
};

export default PurchaseYearSearch;
