import React, { useState } from "react";
import AttendanceForm from "./AttendenceForm";

const AttendanceRegister = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const employees = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
  ];

  const handleMarkAttendance = (attendance) => {
    const date = new Date().toLocaleDateString();
    const newAttendance = { date, attendance };
    setAttendanceData((prev) => [...prev, newAttendance]);
  };

  return (
    <div className="container mx-auto p-4">
      <AttendanceForm
        employees={employees}
        onMarkAttendance={handleMarkAttendance}
      />
      <h2 className="text-2xl font-bold mt-8">Attendance Register</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              {employees.map((employee) => (
                <th key={employee.id} className="px-4 py-2">
                  {employee.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{record.date}</td>
                {employees.map((employee) => (
                  <td key={employee.id} className="border px-4 py-2">
                    {record.attendance[employee.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceRegister;
