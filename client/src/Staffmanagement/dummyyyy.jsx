import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetEmployeeDetailsByIdQuery } from "../store/api/StaffApi";
import { useGetPayHeadDetailsByIdQuery } from "../store/api/payHeadDetailsApi";
import { useGetAttendanceByIdQuery } from "../store/api/AttendenceApi";
import moment from "moment";

const SpecificEmployeeSalaryCalculator = () => {
  const { employeeId } = useParams();
  const currentMonthStart = moment().startOf("month").format("YYYY-MM-DD");
  const currentMonthEnd = moment().endOf("month").format("YYYY-MM-DD");

  const [startDate, setStartDate] = useState(currentMonthStart);
  const [endDate, setEndDate] = useState(currentMonthEnd);
  const [salaryResults, setSalaryResults] = useState(null);

  const { data: employees, refetch: refetchEmployees } =
    useGetEmployeeDetailsByIdQuery(employeeId);
  const { data: totals = {}, refetch: refetchAttendance } =
    useGetAttendanceByIdQuery({ id: employeeId, startDate, endDate });
  const { data: payHeadDetails = [], refetch: refetchPayHeadDetails } =
    useGetPayHeadDetailsByIdQuery(employeeId);

  const componentRef = useRef();

  // Fix: refetch the data only when `employeeId` changes or the date range changes
  useEffect(() => {
    if (employeeId) {
      // Use promise chaining to refetch the data only once per cycle
      refetchEmployees()
        .then(() => refetchAttendance())
        .then(() => refetchPayHeadDetails());
    }
  }, [employeeId, refetchEmployees, refetchAttendance, refetchPayHeadDetails]);

  // Fix: only run this effect if `payHeadDetails` and `totals` change
  useEffect(() => {
    if (payHeadDetails.length && totals) {
      const aggregatedDetails = aggregateTransactionsByDateRange(
        payHeadDetails,
        startDate,
        endDate
      );
      const results = computeResults(
        aggregatedDetails,
        startDate,
        endDate,
        totals.totalPresentDays
      );
      setSalaryResults(results);
    }
  }, [payHeadDetails, totals, startDate, endDate]);

  const handleDateRangeChange = (event) => {
    const { name, value } = event.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  const aggregateTransactionsByDateRange = (details, startDate, endDate) => {
    const aggregatedTransactions = {};
    const start = moment(startDate).startOf("day").utc();
    const end = moment(endDate).endOf("day").utc();

    details.forEach((record) => {
      const date = moment(record.date).utc();
      if (date.isSameOrAfter(start) && date.isSameOrBefore(end)) {
        const formattedDate = date.format("YYYY-MM-DD");
        if (!aggregatedTransactions[formattedDate]) {
          aggregatedTransactions[formattedDate] = [];
        }
        aggregatedTransactions[formattedDate].push(record);
      }
    });
    return aggregatedTransactions;
  };

  const computeResults = (records, startDate, endDate, totalPresentDays) => {
    const results = {};
    let earningsTotal = 0;
    let deductionsTotal = 0;

    Object.values(records).forEach((recordsArray) => {
      recordsArray.forEach((record) => {
        record.details.forEach((head) => {
          let headValue = 0;

          switch (head.calculationType) {
            case "As User Defined Value":
              headValue = roundToTwoDecimals(
                (head.rate / head.totalDays) * totalPresentDays
              );
              break;
            case "As Manual Value":
              const totalHoursInMonth = head.totalDaysInMonth * 24; // 24 hours in a day
              const hourlyRate = head.rate / totalHoursInMonth;
              headValue = hourlyRate * (totals.totalHoursWorked || 0);
              break;
            case "Flat Rate":
              headValue = roundToTwoDecimals(head.rate);
              break;
            default:
              headValue = roundToTwoDecimals(head.rate);
              break;
          }

          const payHeadName =
            head.payHeadName || `Unknown Pay Head ${head.payHeadId}`;
          results[payHeadName] = (results[payHeadName] || 0) + headValue;

          if (head.payHeadType === "Earnings for Employees") {
            earningsTotal += headValue;
          } else if (
            head.payHeadType === "Deductions from Employees" ||
            head.payHeadType === "Employees Statutory Deduction" ||
            head.payHeadType === "Loans and Advances"
          ) {
            deductionsTotal += headValue;
          }
        });
      });
    });

    const totalSalary = roundToTwoDecimals(earningsTotal - deductionsTotal);
    return [
      {
        month: `${startDate} to ${endDate}`,
        results,
        totalSalary,
      },
    ];
  };

  const roundToTwoDecimals = (value) => Math.round(value * 100) / 100;

  if (!salaryResults) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="mb-4">
        <label htmlFor="startDate" className="mr-2">
          Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={startDate}
          onChange={handleDateRangeChange}
          className="border p-2"
        />
        <label htmlFor="endDate" className="ml-4 mr-2">
          End Date:
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={endDate}
          onChange={handleDateRangeChange}
          className="border p-2"
        />
      </div>
      {/* Render salary results here */}
    </>
  );
};

export default SpecificEmployeeSalaryCalculator;
