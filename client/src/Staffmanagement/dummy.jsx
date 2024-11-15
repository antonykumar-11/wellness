// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { useGetAllEmployeesQuery } from "../store/api/StaffApi";
// import { useGetPayHeadDetailsByIdQuery } from "../store/api/payHeadDetailsApi";
// import { useGetAttendanceByIdQuery } from "../store/api/AttendenceApi";
// import moment from "moment";

// const AllEmployeeSalaryCalculator = () => {
//   const { employeeId } = useParams();
//   const [selectedMonth, setSelectedMonth] = useState(moment().format("MM"));
//   const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));
//   const [employee, setEmployee] = useState(null);
//   const [salaryResults, setSalaryResults] = useState([]);

//   const { data: employees = [], refetch: refetchEmployees } =
//     useGetAllEmployeesQuery();
//   const { data: totals = {}, refetch: refetchAttendance } =
//     useGetAttendanceByIdQuery({
//       id: employeeId,
//       month: selectedMonth,
//       year: selectedYear,
//     });
//   const { data: payHeadDetails = [], refetch: refetchPayHeadDetails } =
//     useGetPayHeadDetailsByIdQuery({
//       id: employeeId,
//       month: selectedMonth,
//       year: selectedYear,
//     });

//   const componentRef = useRef(); // Create a ref for the printable component

//   // Find the employee by ID when employees are fetched
//   useEffect(() => {
//     if (employees.length && employeeId) {
//       const foundEmployee = employees.find((emp) => emp._id === employeeId);
//       setEmployee(foundEmployee);
//     }
//   }, [employees, employeeId]);

//   // Calculate the salary details when pay head details are fetched
//   useEffect(() => {
//     if (payHeadDetails.length && totals) {
//       const aggregatedDetails = aggregateTransactionsByMonth(payHeadDetails);
//       const results = Object.keys(aggregatedDetails).map((month) =>
//         computeResults(aggregatedDetails[month], month, totals.totalPresentDays)
//       );
//       setSalaryResults(results);
//     }
//   }, [payHeadDetails, totals]);

//   // Aggregate the transactions by month for salary calculations
//   const aggregateTransactionsByMonth = (details) => {
//     const aggregatedTransactions = {};
//     details.forEach((record) => {
//       const monthYear = moment(record.date).format("YYYY-MM");
//       if (!aggregatedTransactions[monthYear]) {
//         aggregatedTransactions[monthYear] = [];
//       }
//       aggregatedTransactions[monthYear].push(record);
//     });
//     return aggregatedTransactions;
//   };

//   // Function to calculate the salary based on user-defined pay heads
//   const computeResults = (records, month, totalPresentDays) => {
//     const results = {};
//     let earningsTotal = 0;

//     records.forEach((record) => {
//       record.details.forEach((head) => {
//         if (head.calculationType === "As User Defined Value") {
//           const presentDays = totalPresentDays > 0 ? totalPresentDays : 0;
//           let headValue = 0;

//           headValue = roundToTwoDecimals(
//             (head.rate / head.toatalDay) * presentDays
//           );

//           if (!results[head.payHeadName]) {
//             results[head.payHeadName] = 0;
//           }

//           results[head.payHeadName] += headValue;
//           earningsTotal += headValue;
//         }
//       });
//     });

//     return { month, results, earningsTotal };
//   };

//   // Helper functions
//   const roundToTwoDecimals = (value) => Math.round(value * 100) / 100;

//   // Handle month selection change
//   const handleMonthChange = (event) => {
//     const [year, month] = event.target.value.split("-"); // Split the input value (YYYY-MM)
//     setSelectedMonth(month); // Update month
//     setSelectedYear(year); // Update year
//   };

//   // Refetch data when the component mounts or employeeId/selectedMonth changes
//   useEffect(() => {
//     if (employeeId) {
//       refetchEmployees();
//       refetchAttendance();
//       refetchPayHeadDetails();
//     }
//   }, [
//     employeeId,
//     selectedMonth,
//     selectedYear,
//     refetchEmployees,
//     refetchAttendance,
//     refetchPayHeadDetails,
//   ]);

//   if (!employee || !salaryResults.length) return <p>Loading...</p>;

//   return (
//     <div ref={componentRef}>
//       <div className="mb-4">
//         <label htmlFor="monthPicker" className="mr-2">
//           Select Month & Year:
//         </label>
//         <input
//           type="month"
//           id="monthPicker"
//           value={`${selectedYear}-${selectedMonth}`} // Ensure correct format
//           onChange={handleMonthChange}
//           className="border p-2"
//         />
//       </div>

//       {salaryResults.map((record, index) => {
//         const { results, earningsTotal } = record;
//         const earnings = {};

//         for (const key in results) {
//           if (["Earnings for Employees"].includes(key)) {
//             earnings[key] = results[key];
//           }
//         }

//         return (
//           <div
//             key={index}
//             className="max-w-4xl mx-auto p-4 border-2 border-gray-300 rounded-lg shadow-lg mb-6"
//           >
//             <h2 className="text-lg font-bold">
//               Salary Details for {moment(record.month).format("MMMM YYYY")}
//             </h2>
//             <div className="grid grid-cols-2 mt-4">
//               <div>
//                 <h3 className="font-bold">Earnings</h3>
//                 {Object.keys(earnings).map((key) => (
//                   <div key={key} className="flex justify-between">
//                     <span>{key}</span>
//                     <span>{earnings[key].toFixed(2)}</span>
//                   </div>
//                 ))}
//               </div>
//               <div>
//                 <h3 className="font-bold">Total Earnings</h3>
//                 <div className="flex justify-between">
//                   <span>Total Earnings</span>
//                   <span>{earningsTotal.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default AllEmployeeSalaryCalculator;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useGetEmployeeDetailsByIdQuery } from "../store/api/StaffApi";
// import { useGetPayHeadDetailsByIdQuery } from "../store/api/payHeadDetailsApi";
// import { useGetAttendanceByIdQuery } from "../store/api/AttendenceApi";
// import moment from "moment";

// const AllEmployeeSalaryCalculator = () => {
//   const { employeeId } = useParams();

//   // Set initial date range to cover the current month
//   const currentMonthStart = moment().startOf("month").format("YYYY-MM-DD");
//   const currentMonthEnd = moment().endOf("month").format("YYYY-MM-DD");
//   const [startDate, setStartDate] = useState(currentMonthStart);
//   const [endDate, setEndDate] = useState(currentMonthEnd);
//   const [salaryResults, setSalaryResults] = useState(null); // Initialize as null

//   const { data: employee, refetch: refetchEmployees } =
//     useGetEmployeeDetailsByIdQuery(employeeId);
//   const { data: totals = {}, refetch: refetchAttendance } =
//     useGetAttendanceByIdQuery({ id: employeeId, startDate, endDate });
//   const { data: payHeadDetails = [], refetch: refetchPayHeadDetails } =
//     useGetPayHeadDetailsByIdQuery(employeeId);

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

//   const aggregateTransactionsByDateRange = (details, startDate, endDate) => {
//     console.log("Aggregating transactions with:", details, startDate, endDate);
//     const aggregatedTransactions = {};
//     const start = moment(startDate).startOf("day").utc();
//     const end = moment(endDate).endOf("day").utc();

//     details.forEach((record) => {
//       const date = moment(record.date).utc();
//       console.log("Processing record date:", record.date);
//       console.log("Parsed date:", date.format());

//       if (date.isSameOrAfter(start) && date.isSameOrBefore(end)) {
//         const formattedDate = date.format("YYYY-MM-DD");
//         if (!aggregatedTransactions[formattedDate]) {
//           aggregatedTransactions[formattedDate] = [];
//         }
//         aggregatedTransactions[formattedDate].push(record);
//       }
//     });

//     console.log("Aggregated Transactions:", aggregatedTransactions);
//     return aggregatedTransactions;
//   };

//   const computeResults = (records, startDate, endDate, totalPresentDays) => {
//     console.log("records................................", records);
//     const results = {};
//     let earningsTotal = 0;

//     Object.values(records).forEach((recordsArray) => {
//       recordsArray.forEach((record) => {
//         record.details.forEach((head) => {
//           console.log(
//             "records................................",
//             head.calculationType,
//             totalPresentDays
//           );
//           let headValue = 0;

//           switch (head.calculationType) {
//             case "As User Defined Value":
//               headValue = roundToTwoDecimals(
//                 (head.rate / head.totalDays) * totalPresentDays
//               );
//               break;
//             case "As Manual Value":
//               const totalHoursInRange = head.totalDays * 24; // Assuming 24 hours per day
//               const hourlyRate = parseFloat(
//                 (head.rate / totalHoursInRange).toFixed(2)
//               );
//               headValue = hourlyRate * (totals.totalHoursWorked || 0);
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
//               headValue = roundToTwoDecimals(
//                 head.rate * (totals.totalOvertime || 0)
//               );
//               break;
//             default:
//               headValue = roundToTwoDecimals(head.rate);
//               break;
//           }

//           if (!results[head.payHeadName]) {
//             results[head.payHeadName] = 0;
//           }

//           results[head.payHeadName] += headValue;
//           earningsTotal += headValue;
//         });
//       });
//     });

//     console.log("Computed Results:", results, earningsTotal);
//     return { results, earningsTotal };
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

//   const handleDateRangeChange = (event) => {
//     const { name, value } = event.target;
//     if (name === "startDate") {
//       setStartDate(value);
//     } else if (name === "endDate") {
//       setEndDate(value);
//     }
//   };

//   useEffect(() => {
//     if (employeeId) {
//       refetchEmployees();
//       refetchAttendance();
//       refetchPayHeadDetails();
//     }
//   }, [
//     employeeId,
//     startDate,
//     endDate,
//     refetchEmployees,
//     refetchAttendance,
//     refetchPayHeadDetails,
//   ]);

//   console.log("salaryResults:", salaryResults);
//   console.log("Is array:", Array.isArray(salaryResults));

//   if (!salaryResults) {
//     // Handle loading state
//     return <p>Loading...</p>;
//   }

//   if (typeof salaryResults === "object" && salaryResults.results) {
//     const { results, earningsTotal } = salaryResults;

//     return (
//       <div>
//         <div className="mb-4">
//           <label htmlFor="startDate" className="mr-2">
//             Start Date:
//           </label>
//           <input
//             type="date"
//             id="startDate"
//             name="startDate"
//             value={startDate}
//             onChange={handleDateRangeChange}
//             className="border p-2"
//           />
//           <label htmlFor="endDate" className="ml-4 mr-2">
//             End Date:
//           </label>
//           <input
//             type="date"
//             id="endDate"
//             name="endDate"
//             value={endDate}
//             onChange={handleDateRangeChange}
//             className="border p-2"
//           />
//         </div>

//         <div className="max-w-4xl mx-auto p-4 border-2 border-gray-300 rounded-lg shadow-lg mb-6">
//           <h2 className="text-lg font-bold">
//             Salary Details from {moment(startDate).format("MMMM YYYY")} to{" "}
//             {moment(endDate).format("MMMM YYYY")}
//           </h2>
//           <div className="grid grid-cols-2 mt-4">
//             <div>
//               <h3 className="font-bold">Earnings</h3>
//               {Object.keys(results).map((key) => (
//                 <div key={key} className="flex justify-between">
//                   <span>{key}</span>
//                   <span>{results[key].toFixed(2)}</span>
//                 </div>
//               ))}
//             </div>
//             <div>
//               <h3 className="font-bold">Total Earnings</h3>
//               <div className="flex justify-between">
//                 <span>Total Earnings</span>
//                 <span>{earningsTotal.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   } else {
//     // Handle case when salaryResults is not an object or does not have results
//     return <div>Error: salaryResults has an unexpected format.</div>;
//   }
// };

// export default AllEmployeeSalaryCalculator;
// import { useState } from "react";
// import { useCreateEmployeeMutation } from "../store/api/StaffApi";
// import { useGetTaxesQuery } from "../store/api/TaxApi";

// import Modal from "../Modal";
// import LedgerOperations from "../LedgerOperations";
// import UnderPayHead from "../Staffmanagement/UnderPayHead";

// const CreateEmployeeForm = () => {
//   const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
//   const [formData, setFormData] = useState({
//     name: "",
//     designation: "",
//     address: "",
//     gender: "",
//     dateOfBirth: "",
//     bloodGroup: "",
//     fatherOrMotherName: "",
//     spouseName: "",
//     contact: { phone: "", email: "" },
//     bankDetails: { bankName: "", accountNumber: "", ifscCode: "" },
//     incomeTaxPAN: "",
//     aadhaarCard: "",
//     pfAccountNumber: "",
//     prAccountNumber: "",
//     under: "",
//     esiNumber: "",
//     dateOfHire: "",
//     salary: 0,
//     status: "active",
//     attendance: "Present",

//     basicPay: 0,
//     DA: 0,
//     HRA: 0,
//     overtime: 0,
//     EPF: 0,
//     ESI: 0,
//     conveyance: 0,
//     tax: 0,
//     advance: 0,
//   });
//   const [avatar, setAvatar] = useState("");
//   console.log("avatar", avatar, formData);
//   const [avatarPreview, setAvatarPreview] = useState(
//     "/images/default_avatar.png"
//   );
//   const handleImageChange = (e) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (reader.readyState === 2) {
//         setAvatarPreview(reader.result);
//         setAvatar(e.target.files[0]);
//       }
//     };
//     reader.readAsDataURL(e.target.files[0]);
//   };
//   const { data: ledgers } = useGetTaxesQuery();
//   console.log("ledger", ledgers);
//   const [isModalOpen, setModalOpen] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const keys = name.split(".");

//     if (keys.length > 1) {
//       setFormData((prevState) => ({
//         ...prevState,
//         [keys[0]]: {
//           ...prevState[keys[0]],
//           [keys[1]]: value,
//         },
//       }));
//     } else {
//       setFormData((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//     }
//   };

//   const handleOpenModal = () => {
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//   };

//   const handleSaveOperations = (newOperations) => {
//     setFormData(newOperations);
//   };

//   const handleDropdownChange = (selectedOption) => {
//     setFormData({ ...formData, under: selectedOption._id });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Create a new FormData instance
//     const formDataToSubmit = new FormData();

//     // Append form fields to FormData
//     formDataToSubmit.append("name", formData.name);
//     formDataToSubmit.append("designation", formData.designation);
//     formDataToSubmit.append("address", formData.address);
//     formDataToSubmit.append("gender", formData.gender);
//     formDataToSubmit.append("dateOfBirth", formData.dateOfBirth);
//     formDataToSubmit.append("bloodGroup", formData.bloodGroup);
//     formDataToSubmit.append("fatherOrMotherName", formData.fatherOrMotherName);
//     formDataToSubmit.append("spouseName", formData.spouseName);
//     formDataToSubmit.append("contact.phone", formData.contact.phone);
//     formDataToSubmit.append("contact.email", formData.contact.email);
//     formDataToSubmit.append(
//       "bankDetails.bankName",
//       formData.bankDetails.bankName
//     );
//     formDataToSubmit.append(
//       "bankDetails.accountNumber",
//       formData.bankDetails.accountNumber
//     );
//     formDataToSubmit.append(
//       "bankDetails.ifscCode",
//       formData.bankDetails.ifscCode
//     );
//     formDataToSubmit.append("incomeTaxPAN", formData.incomeTaxPAN);
//     formDataToSubmit.append("aadhaarCard", formData.aadhaarCard);
//     formDataToSubmit.append("pfAccountNumber", formData.pfAccountNumber);
//     formDataToSubmit.append("prAccountNumber", formData.prAccountNumber);
//     formDataToSubmit.append("under", formData.under);
//     formDataToSubmit.append("esiNumber", formData.esiNumber);
//     formDataToSubmit.append("dateOfHire", formData.dateOfHire);
//     formDataToSubmit.append("salary", formData.salary);
//     formDataToSubmit.append("status", formData.status);
//     formDataToSubmit.append("attendance", formData.attendance);
//     formDataToSubmit.append("basicPay", formData.basicPay);
//     formDataToSubmit.append("DA", formData.DA);
//     formDataToSubmit.append("HRA", formData.HRA);
//     formDataToSubmit.append("overtime", formData.overtime);
//     formDataToSubmit.append("EPF", formData.EPF);
//     formDataToSubmit.append("ESI", formData.ESI);
//     formDataToSubmit.append("conveyance", formData.conveyance);
//     formDataToSubmit.append("tax", formData.tax);
//     formDataToSubmit.append("advance", formData.advance);
//     formDataToSubmit.append("avatar", avatar);
//     try {
//       // Call API or handle form submission
//       await createEmployee(formDataToSubmit);
//       // Handle successful submission
//       console.log("Employee created successfully");
//     } catch (error) {
//       // Handle submission errors
//       console.error("Error creating employee:", error);
//     }
//   };

//   return (
//     <>
//       <div className="dark:bg-gray-800 bg-gray-200 min-h-screen flex flex-col items-center p-8">
//         <div className="w-full max-w-md p-4 bg-gray-900 text-white shadow-md rounded-md mb-8">
//           <div className="flex items-center space-x-4">
//             <figure className="w-24 h-24 flex-shrink-0">
//               <img
//                 src={avatarPreview}
//                 className="w-full h-full object-cover rounded-full border border-gray-600"
//                 alt="Avatar"
//               />
//             </figure>
//             <div className="flex-1">
//               {/* Hidden input field */}
//               <input
//                 type="file"
//                 name="avatar"
//                 onChange={handleImageChange}
//                 className="hidden"
//                 id="customFile"
//               />
//               {/* Custom button to trigger file input */}
//               <label
//                 htmlFor="customFile"
//                 className="mt-1 block py-2 px-4 border border-gray-600 rounded-md text-sm font-medium text-white cursor-pointer hover:bg-gray-700"
//               >
//                 Choose File
//               </label>
//             </div>
//           </div>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="w-full max-w-2xl p-8 bg-gray-900 text-white rounded shadow-md"
//         >
//           <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 sm:grid-cols-2">
//             <div>
//               <label className="block mb-1">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Designation</label>
//               <input
//                 type="text"
//                 name="designation"
//                 value={formData.designation}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Address</label>
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Gender</label>
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </select>
//             </div>
//             <div>
//               <label className="block mb-1">Date of Birth</label>
//               <input
//                 type="date"
//                 name="dateOfBirth"
//                 value={formData.dateOfBirth}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Blood Group</label>
//               <input
//                 type="text"
//                 name="bloodGroup"
//                 value={formData.bloodGroup}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Father/Mother Name</label>
//               <input
//                 type="text"
//                 name="fatherOrMotherName"
//                 value={formData.fatherOrMotherName}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Spouse Name</label>
//               <input
//                 type="text"
//                 name="spouseName"
//                 value={formData.spouseName}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Phone</label>
//               <input
//                 type="text"
//                 name="contact.phone"
//                 value={formData.contact.phone}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Email</label>
//               <input
//                 type="email"
//                 name="contact.email"
//                 value={formData.contact.email}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Bank Name</label>
//               <input
//                 type="text"
//                 name="bankDetails.bankName"
//                 value={formData.bankDetails.bankName}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Account Number</label>
//               <input
//                 type="text"
//                 name="bankDetails.accountNumber"
//                 value={formData.bankDetails.accountNumber}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">IFSC Code</label>
//               <input
//                 type="text"
//                 name="bankDetails.ifscCode"
//                 value={formData.bankDetails.ifscCode}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Income Tax PAN</label>
//               <input
//                 type="text"
//                 name="incomeTaxPAN"
//                 value={formData.incomeTaxPAN}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Aadhaar Card</label>
//               <input
//                 type="text"
//                 name="aadhaarCard"
//                 value={formData.aadhaarCard}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">PF Account Number</label>
//               <input
//                 type="text"
//                 name="pfAccountNumber"
//                 value={formData.pfAccountNumber}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">PR Account Number</label>
//               <input
//                 type="text"
//                 name="prAccountNumber"
//                 value={formData.prAccountNumber}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">ESI Number</label>
//               <input
//                 type="text"
//                 name="esiNumber"
//                 value={formData.esiNumber}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Date of Hire</label>
//               <input
//                 type="date"
//                 name="dateOfHire"
//                 value={formData.dateOfHire}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-800"
//                 required
//               />
//             </div>

//             <div className="flex flex-col">
//               <label htmlFor="days" className="mb-1 font-semibold">
//                 Category
//               </label>
//               <UnderPayHead
//                 hello2={handleDropdownChange}
//                 options={ledgers || []}
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="mt-4 min-w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             disabled={isLoading}
//           >
//             {isLoading ? "Creating..." : "Create Employee"}
//           </button>
//         </form>

//         <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
//           <LedgerOperations
//             onClose={handleCloseModal}
//             onSave={handleSaveOperations}
//           />
//         </Modal>
//       </div>
//     </>
//   );
// };

// export default CreateEmployeeForm;
import React, { useEffect, useState } from "react";
import { useGetAllEmployeesQuery } from "../store/api/StaffApi";
import { useGetPayHeadDetailsQuery } from "../store/api/payHeadDetailsApi";
import { useGetAttendancesByParamsQuery } from "../store/api/AttendenceEmployee";
import moment from "moment";

const formatDate = (dateString) => moment(dateString).format("MMMM DD, YYYY");

const AllEmployeesSalaryCalculator = () => {
  const currentMonthStart = moment().startOf("month").format("YYYY-MM-DD");
  const currentMonthEnd = moment().endOf("month").format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(currentMonthStart);
  const [endDate, setEndDate] = useState(currentMonthEnd);
  const [salaryResults, setSalaryResults] = useState([]);

  const { data: employees = [], refetch: refetchEmployees } =
    useGetAllEmployeesQuery();
  const { data: payHeadDetails = [], refetch: refetchPayHeadDetails } =
    useGetPayHeadDetailsQuery();

  // Add console.log here
  const {
    data: attendanceData = [],
    error,
    isLoading,
    refetch: refetchAttendance,
  } = useGetAttendancesByParamsQuery({
    employeeId: "", // Adjust as needed
    status: "", // Adjust as needed
    date: "", // Adjust as needed
    startDate,
    endDate,
  });

  useEffect(() => {
    console.log("Attendance Data:", attendanceData);
    console.log("Error:", error);
    console.log("Loading State:", isLoading);

    refetchEmployees();
    refetchPayHeadDetails();
    refetchAttendance();
  }, [
    startDate,
    endDate,
    refetchEmployees,
    refetchPayHeadDetails,
    refetchAttendance,
  ]);

  useEffect(() => {
    if (payHeadDetails.length && attendanceData.length && employees.length) {
      const transformedAttendanceData = transformAttendanceData(attendanceData);

      const results = employees.map((employee) => {
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
      });

      setSalaryResults(results);
    }
  }, [payHeadDetails, attendanceData, employees, startDate, endDate]);

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
              console.log("totals.totalPresentDays", totals.totalPresentDays);
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

  if (salaryResults.length === 0) {
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
          onChange={(e) => setStartDate(e.target.value)}
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
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2"
        />
      </div>

      {salaryResults.map((record, index) => {
        const { employee, results, totalSalary } = record;

        const earnings = {};
        const deductions = {};

        for (const key in results) {
          if (key.includes("Earnings")) {
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
            className="max-w-4xl mx-auto p-4 border-2 mb-6 border-gray-300 rounded-lg shadow-lg mt-20 bg-blue-300"
          >
            <h2 className="text-center text-xl font-bold">
              SS Mobile Solution Proprietorship Firm
            </h2>
            <p className="text-center">
              2nd Floor, B&C Wing, SMR Vinay Estates, Commercial Complex, Outer
              Ring Road,
            </p>
            <p className="text-center font-bold mt-2">
              Pay Slip for the period of {formatDate(startDate)} to{" "}
              {formatDate(endDate)}
            </p>
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
                  <span className="font-bold">Address:</span> {employee.address}
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
                  <span className="font-bold">Father's/Husband's Name:</span> -
                </p>
                <p>
                  <span className="font-bold">Casual Leave:</span> -
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t-2 border-b-2 border-gray-600">
              <div>
                <p className="font-bold">Earnings:</p>
                {Object.keys(earnings).map((key) => (
                  <div key={key} className="flex justify-between w-full">
                    <span>{key}</span>
                    <span>{earnings[key].toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-bold">Deductions:</p>
                {Object.keys(deductions).map((key) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}</span>
                    <span>{deductions[key].toFixed(2)}</span>
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
                <span>{netPay.toFixed(2)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default AllEmployeesSalaryCalculator;
