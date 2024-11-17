// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { useGetEmployeeDetailsByIdQuery } from "../store/api/StaffApi";
// import { useGetPayHeadDetailsByIdQuery } from "../store/api/payHeadDetailsApi";
// import { useGetAttendanceByIdQuery } from "../store/api/AttendenceApi";
// import moment from "moment";

// const formatDate = (dateString) => moment(dateString).format("MMMM DD, YYYY");

// const SpecificEmployeeSalaryCalculator = () => {
//   const { employeeId } = useParams();
//   const currentMonthStart = moment().startOf("month").format("YYYY-MM-DD");
//   const currentMonthEnd = moment().endOf("month").format("YYYY-MM-DD");
//   const [startDate, setStartDate] = useState(currentMonthStart);
//   const [endDate, setEndDate] = useState(currentMonthEnd);
//   const [salaryResults, setSalaryResults] = useState(null);

//   const { data: employees, refetch: refetchEmployees } =
//     useGetEmployeeDetailsByIdQuery(employeeId);
//   const { data: totals = {}, refetch: refetchAttendance } =
//     useGetAttendanceByIdQuery({ id: employeeId, startDate, endDate });

//   const {
//     totalHoursWorked = 0,
//     totalOvertime = 0,
//     totalPresentDays = 0,
//   } = totals;

//   const { data: payHeadDetails = [], refetch: refetchPayHeadDetails } =
//     useGetPayHeadDetailsByIdQuery(employeeId);

//   const componentRef = useRef();

//   useEffect(() => {
//     refetchEmployees();
//     refetchAttendance();
//     refetchPayHeadDetails();
//   }, [
//     employeeId,
//     startDate,
//     endDate,
//     refetchEmployees,
//     refetchAttendance,
//     refetchPayHeadDetails,
//   ]);

//   useEffect(() => {
//     if (payHeadDetails.length && totals) {
//       const aggregatedDetails = aggregateTransactionsByDateRange(
//         payHeadDetails,
//         startDate,
//         endDate
//       );

//       const results = computeResults(
//         aggregatedDetails,
//         startDate,
//         endDate,
//         totals.totalPresentDays
//       );
//       setSalaryResults(results);
//     }
//   }, [payHeadDetails, totals, startDate, endDate]);

//   if (!Array.isArray(payHeadDetails)) {
//     return null;
//   }

//   const manualValueDetails = payHeadDetails
//     .flatMap((item) => (Array.isArray(item.details) ? item.details : []))
//     .filter(
//       (payHeadDetail) => payHeadDetail.calculationType === "As Manual Value"
//     );

//   // const totalPresentDay = totalPresentDays || 0;
//   const totalHoursPerDay = 24;
//   const earnings = manualValueDetails.length > 0 ? manualValueDetails[0] : {};

//   const totalDaysInMonth = earnings.totalDays || 0;
//   const totalHoursInMonth = totalHoursPerDay * totalDaysInMonth;
//   const rate = earnings.rate || 0;
//   const oneHourRate = rate / totalHoursInMonth;
//   const breakDown = totalHoursInMonth - (totals.totalHoursWorked || 0);
//   const totalOvertimes = totalOvertime * oneHourRate || 0;

//   const debitNames = payHeadDetails
//     .flatMap((item) => (Array.isArray(item.details) ? item.details : []))
//     .filter(
//       (payHeadDetail) => payHeadDetail.payHeadType === "Earnings for Employees"
//     )
//     .map((payHeadDetail) => payHeadDetail.payHeadName);

//   const isEarning = (key) => debitNames.includes(key);

//   const aggregateTransactionsByDateRange = (details, startDate, endDate) => {
//     const aggregatedTransactions = {};
//     const start = moment(startDate).startOf("day").utc();
//     const end = moment(endDate).endOf("day").utc();

//     details.forEach((record) => {
//       const date = moment(record.date).utc();

//       if (date.isSameOrAfter(start) && date.isSameOrBefore(end)) {
//         const formattedDate = date.format("YYYY-MM-DD");
//         if (!aggregatedTransactions[formattedDate]) {
//           aggregatedTransactions[formattedDate] = [];
//         }
//         aggregatedTransactions[formattedDate].push(record);
//       }
//     });

//     return aggregatedTransactions;
//   };

//   const handleDateRangeChange = (event) => {
//     const { name, value } = event.target;
//     if (name === "startDate") {
//       setStartDate(value);
//     } else if (name === "endDate") {
//       setEndDate(value);
//     }
//   };

//   const computeResults = (records, month) => {
//     const results = {};
//     let earningsTotal = 0;
//     let deductionsTotal = 0;

//     Object.values(records).forEach((recordsArray) => {
//       recordsArray.forEach((record) => {
//         record.details.forEach((head) => {
//           let headValue = 0;
//           let hourlyRate = 0;

//           switch (head.calculationType) {
//             case "As User Defined Value":
//               headValue = roundToTwoDecimals(
//                 (head.rate / head.totalDays) * totalPresentDays
//               );
//               break;
//             case "As Manual Value":
//               console.log("hai");
//               const totalHoursInMonth = head.totalDays * totalHoursPerDay;
//               hourlyRate = parseFloat(
//                 (head.rate / totalHoursInMonth).toFixed(2)
//               );
//               headValue = hourlyRate * (totalHoursWorked || 0);
//               break;
//             case "As Computed Value":
//               headValue = roundToTwoDecimals(
//                 computeComputedValue(head, results)
//               );
//               break;
//             case "Flat Rate":
//               headValue = roundToTwoDecimals(head.rate);
//               break;
//             case "On Production":
//               headValue = roundToTwoDecimals(head.rate * totalOvertime);
//               break;
//             default:
//               headValue = roundToTwoDecimals(head.rate);
//               break;
//           }

//           // Add the check for payHeadName here
//           if (!head.payHeadName) {
//             console.error(
//               `payHeadName is missing for head with id ${head.payHeadId}`
//             );
//           }

//           // Ensure payHeadName is defined and fallback to a default if missing
//           const payHeadName =
//             head.payHeadName || `Unknown Pay Head ${head.payHeadId}`;

//           results[payHeadName] = (results[payHeadName] || 0) + headValue;

//           if (head.payHeadType === "Earnings for Employees") {
//             earningsTotal += headValue;
//           } else if (
//             head.payHeadType === "Deductions from Employees" ||
//             head.payHeadType === "Employees Statutory Deduction" ||
//             head.payHeadType === "Loans and Advances"
//           ) {
//             deductionsTotal += headValue;
//           }
//         });
//       });
//     });

//     const totalSalary = roundToTwoDecimals(earningsTotal - deductionsTotal);

//     return [
//       {
//         month,
//         results,
//         totalSalary,
//       },
//     ];
//   };

//   const computeComputedValue = (head, results) => {
//     const { computedOn, rate } = head;

//     if (!computedOn || typeof computedOn !== "string") {
//       console.error(`Invalid computedOn value for ${head.payHeadName}`);
//       return 0;
//     }

//     let expression = computedOn;

//     Object.keys(results).forEach((key) => {
//       const value = results[key] || 0;
//       expression = expression.replace(new RegExp(`\\b${key}\\b`, "g"), value);
//     });

//     let baseValue = 0;
//     try {
//       baseValue = eval(expression);
//     } catch (e) {
//       console.error("Error evaluating expression:", e);
//     }

//     const computedValue = (baseValue * rate) / 100;
//     return isNaN(computedValue) ? 0 : computedValue;
//   };

//   const roundToTwoDecimals = (value) => Math.round(value * 100) / 100;

//   if (!salaryResults) {
//     return <p>Loading...</p>;
//   }

//   if (!Array.isArray(salaryResults)) {
//     console.error(
//       "Expected salaryResults to be an array, but got:",
//       salaryResults
//     );
//     return <p>No salary results available</p>;
//   }

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <>
//       <div className="mb-4">
//         <label htmlFor="startDate" className="mr-2">
//           Start Date:
//         </label>
//         <input
//           type="date"
//           id="startDate"
//           name="startDate"
//           value={startDate}
//           onChange={handleDateRangeChange}
//           className="border p-2"
//         />
//         <label htmlFor="endDate" className="ml-4 mr-2">
//           End Date:
//         </label>
//         <input
//           type="date"
//           id="endDate"
//           name="endDate"
//           value={endDate}
//           onChange={handleDateRangeChange}
//           className="border p-2"
//         />
//       </div>

//       <button
//         onClick={handlePrint}
//         className="p-2 mb-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-md"
//       >
//         Print
//       </button>

//       <div className="bg-white dark:bg-gray-900 border-2 mb-6 rounded-lg shadow-lg mt-10 border-gray-300 dark:border-gray-600">
//         <div ref={componentRef}>
//           {salaryResults.map((record, index) => {
//             const { month, results, totalSalary } = record;
//             const earnings = {};
//             const deductions = {};

//             for (const key in results) {
//               if (isEarning(key)) {
//                 earnings[key] = results[key];
//               } else {
//                 deductions[key] = results[key];
//               }
//             }

//             const totalEarnings = Object.values(earnings).reduce(
//               (sum, value) => sum + value,
//               0
//             );
//             const totalDeductions = Object.values(deductions).reduce(
//               (sum, value) => sum + value,
//               0
//             );
//             const netPay = totalEarnings - totalDeductions;

//             return (
//               <div
//                 key={index}
//                 className="max-w-4xl mx-auto p-4 border-2 mb-6 rounded-lg shadow-lg mt-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
//               >
//                 <h2 className="text-center text-xl font-bold">
//                   SS Mobile Solution proprietorship firm
//                 </h2>
//                 <p className="text-center">
//                   2nd Floor, B&C Wing, SMR Vinay Estates, Commercial Complex,
//                   Outer Ring Road,
//                 </p>
//                 <p className="text-center font-bold mt-2">
//                   Pay Slip for the period of {formatDate(month)}
//                 </p>
//                 {employees && (
//                   <div className="mt-4 grid grid-cols-2 gap-4">
//                     <div>
//                       <p>
//                         <span className="font-bold">Employee Id:</span>{" "}
//                         {employees.employeeId}
//                       </p>
//                       <p>
//                         <span className="font-bold">Name:</span>{" "}
//                         {employees.name}
//                       </p>
//                       <p>
//                         <span className="font-bold">Department:</span>{" "}
//                         {employees.department}
//                       </p>
//                       <p>
//                         <span className="font-bold">Date Of Joining:</span>{" "}
//                         {formatDate(employees.dateOfHire)}
//                       </p>
//                       <p>
//                         <span className="font-bold">Designation:</span>{" "}
//                         {employees.designation}
//                       </p>
//                       <p>
//                         <span className="font-bold">Address:</span>{" "}
//                         {employees.address}
//                       </p>
//                     </div>
//                     <div>
//                       <p>
//                         <span className="font-bold">Account Name:</span>{" "}
//                         {employees.bankDetails?.bankName || "-"}
//                       </p>
//                       <p>
//                         <span className="font-bold">Account Number:</span>{" "}
//                         {employees.bankDetails?.accountNumber || "-"}
//                       </p>
//                       <p>
//                         <span className="font-bold">IFSC Code:</span>{" "}
//                         {employees.bankDetails?.ifscCode || "-"}
//                       </p>
//                       <p>
//                         <span className="font-bold">Mobile:</span>{" "}
//                         {employees.contact?.phone || "-"}
//                       </p>
//                       <p>
//                         <span className="font-bold">
//                           Father's/Husband's Name:
//                         </span>{" "}
//                         -
//                       </p>
//                       <p>
//                         <span className="font-bold">Casual Leave:</span> -
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 <div className="mt-4 grid grid-cols-2 gap-4 border-t-2 border-b-2 border-gray-600">
//                   <div>
//                     <p className="font-bold">Earnings:</p>
//                     <div>
//                       {Object.keys(earnings).map((key) => (
//                         <div key={key} className="flex justify-between w-full">
//                           <span>{key}</span>
//                           <span>{earnings[key]}</span>
//                         </div>
//                       ))}

//                       {manualValueDetails.length > 0 && (
//                         <div>
//                           <div className="flex justify-between w-full">
//                             <span>Total rent</span>
//                             <span>{rate.toFixed(2)}</span>
//                           </div>
//                           <div className="flex justify-between w-full">
//                             <span>1 hour rent:</span>
//                             <span>{oneHourRate.toFixed(2)}</span>
//                           </div>
//                           <div className="flex justify-between w-full">
//                             <span>Total Present Days:</span>
//                             <span>{totals.totalPresentDays}</span>
//                           </div>

//                           <div className="flex justify-between w-full">
//                             <span>Overtime rate :</span>
//                             <span>{oneHourRate.toFixed(2)}</span>
//                           </div>
//                           <div className="flex justify-between w-full">
//                             <span>Total Hours Worked:</span>
//                             <span>
//                               {(totals.totalHoursWorked || 0).toFixed(2)}
//                             </span>
//                           </div>
//                           <div className="flex justify-between w-full">
//                             <span>Total Hours Per Day:</span>
//                             <span>{totalHoursPerDay.toFixed(2)}</span>
//                           </div>
//                           <div className="flex justify-between w-full">
//                             <span>Total Days in Month:</span>
//                             <span>{totalDaysInMonth.toFixed(2)}</span>
//                           </div>
//                           <div className="flex justify-between w-full">
//                             <span>Total Hours in Month:</span>
//                             <span>{totalHoursInMonth.toFixed(2)}</span>
//                           </div>
//                           <div className="flex justify-between w-full">
//                             <span>Total breakdown in Month:</span>
//                             <span>{breakDown.toFixed(2)}</span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <p className="font-bold">Deductions:</p>
//                     {Object.keys(deductions).map((key) => (
//                       <div key={key} className="flex justify-between">
//                         <span>{key}</span>
//                         <span>{deductions[key]}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <div className="flex justify-between">
//                     <span>Total Earnings:</span>
//                     <span>{totalEarnings.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Total Deductions:</span>
//                     <span>{totalDeductions.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Net Pay:</span>
//                     <span>{totalSalary.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SpecificEmployeeSalaryCalculator;
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetEmployeeDetailsByIdQuery } from "../store/api/StaffApi";
import { useGetPayHeadDetailsByIdQuery } from "../store/api/payHeadDetailsApi";
import { useGetAttendanceByIdQuery } from "../store/api/AttendenceApi";
import { useGetSingleUserQuery } from "../store/api/userapi";
import moment from "moment";

const formatDate = (dateString) => moment(dateString).format("MMMM DD, YYYY");

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
    useGetAttendanceByIdQuery({
      id: employeeId,
      startDate: startDate,
      endDate: endDate,
    });

  const { data: usersListUser, refetch } = useGetSingleUserQuery(employeeId);
  useEffect(() => {
    refetch();
  }, [refetch]);
  // Ensure totals is an array to avoid errors
  const totalAttendance = Array.isArray(totals)
    ? totals.reduce(
        (summary, att) => {
          summary.totalHoursWorked += att.dutyHours || 0;
          summary.totalOvertime += att.overtime || 0;
          summary.totalDaysWorked += att.totalDaysWorked || 0;
          summary.totalPresentDays += att.status === "Present" ? 1 : 0;
          summary.subtotalDaysWorked += att.totalDaysWorked || 0;
          return summary;
        },
        {
          totalDaysWorked: 0,
          totalHoursWorked: 0,
          totalOvertime: 0,
          totalPresentDays: 0,
          subtotalDaysWorked: 0,
        }
      )
    : {
        totalHoursWorked: 0,
        totalOvertime: 0,
        totalPresentDays: 0,
        subtotalDaysWorked: 0,
        totalDaysWorked: 0,
      };

  // Destructure the results
  const {
    totalHoursWorked,
    totalOvertime,
    totalPresentDays,
    subtotalDaysWorked,
    totalDaysWorked,
  } = totalAttendance;

  console.log(
    totalHoursWorked,
    totalOvertime,
    totalPresentDays,
    subtotalDaysWorked,
    totalDaysWorked
  );

  const { data: payHeadDetails = [], refetch: refetchPayHeadDetails } =
    useGetPayHeadDetailsByIdQuery({
      employeeId,
      startDate: startDate,
      endDate: endDate,
    });
  console.log("payHeadDetails", payHeadDetails);
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
  // useEffect(() => {
  //   if (employeeId) {
  //     // Use promise chaining to refetch the data only once per cycle
  //     refetchEmployees()
  //       .then(() => refetchAttendance())
  //       .then(() => refetchPayHeadDetails());
  //   }
  // }, [employeeId, refetchEmployees, refetchAttendance, refetchPayHeadDetails]);
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

  if (!Array.isArray(payHeadDetails)) {
    return null;
  }

  const manualValueDetails = payHeadDetails
    .flatMap((item) => (Array.isArray(item.details) ? item.details : []))
    .filter(
      (payHeadDetail) => payHeadDetail.calculationType === "As Manual Value"
    );

  // const totalPresentDay = totalPresentDays || 0;
  const totalHoursPerDay = 24;
  const earnings = manualValueDetails.length > 0 ? manualValueDetails[0] : {};

  const totalDaysInMonth = earnings.totalDaysPerMonth || 0;
  console.log("totalDaysInMonth", earnings);
  const totalHoursInMonth = earnings.totalHoursPerDay * totalDaysInMonth;
  const rate = earnings.rate || 0;
  const oneHourRate = rate / totalHoursInMonth;
  const breakDown = totalHoursInMonth - (totals.totalHoursWorked || 0);
  const totalOvertimes = totalOvertime * oneHourRate || 0;

  const debitNames = payHeadDetails
    .flatMap((item) => (Array.isArray(item.details) ? item.details : []))
    .filter(
      (payHeadDetail) => payHeadDetail.payHeadType === "Earnings for Employees"
    )
    .map((payHeadDetail) => payHeadDetail.payHeadName);

  const isEarning = (key) => debitNames.includes(key);

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

  const handleDateRangeChange = (event) => {
    const { name, value } = event.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  const computeResults = (records, month) => {
    const results = {};
    let earningsTotal = 0;
    let deductionsTotal = 0;

    Object.values(records).forEach((recordsArray) => {
      recordsArray.forEach((record) => {
        record.details.forEach((head) => {
          let headValue = 0;
          let hourlyRate = 0;
          console.log("head.rate", head.rate);
          console.log("head.totalDays", totalPresentDays);
          switch (head.calculationType) {
            case "As User Defined Value":
              headValue = roundToTwoDecimals(
                (head.rate / head.totalDays) * subtotalDaysWorked || 1
              );
              break;
            case "As Manual Value":
              console.log("hai", head.rate);
              const totalHoursInMonth = totalDaysInMonth * totalHoursPerDay;

              hourlyRate = parseFloat(
                (head.rate / totalHoursInMonth).toFixed(2)
              );
              console.log("to", hourlyRate);
              headValue = hourlyRate * (totalHoursWorked || 0);
              break;
            case "As Computed Value":
              console.log("head", head);
              console.log("result", results);
              headValue = roundToTwoDecimals(
                computeComputedValue(head, results)
              );
              break;
            case "Flat Rate":
              headValue = roundToTwoDecimals(head.rate);
              break;
            case "On Production":
              headValue = roundToTwoDecimals(head.rate * totalOvertime);
              break;
            default:
              headValue = roundToTwoDecimals(head.rate);
              break;
          }
          console.log("hfkldshfkldhl", hourlyRate);
          // Add the check for payHeadName here
          if (!head.payHeadName) {
            console.error(
              `payHeadName is missing for head with id ${head.payHeadId}`
            );
          }

          // Ensure payHeadName is defined and fallback to a default if missing
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
    console.log("salaryResult", salaryResults);
    console.error(
      "Expected salaryResults to be an array, but got:",
      salaryResults
    );
    return <p>No salary results available</p>;
  }
  if (!payHeadDetails.length) {
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

  const handlePrint = () => {
    window.print();
  };

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

      <button
        onClick={handlePrint}
        className="p-2 mb-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-md"
      >
        Print
      </button>

      <div className="bg-white dark:bg-gray-900 border-2 mb-6 rounded-lg shadow-lg mt-10 border-gray-300 dark:border-gray-600">
        <div ref={componentRef} className="printable-area">
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
            console.log("usersListUser", usersListUser);
            return (
              <div
                key={index}
                className="max-w-4xl mx-auto p-4 border-2 mb-6 rounded-lg shadow-lg mt-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              >
                <h2 className="text-center text-xl font-bold">
                  {usersListUser.user.companyName}
                </h2>
                <p className="text-center">{usersListUser.user.address}</p>
                <p className="text-center">
                  Gst Number : {""}
                  {usersListUser.user.gstNumber}
                </p>
                <p className="text-center">
                  Mobile Number : {usersListUser.user.mobileNumber}
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
                          <span>{earnings[key].toFixed(2)}</span>
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
                            <span>{totals.totalPresentDays}</span>
                          </div>

                          {/* <div className="flex justify-between w-full">
                            <span>Overtime rate :</span>
                            <span>{oneHourRate.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between w-full">
                            <span>Total Overtime :</span>
                            <span>{totalOvertime.toFixed(2)}</span>
                          </div>

                          <div className="flex justify-between w-full">
                            <span>Overtime rate :</span>
                            <span>{totalOvertimes.toFixed(2)}</span>
                          </div> */}
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
                  {manualValueDetails.length > 0 ? (
                    manualValueDetails.map((detail, i) => (
                      <div key={i} className="flex justify-between">
                        <span>Total Earnings:</span>
                        <span>
                          {(
                            totalEarnings +
                            totalOvertime * oneHourRate
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between">
                      <span>Total Earnings:</span>
                      <span>{totalEarnings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Total Deductions:</span>
                    <span>{totalDeductions.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Pay:</span>
                    <span>{(totalEarnings - totalDeductions).toFixed(2)}</span>
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

export default SpecificEmployeeSalaryCalculator;
