import React, { useEffect, useState } from "react";
import { useGetAttendancesByParamsQuery } from "../store/api/AttendenceApi";
import { useGetPayHeadDetailsQuery } from "../store/api/payHeadDetailsApi";
import { useGetAllEmployeesQuery } from "../store/api/StaffApi";
import moment from "moment";

const formatDate = (dateString) => moment(dateString).format("MMMM DD, YYYY");

const AttendanceList = ({
  employeeId,
  startDate,
  endDate,
  setSalaryResults,
}) => {
  const {
    data: attendances = [],
    error,
    isLoading,
  } = useGetAttendancesByParamsQuery({ employeeId, startDate, endDate });
  const { data: payHeadDetails = [] } = useGetPayHeadDetailsQuery();
  const { data: employees = [] } = useGetAllEmployeesQuery();

  useEffect(() => {
    if (payHeadDetails.length && attendances.length && employees.length) {
      const transformedAttendanceData = transformAttendanceData(attendances);

      const results = employees
        .map((employee) => {
          if (employee._id !== employeeId) return null;

          const employeePayHeadDetails = payHeadDetails.filter(
            (head) => head.employeeId === employee._id
          );

          const employeeTotals = transformedAttendanceData[employee._id] || {};
          const aggregatedDetails = aggregateTransactionsByDateRange(
            employeePayHeadDetails,
            startDate,
            endDate
          );

          return computeResults(
            aggregatedDetails,
            startDate,
            endDate,
            employeeTotals,
            employee
          );
        })
        .filter(Boolean);

      setSalaryResults(results);
    }
  }, [
    attendances,
    payHeadDetails,
    employees,
    startDate,
    endDate,
    employeeId,
    setSalaryResults,
  ]);

  const transformAttendanceData = (data) => {
    const transformed = {};
    data.forEach((record) => {
      const employeeId = record.employeeId;
      if (!transformed[employeeId]) {
        transformed[employeeId] = {
          totalPresentDays: 0,
          totalHoursWorked: 0,
          totalOvertime: 0,
        };
      }
      const attendance = transformed[employeeId];
      if (record.status === "Present") {
        attendance.totalPresentDays += 1;
        attendance.totalHoursWorked += record.dutyHours || 0;
        attendance.totalOvertime += record.overtime || 0;
      }
    });
    return transformed;
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

  const computeResults = (records, startDate, endDate, totals, employee) => {
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
                (head.rate / head.totalDays) * totals.totalPresentDays
              );
              break;
            case "As Manual Value":
              const totalHoursInMonth = head.totalDays * 24;
              const hourlyRate = parseFloat(
                (head.rate / totalHoursInMonth).toFixed(2)
              );
              headValue = hourlyRate * (totals.totalHoursWorked || 0);
              break;
            case "As Computed Value":
              headValue = roundToTwoDecimals(
                computeComputedValue(head, results)
              );
              break;
            case "Flat Rate":
              headValue = roundToTwoDecimals(head.rate);
              break;
            case "On Production":
              headValue = roundToTwoDecimals(head.rate * totals.totalOvertime);
              break;
            default:
              headValue = roundToTwoDecimals(head.rate);
              break;
          }

          if (head.payHeadType === "Earnings for Employees") {
            earningsTotal += headValue;
            results[head.payHeadName] =
              (results[head.payHeadName] || 0) + headValue;
          } else if (
            head.payHeadType === "Deductions from Employees" ||
            head.payHeadType === "Employees Statutory Deduction"
          ) {
            deductionsTotal += headValue;
            results[head.payHeadName] =
              (results[head.payHeadName] || 0) + headValue;
          } else {
            results[head.payHeadName] =
              (results[head.payHeadName] || 0) + headValue;
          }
        });
      });
    });

    const totalSalary = roundToTwoDecimals(earningsTotal - deductionsTotal);

    return {
      employee,
      results,
      totalSalary,
    };
  };

  const computeComputedValue = (head, results) => {
    const { computedOn, rate } = head;
    if (!computedOn || typeof computedOn !== "string") {
      console.error(`Invalid computedOn value for ${head.payHeadName}`);
      return 0;
    }

    let expression = computedOn;
    Object.keys(results).forEach((key) => {
      const value = results[key] || 0;
      expression = expression.replace(new RegExp(`\\b${key}\\b`, "g"), value);
    });

    let baseValue = 0;
    try {
      baseValue = eval(expression);
    } catch (e) {
      console.error("Error evaluating expression:", e);
    }

    const computedValue = (baseValue * rate) / 100;
    return isNaN(computedValue) ? 0 : computedValue;
  };

  const roundToTwoDecimals = (value) => Math.round(value * 100) / 100;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading attendance data.</p>;
  }

  return null; // No specific UI in this component
};

export default AttendanceList;
