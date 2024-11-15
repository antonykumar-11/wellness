import React, { useState, useEffect } from "react";
import moment from "moment";

const AttendanceGrid = ({ attendanceList, selectedMonth }) => {
  const [rowData, setRowData] = useState([]);
  const [days, setDays] = useState([]);

  useEffect(() => {
    const year = moment(selectedMonth).year();
    const month = moment(selectedMonth).month();
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

    setDays(daysArray);

    const uniqueUsers = getUniqueRecords(attendanceList);
    const updatedUserList = uniqueUsers.map((user) => {
      const attendanceMap = {};
      daysArray.forEach((day) => {
        const record = attendanceList.find(
          (item) =>
            item.employeeId === user.employeeId &&
            moment(item.date).date() === day
        );
        attendanceMap[`day_${day}`] = record ? record.present : false;
      });
      return { ...user, ...attendanceMap };
    });

    setRowData(updatedUserList);
  }, [attendanceList, selectedMonth]);

  const getUniqueRecords = (list) => {
    const uniqueRecords = [];
    const seen = new Set();
    list.forEach((record) => {
      if (!seen.has(record.employeeId)) {
        seen.add(record.employeeId);
        uniqueRecords.push(record);
      }
    });
    return uniqueRecords;
  };

  const handleCheckboxChange = (employeeId, day, isPresent) => {
    setRowData(
      rowData.map((row) => {
        if (row.employeeId === employeeId) {
          return { ...row, [`day_${day}`]: isPresent };
        }
        return row;
      })
    );
  };

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Designation</th>
              {days.map((day) => (
                <th key={day} className="border px-4 py-2">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowData.map((row) => (
              <tr key={row.employeeId}>
                <td className="border px-4 py-2">{row.attendanceId}</td>
                <td className="border px-4 py-2">{row.employeeId.name}</td>
                <td className="border px-4 py-2">{row.designation}</td>
                {days.map((day) => (
                  <td key={day} className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={row[`day_${day}`]}
                      onChange={(e) =>
                        handleCheckboxChange(
                          row.employeeId,
                          day,
                          e.target.checked
                        )
                      }
                      className="form-checkbox"
                    />
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

export default AttendanceGrid;
