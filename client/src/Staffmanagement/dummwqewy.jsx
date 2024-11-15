import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetEmployeeDetailsByIdQuery } from "../store/api/StaffApi";
import { useGetPayHeadDetailsByIdQuery } from "../store/api/payHeadDetailsApi";
import { useGetAttendanceByIdQuery } from "../store/api/AttendenceApi";
import moment from "moment";

const formatDate = (dateString) => moment(dateString).format("MMMM DD, YYYY");

const AllEmployeeSalaryCalculator = () => {
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

  useEffect(() => {
    refetchEmployees();
    refetchAttendance();
    refetchPayHeadDetails();
  }, [
    employeeId,
    startDate,
    endDate,
    refetchEmployees,
    refetchAttendance,
    refetchPayHeadDetails,
  ]);

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

  if (!Array.isArray(payHeadDetails)) {
    console.error("payHeadDetails is not an array:", payHeadDetails);
    return null;
  }

  const manualValueDetails = payHeadDetails
    .flatMap((item) => (Array.isArray(item.details) ? item.details : []))
    .filter(
      (payHeadDetail) => payHeadDetail.calculationType === "As Manual Value"
    );
  const {
    totalPresentDays = 0,
    totalOvertime = 0,
    totalHoursWorked = 0,
  } = totals;

  const totalPresentDay = totalPresentDays;
  const totalHoursPerDay = 24;
  const earnings = manualValueDetails.length > 0 ? manualValueDetails[0] : {};
  const totalDaysInMonth = earnings.totalDays || 0;
  const totalHoursInMonth = totalHoursPerDay * totalDaysInMonth;
  const rate = earnings.rate || 0;
  const oneHourRate = rate / totalHoursInMonth;
  const breakDown = totalHoursInMonth - (totals.totalHoursWorked || 0);
  const totalOvertimes = totalOvertime || 0;
  console.log("totalOvertimes", totalOvertimes);
  const debitNames = payHeadDetails
    .flatMap((item) => (Array.isArray(item.details) ? item.details : []))
    .filter(
      (payHeadDetail) => payHeadDetail.payHeadType === "Earnings for Employees"
    )
    .map((payHeadDetail) => payHeadDetail.payHeadName);

  const isEarning = (key) => debitNames.includes(key);

  const aggregateTransactionsByDateRange = (details, startDate, endDate) => {
    console.log("Aggregating transactions with:", details, startDate, endDate);
    const aggregatedTransactions = {};
    const start = moment(startDate).startOf("day").utc();
    const end = moment(endDate).endOf("day").utc();

    details.forEach((record) => {
      const date = moment(record.date).utc();
      console.log("Processing record date:", record.date);
      console.log("Parsed date:", date.format());

      if (date.isSameOrAfter(start) && date.isSameOrBefore(end)) {
        const formattedDate = date.format("YYYY-MM-DD");
        if (!aggregatedTransactions[formattedDate]) {
          aggregatedTransactions[formattedDate] = [];
        }
        aggregatedTransactions[formattedDate].push(record);
      }
    });

    console.log("Aggregated Transactions:", aggregatedTransactions);
    return aggregatedTransactions;
  };

  const handleDateRangeChange = (event) => {
    const { name, value } = event.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  const computeResults = (records, month) => {
    console.log("records", records);
    const results = {};
    let earningsTotal = 0;
    let deductionsTotal = 0;

    Object.values(records).forEach((recordsArray) => {
      recordsArray.forEach((record) => {
        record.details.forEach((head) => {
          let headValue = 0;
          let hourlyRate = 0;

          switch (head.calculationType) {
            case "As User Defined Value":
              headValue = roundToTwoDecimals(
                (head.rate / head.totalDays) * totalPresentDay
              );
              break;
            case "As Manual Value":
              const totalHoursInMonth = head.totalDays * totalHoursPerDay;
              hourlyRate = parseFloat(
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
              headValue = roundToTwoDecimals(head.rate * totalOvertimes);
              break;
            default:
              headValue = roundToTwoDecimals(head.rate);
              break;
          }

          results[head.payHeadName] =
            (results[head.payHeadName] || 0) + headValue;

          if (head.payHeadType === "Earnings for Employees") {
            earningsTotal += headValue;
          } else if (
            head.payHeadType === "Deductions from Employees" ||
            head.payHeadType === "Employees Statutory Deduction" ||
            head.payHeadName === "Loans And Advance"
          ) {
            deductionsTotal += headValue;
          }
        });
      });
    });

    const totalSalary = roundToTwoDecimals(earningsTotal - deductionsTotal);

    return [
      {
        month,
        results,
        totalSalary,
      },
    ];
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

  if (!salaryResults) {
    return <p>Loading...</p>;
  }

  if (!Array.isArray(salaryResults)) {
    console.error(
      "Expected salaryResults to be an array, but got:",
      salaryResults
    );
    return <p>No salary results available</p>;
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

      <div>
        <div ref={componentRef}>
          {salaryResults.map((record, index) => {
            const { month, results, totalSalary } = record;
            const earnings = {};
            const deductions = {};

            for (const key in results) {
              if (isEarning(key)) {
                earnings[key] = results[key];
              } else {
                deductions[key] = results[key];
              }
            }

            const totalEarnings = Object.values(earnings).reduce(
              (sum, value) => sum + value,
              0
            );
            const totalDeductions = Object.values(deductions).reduce(
              (sum, value) => sum + value,
              0
            );
            const netPay = totalEarnings - totalDeductions;

            return (
              <div
                key={index}
                className="max-w-4xl print-container mx-auto p-4 border-2 mb-6 border-gray-300 rounded-lg shadow-lg mt-20 bg-blue-300"
              >
                <h2 className="text-center text-xl font-bold">
                  SS Mobile Solution proprietorship firm
                </h2>
                <p className="text-center">
                  2nd Floor, B&C Wing, SMR Vinay Estates, Commercial Complex,
                  Outer Ring Road,
                </p>
                <p className="text-center font-bold mt-2">
                  Pay Slip for the period of {formatDate(month)}
                </p>
                {employees && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p>
                        <span className="font-bold">Employee Id:</span>{" "}
                        {employees.employeeId}
                      </p>
                      <p>
                        <span className="font-bold">Name:</span>{" "}
                        {employees.name}
                      </p>
                      <p>
                        <span className="font-bold">Department:</span>{" "}
                        {employees.department}
                      </p>
                      <p>
                        <span className="font-bold">Date Of Joining:</span>{" "}
                        {formatDate(employees.dateOfHire)}
                      </p>
                      <p>
                        <span className="font-bold">Designation:</span>{" "}
                        {employees.designation}
                      </p>
                      <p>
                        <span className="font-bold">Address:</span>{" "}
                        {employees.address}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-bold">Account Name:</span>{" "}
                        {employees.bankDetails?.bankName || "-"}
                      </p>
                      <p>
                        <span className="font-bold">Account Number:</span>{" "}
                        {employees.bankDetails?.accountNumber || "-"}
                      </p>
                      <p>
                        <span className="font-bold">IFSC Code:</span>{" "}
                        {employees.bankDetails?.ifscCode || "-"}
                      </p>
                      <p>
                        <span className="font-bold">Mobile:</span>{" "}
                        {employees.contact?.phone || "-"}
                      </p>
                      <p>
                        <span className="font-bold">
                          Father's/Husband's Name:
                        </span>{" "}
                        -
                      </p>
                      <p>
                        <span className="font-bold">Casual Leave:</span> -
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-4 grid grid-cols-2 gap-4 border-t-2 border-b-2 border-gray-600">
                  <div>
                    <p className="font-bold">Earnings:</p>
                    <div>
                      {Object.keys(earnings).map((key) => (
                        <div key={key} className="flex justify-between w-full">
                          <span>{key}</span>
                          <span>{earnings[key]}</span>
                        </div>
                      ))}
                      {manualValueDetails.length > 0 && (
                        <div>
                          <div className="flex justify-between w-full">
                            <span>Total rent</span>
                            <span>{rate.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between w-full">
                            <span>1 hour rent:</span>
                            <span>{oneHourRate.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between w-full">
                            <span>Total Present Days:</span>
                            <span>{totals.totalPresentDays.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between w-full">
                            <span>Total Overtime:</span>
                            <span>{totalOvertimes.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between w-full">
                            <span>Overtime rate :</span>
                            <span>{oneHourRate.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between w-full">
                            <span>Total Hours Worked:</span>
                            <span>
                              {(totals.totalHoursWorked || 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between w-full">
                            <span>Total Hours Per Day:</span>
                            <span>{totalHoursPerDay.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between w-full">
                            <span>Total Days in Month:</span>
                            <span>{totalDaysInMonth.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between w-full">
                            <span>Total Hours in Month:</span>
                            <span>{totalHoursInMonth.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between w-full">
                            <span>Total breakdown in Month:</span>
                            <span>{breakDown.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold">Deductions:</p>
                    {Object.keys(deductions).map((key) => (
                      <div key={key} className="flex justify-between">
                        <span>{key}</span>
                        <span>{deductions[key]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between">
                    <span>Total Earnings:</span>
                    <span>{(totalEarnings + totalOvertimes).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Deductions:</span>
                    <span>{totalDeductions.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Pay:</span>
                    <span>{(netPay + totalOvertimes).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AllEmployeeSalaryCalculator;
