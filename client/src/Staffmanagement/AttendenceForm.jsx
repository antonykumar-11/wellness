import React, { useState } from "react";

const AttendanceForm = ({ employees, onMarkAttendance }) => {
  const [attendance, setAttendance] = useState(
    employees.reduce((acc, employee) => {
      acc[employee.id] = false;
      return acc;
    }, {})
  );

  const handleChange = (employeeId) => {
    setAttendance((prev) => ({
      ...prev,
      [employeeId]: !prev[employeeId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onMarkAttendance(attendance);
    setAttendance(
      employees.reduce((acc, employee) => {
        acc[employee.id] = false;
        return acc;
      }, {})
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
      {employees.map((employee) => (
        <div key={employee.id} className="mb-2 flex items-center">
          <input
            type="checkbox"
            id={`employee-${employee.id}`}
            checked={attendance[employee.id]}
            onChange={() => handleChange(employee.id)}
            className="mr-2"
          />
          <label htmlFor={`employee-${employee.id}`}>{employee.name}</label>
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Submit
      </button>
    </form>
  );
};

export default AttendanceForm;
