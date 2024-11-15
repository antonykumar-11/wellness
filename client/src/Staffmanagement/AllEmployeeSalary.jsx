import React, { useEffect, useState } from "react";
import { useGetAllEmployeesQuery } from "../store/api/StaffApi";
import { useGetPayHeadDetailsByIdQuery } from "../store/api/payHeadDetailsApi";
import { useGetAttendanceByIdQuery } from "../store/api/AttendenceApi";

const SalaryCalculator = () => {
  const { data: employees = [], isLoading: isLoadingEmployees } =
    useGetAllEmployeesQuery();
  const [salaryResults, setSalaryResults] = useState({});

  // State to keep track of currently selected employee's ID
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // Hooks to fetch data for the selected employee
  const { data: payHeadDetails = [] } = useGetPayHeadDetailsByIdQuery(
    selectedEmployeeId,
    {
      skip: !selectedEmployeeId, // Skip fetching if no employee is selected
    }
  );
  const { data: totals = {} } = useGetAttendanceByIdQuery(selectedEmployeeId, {
    skip: !selectedEmployeeId, // Skip fetching if no employee is selected
  });

  useEffect(() => {
    const fetchAllSalaryData = async () => {
      try {
        const results = {};
        for (const employee of employees) {
          // Skip fetching data if no employee is selected
          if (!selectedEmployeeId || selectedEmployeeId !== employee._id)
            continue;

          // Handle the fetched data here
          if (payHeadDetails.length > 0) {
            const aggregatedDetails =
              aggregateTransactionsByMonth(payHeadDetails);
            const monthlyResults = Object.keys(aggregatedDetails).map((month) =>
              computeResults(aggregatedDetails[month], month, totals)
            );
            results[employee._id] = monthlyResults;
          }
        }
        setSalaryResults(results);
      } catch (error) {
        console.error("Error fetching salary data:", error);
      }
    };

    if (employees.length > 0) {
      fetchAllSalaryData();
    }
  }, [employees, selectedEmployeeId, payHeadDetails, totals]);

  if (isLoadingEmployees) return <p>Loading...</p>;

  return (
    <div>
      {/* Render your salary results */}
      {/* Example: Render a dropdown or list to select an employee */}
      <select onChange={(e) => setSelectedEmployeeId(e.target.value)}>
        <option value="">Select an employee</option>
        {employees.map((employee) => (
          <option key={employee._id} value={employee._id}>
            {employee.name}
          </option>
        ))}
      </select>
      <div>{/* Render the salary results here */}</div>
    </div>
  );
};

export default SalaryCalculator;
