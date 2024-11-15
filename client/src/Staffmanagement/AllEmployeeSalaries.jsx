import React, { useEffect, useState, useRef } from "react";
import { useGetAllEmployeesQuery } from "../store/api/StaffApi";
import { useGetPayHeadDetailsQuery } from "../store/api/payHeadDetailsApi";
import { useGetAttendancesByParamsQuery } from "../store/api/AttendenceApi";
import { useGetAllUsersQuery } from "../store/api/userapi";
import moment from "moment";
import { useSalaryContext } from "../Staffmanagement/SalaryContext"; // Import the context

const formatDate = (dateString) => moment(dateString).format("MMMM DD, YYYY");

const AllEmployeeSalaryCalculator = () => {
  const currentMonthStart = moment().startOf("month").format("YYYY-MM-DD");
  const currentMonthEnd = moment().endOf("month").format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(currentMonthStart);
  const [endDate, setEndDate] = useState(currentMonthEnd);
  const [salaryResults, setSalaryResults] = useState([]);

  const [searchName, setSearchName] = useState(""); // State for search input

  const { data: employees = [], refetch: refetchEmployees } =
    useGetAllEmployeesQuery();
  const { data: payHeadDetails = [], refetch: refetchPayHeadDetails } =
    useGetPayHeadDetailsQuery({ startDate, endDate });
  const { data: attendances = [], refetch: refetchAttendances } =
    useGetAttendancesByParamsQuery({ startDate, endDate });
  console.log("attendance...........................", attendances);
  const { data: usersListUser } = useGetAllUsersQuery();
  console.log("payHeadDetails...........................", payHeadDetails);
  const componentRef = useRef();

  useEffect(() => {
    refetchEmployees();
    refetchPayHeadDetails();
    refetchAttendances();
  }, [
    startDate,
    endDate,
    refetchEmployees,
    refetchPayHeadDetails,
    refetchAttendances,
    payHeadDetails,
    attendances,
  ]);

  const { setSalaryData } = useSalaryContext(); // Get the context function
  useEffect(() => {
    // Check if data is available
    if (!payHeadDetails.length || !attendances.length) {
      console.log("Waiting for pay head details or attendances to load...");
      return; // Early return if data is not available
    }

    console.log("Pay Head Details:", payHeadDetails);
    console.log("Attendances:", attendances);

    const validEmployeeIds = new Set(
      payHeadDetails.map((head) => head.employeeId)
    );

    // Filter employees based on valid IDs
    const filteredEmployees = employees.filter((employee) =>
      validEmployeeIds.has(employee._id)
    );

    if (!filteredEmployees.length) {
      console.log("No valid employees found.");
      return; // No employees to process
    }

    const results = filteredEmployees.map((employee) => {
      const employeePayHeads = payHeadDetails.filter(
        (head) => head.employeeId === employee._id
      );

      const employeeAttendances = attendances.filter((att) => {
        const attendanceDate = moment(att.date);
        return attendanceDate.isBetween(startDate, endDate, undefined, "[]");
      });

      // Check for empty pay heads and attendances before proceeding
      if (!employeePayHeads.length && !employeeAttendances.length) {
        return {
          employee,
          totalSalary: 0,
          totalEarnings: 0,
          // Any other default fields
        };
      }

      // Handle the case where only pay heads or attendances are missing
      if (!employeePayHeads.length || !employeeAttendances.length) {
        return {
          employee,
          totalSalary: 0,
          totalEarnings: 0,
          // Other defaults as necessary
        };
      }

      const totalAttendance = employeeAttendances.reduce(
        (summary, att) => {
          summary.totalHoursWorked += att.dutyHours || 0;
          summary.totalOvertime += att.overtime || 0;
          summary.totalPresentDays += att.status === "Present" ? 1 : 0;
          summary.subtotalDaysWorked += att.totalDaysWorked || 0;
          return summary;
        },
        {
          totalHoursWorked: 0,
          totalOvertime: 0,
          totalPresentDays: 0,
          subtotalDaysWorked: 0,
        }
      );

      const computedResults = computeResults(employeePayHeads, totalAttendance);

      return {
        employee,
        ...computedResults,
      };
    });

    // Update state with results if data is available
    if (results.length) {
      setSalaryResults(results);
      setSalaryData(results); // Save salary results in context
    } else {
      setSalaryResults("");
      setSalaryData(""); // Clear salary results in context if no results
    }
  }, [
    payHeadDetails,
    attendances,
    employees,
    startDate,
    endDate,
    setSalaryData,
  ]);

  console.log("Date range:", startDate, endDate);

  console.log("Employee Pay Heads:", payHeadDetails);
  console.log("Employee Attendances:", attendances);

  console.log("Computed Results:", salaryResults);

  const computeResults = (records, month) => {
    console.log("Records:", records);
    console.log("subtotalDaysWorked", month.subtotalDaysWorked);
    const results = {};
    const manualValueDetails = [];
    let earningsTotal = 0;
    let deductionsTotal = 0;

    records.forEach((record) => {
      if (!Array.isArray(record.details)) {
        console.error(
          "Expected record.details to be an array but got:",
          record.details
        );
        return;
      }

      record.details.forEach((head) => {
        if (typeof head.rate === "undefined") {
          console.error("Rate is undefined for pay head:", head);
          return;
        }

        let headValue = 0;
        let hourlyRate = 0;

        switch (head.calculationType) {
          case "As User Defined Value":
            headValue = roundToTwoDecimals(
              (head.rate / (head.totalDays || 1)) *
                (month.subtotalDaysWorked || month.totalPresentDays || 0)
            );
            break;

          case "As Manual Value":
            const totalHoursInMonth =
              (head.totalDaysPerMonth || 0) * (head.totalHoursPerDay || 0);
            hourlyRate = roundToTwoDecimals(
              (head.rate || 0) / (totalHoursInMonth || 1)
            );
            console.log("head", totalHoursInMonth);
            headValue = hourlyRate * (month.totalHoursWorked || 0);
            manualValueDetails.push({
              label: ` ${head.payHeadName}`,
              rate: head.rate,
              oneHourRate: hourlyRate,
              totalPresentDays: month.totalPresentDays || 0,
              totalOvertime: month.totalOvertime || 0,
              totalHoursWorked: month.totalHoursWorked || 0,
              totalHoursPerDay: head.totalHoursPerDay || 0,
              totalbreakDown: totalHoursInMonth - month.totalHoursWorked || 0,
              totalDays: head.totalDaysPerMonth || 0,
            });
            break;

          case "As Computed Value":
            headValue = roundToTwoDecimals(computeComputedValue(head, results));
            break;

          case "Flat Rate":
            headValue = roundToTwoDecimals(head.rate);
            break;

          case "On Production":
            headValue = roundToTwoDecimals(
              head.rate * (month.totalOvertime || 0)
            );
            break;

          default:
            console.warn(`Unhandled calculation type: ${head.calculationType}`);
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

    const totalSalary = roundToTwoDecimals(earningsTotal - deductionsTotal);

    return {
      month,
      results,
      totalSalary,
      totalEarnings: earningsTotal,
      totalDeductions: deductionsTotal,
      manualValueDetails,
    };
  };

  const computeComputedValue = (head, results) => {
    const { computedOn, rate } = head;
    console.log("head", computedOn);
    console.log("rate", rate);
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
    console.log("baseValue", baseValue);
    try {
      baseValue = eval(expression);
    } catch (e) {
      console.error("Error evaluating expression:", e);
    }

    const computedValue = (baseValue * rate) / 100;
    return isNaN(computedValue) ? 0 : computedValue;
  };

  const roundToTwoDecimals = (value) => Math.round(value * 100) / 100;

  const handleDateRangeChange = (event) => {
    const { name, value } = event.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  const debitNamesSet = new Set(
    payHeadDetails
      .flatMap((item) => item.details || [])
      .filter(
        (payHeadDetail) =>
          payHeadDetail.payHeadType === "Earnings for Employees"
      )
      .map((payHeadDetail) => payHeadDetail.payHeadName)
  );

  const isEarning = (key) => debitNamesSet.has(key);
  const handlePrint = () => {
    window.print();
  };
  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

  const filteredResults =
    payHeadDetails.length && attendances.length && Array.isArray(salaryResults)
      ? salaryResults.filter((record) =>
          record.employee.name.toLowerCase().includes(searchName.toLowerCase())
        )
      : [];

  if (!payHeadDetails.length && !attendances.length) {
    return (
      <div>
        {" "}
        <label htmlFor="startDate" className="mr-2">
          Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={startDate}
          onChange={handleDateRangeChange}
          className="border p-2 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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
          className="border p-2 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex mb-4">
        <div>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchName}
            onChange={handleSearchChange}
            className="border p-2 mr-4 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
          <label htmlFor="startDate" className="mr-2">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={handleDateRangeChange}
            className="border p-2 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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
            className="border p-2 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>
        <button
          onClick={handlePrint}
          className="p-2 mb-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-md print-button"
          disabled={salaryResults.length === 0}
        >
          Print
        </button>
      </div>

      <div ref={componentRef}>
        {filteredResults.map((record, index) => {
          const { employee, month, results, totalSalary, manualValueDetails } =
            record;

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

          return (
            <div
              key={index}
              className="max-w-4xl mx-auto printable-area p-4 border-2 mb-6 border-gray-300 rounded-lg shadow-lg bg-white dark:bg-gray-900"
            >
              <h2 className="text-center text-xl font-bold">
                {usersListUser?.user?.companyName}
              </h2>
              <p className="text-center">{usersListUser?.user?.address}</p>
              <p className="text-center">
                Gst Number : {""}
                {usersListUser.user.gstNumber}
              </p>
              <p className="text-center">
                Mobile Number : {""}
                {usersListUser.user.mobileNumber}
              </p>
              <p className="text-center font-bold mt-2">
                Pay Slip for the period of {formatDate(month)}
              </p>

              {employee && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p>
                      <span className="font-bold">Employee Id:</span>{" "}
                      {employee.employeeId}
                    </p>
                    <p>
                      <span className="font-bold">Name:</span> {employee.name}
                    </p>
                    <p>
                      <span className="font-bold">Department:</span>{" "}
                      {employee.department}
                    </p>
                    <p>
                      <span className="font-bold">Date Of Joining:</span>{" "}
                      {formatDate(employee.dateOfHire)}
                    </p>
                    <p>
                      <span className="font-bold">Designation:</span>{" "}
                      {employee.designation}
                    </p>
                    <p>
                      <span className="font-bold">Address:</span>{" "}
                      {employee.address}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-bold">Account Name:</span>{" "}
                      {employee.bankDetails?.bankName || "-"}
                    </p>
                    <p>
                      <span className="font-bold">Account Number:</span>{" "}
                      {employee.bankDetails?.accountNumber || "-"}
                    </p>
                    <p>
                      <span className="font-bold">IFSC Code:</span>{" "}
                      {employee.bankDetails?.ifscCode || "-"}
                    </p>
                    <p>
                      <span className="font-bold">Mobile:</span>{" "}
                      {employee.contact?.phone || "-"}
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
                        <span>{earnings[key].toFixed(2)}</span>
                      </div>
                    ))}
                    {manualValueDetails?.length > 0 && (
                      <div>
                        {manualValueDetails.map((detail, i) => (
                          <div key={i}>
                            {/* Add details */}
                            <div className="flex justify-between w-full">
                              <span>{detail.label} fixed</span>
                              <span>{detail.rate.toFixed(2)}</span>
                            </div>
                            {/* Additional details */}
                          </div>
                        ))}
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
                  <span>{totalEarnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Deductions:</span>
                  <span>{totalDeductions.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Pay:</span>
                  <span>{totalSalary.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AllEmployeeSalaryCalculator;
