// // import React, { useState, useEffect } from "react";
// // import {
// //   useUpdatePayHeadDetailsMutation,
// //   useDeletePayHeadDetailsMutation,
// //   useGetPayHeadDetailsByIdQuery,
// // } from "../store/api/payHeadDetailsApi";
// // import { useGetPayHeadsQuery } from "../store/api/PayHead";
// // import { FaPlus, FaTrash, FaSave, FaUndo } from "react-icons/fa";
// // import { useParams } from "react-router-dom";

// // const EmployeeSalarySlipEdit = () => {
// //   const { employeeId } = useParams();

// //   const {
// //     data: payHeads = [],
// //     isLoading: payHeadsLoading,
// //     isError: payHeadsError,
// //   } = useGetPayHeadsQuery();

// //   const { data: payHeadDetails = [], refetch: refetchPayHeadDetails } =
// //     useGetPayHeadDetailsByIdQuery(employeeId);

// //   const [createPayHeadDetails] = useUpdatePayHeadDetailsMutation();
// //   const [deletePayHeadDetails] = useDeletePayHeadDetailsMutation();
// //   const [date, setDate] = useState("");
// //   const [payHeadDetailsList, setPayHeadDetailsList] = useState([]);
// //   const [hoursPerDayList, setHoursPerDayList] = useState({});

// //   useEffect(() => {
// //     if (Array.isArray(payHeadDetails) && payHeadDetails.length > 0) {
// //       const allDetails = payHeadDetails.flatMap(
// //         (record) => record.details || []
// //       );

// //       if (allDetails.length > 0) {
// //         const newPayHeadDetailsList = allDetails.map((detail) => ({
// //           ...detail,
// //           payHead:
// //             payHeads.find((head) => head._id === detail.payHeadId) || null,
// //         }));

// //         setPayHeadDetailsList(newPayHeadDetailsList);

// //         const newHoursPerDayList = allDetails.reduce((acc, detail) => {
// //           acc[detail._id] = detail.totalHoursPerDay || 0;
// //           return acc;
// //         }, {});

// //         setHoursPerDayList(newHoursPerDayList);

// //         // Format date as YYYY-MM-DD
// //         const latestRecordDate = payHeadDetails[0]?.date;
// //         const formattedDate = latestRecordDate
// //           ? new Date(latestRecordDate).toISOString().split("T")[0]
// //           : "";
// //         setDate(formattedDate);
// //       }
// //     }
// //   }, [payHeadDetails, payHeads]);

// //   const handlePayHeadChange = (index, event) => {
// //     const selectedId = event.target.value;
// //     const payHead = payHeads.find((head) => head._id === selectedId);

// //     if (payHead) {
// //       const computedOn =
// //         payHead.operations
// //           ?.map((op) => `${op.operands.join(", ")} ${op.operator}`)
// //           .join(" ") || "";

// //       const updatedPayHeadDetailsList = [...payHeadDetailsList];
// //       updatedPayHeadDetailsList[index] = {
// //         ...updatedPayHeadDetailsList[index],
// //         payHead,
// //         displayNameInPayslip: payHead.displayNameInPayslip || "",
// //         rate: payHead.rate || "",
// //         totalDays: 0,
// //         payHeadType: payHead.payHeadType,
// //         calculationType: payHead.calculationType,
// //         computedOn,
// //         operations: payHead.operations || [],
// //       };
// //       setPayHeadDetailsList(updatedPayHeadDetailsList);
// //     }
// //   };

// //   const handleDetailChange = (index, field, value) => {
// //     const updatedPayHeadDetailsList = [...payHeadDetailsList];
// //     updatedPayHeadDetailsList[index][field] = value;
// //     setPayHeadDetailsList(updatedPayHeadDetailsList);
// //   };

// //   // const handleHoursChange = (id, value) => {
// //   //   setHoursPerDayList((prevList) => ({
// //   //     ...prevList,
// //   //     [id]: parseFloat(value) || 0,
// //   //   }));
// //   // };

// //   const handleUpdate = async () => {
// //     try {
// //       const newPayHeadDetails = {
// //         date,
// //         details: payHeadDetailsList.map((detail) => ({
// //           payHeadId: detail.payHead?._id,
// //           displayNameInPayslip: detail.displayNameInPayslip,
// //           rate: detail.rate,
// //           totalDays: detail.totalDays,
// //           payHeadType: detail.payHeadType,
// //           calculationType: detail.calculationType,
// //           computedOn: detail.computedOn,
// //           totalHoursPerDay: hoursPerDayList[detail._id] || 0,
// //         })),
// //       };

// //       const response = await createPayHeadDetails({
// //         ...newPayHeadDetails,
// //         employeeId,
// //       }).unwrap();
// //       console.log("Save response:", response);
// //       setPayHeadDetailsList([]);
// //       setDate("");
// //       setHoursPerDayList({});
// //       alert("Pay head details saved successfully!");
// //       refetchPayHeadDetails();
// //     } catch (error) {
// //       console.error("Save error:", error);
// //       alert("Failed to save pay head details.");
// //     }
// //   };

// //   const addNewPayHeadDetail = () => {
// //     setPayHeadDetailsList([
// //       ...payHeadDetailsList,
// //       {
// //         payHead: null,
// //         displayNameInPayslip: "",
// //         rate: "",
// //         totalDays: 0,
// //         payHeadType: "",
// //         calculationType: "",
// //         computedOn: "",
// //         operations: [],
// //       },
// //     ]);
// //   };

// //   const deletePayHeadDetail = (index) => {
// //     const updatedPayHeadDetailsList = payHeadDetailsList.filter(
// //       (_, i) => i !== index
// //     );
// //     setPayHeadDetailsList(updatedPayHeadDetailsList);
// //   };

// //   const handleDeleteAll = async () => {
// //     try {
// //       await deletePayHeadDetails(employeeId).unwrap();
// //       alert("All pay head details deleted successfully!");
// //       setPayHeadDetailsList([]);
// //       refetchPayHeadDetails();
// //     } catch (err) {
// //       alert("Failed to delete pay head details.");
// //     }
// //   };

// //   return (
// //     <div className="p-4 max-w-full overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-10">
// //       <h2 className="text-2xl mb-4 text-gray-900 dark:text-gray-100">
// //         Salary Slip
// //       </h2>
// //       <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4">
// //         <div className="flex-1 mb-4 lg:mb-0">
// //           <label className="block mb-2 text-gray-700 dark:text-gray-300">
// //             Date
// //           </label>
// //           <input
// //             type="date"
// //             value={date}
// //             onChange={(e) => setDate(e.target.value)}
// //             className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
// //           />
// //         </div>
// //         <div className="flex-1 mb-4 lg:mb-0">
// //           <label className="block mb-2 text-gray-700 dark:text-gray-300">
// //             Total Hours Per Day
// //           </label>
// //           <input
// //             type="number"
// //             value={Object.values(hoursPerDayList).reduce((a, b) => a + b, 0)}
// //             readOnly
// //             className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
// //           />
// //         </div>
// //       </div>

// //       <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-lg shadow">
// //         <thead>
// //           <tr>
// //             <th className="border-b border-gray-300 dark:border-gray-600">
// //               Pay Head
// //             </th>
// //             <th className="border-b border-gray-300 dark:border-gray-600">
// //               Rate
// //             </th>
// //             <th className="border-b border-gray-300 dark:border-gray-600">
// //               Total Days
// //             </th>
// //             <th className="border-b border-gray-300 dark:border-gray-600">
// //               Pay Head Type
// //             </th>
// //             <th className="border-b border-gray-300 dark:border-gray-600">
// //               Calculation Type
// //             </th>
// //             <th className="border-b border-gray-300 dark:border-gray-600">
// //               Computed On
// //             </th>
// //             <th className="border-b border-gray-300 dark:border-gray-600">
// //               Actions
// //             </th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {payHeadDetailsList.map((detail, index) => (
// //             <tr key={index}>
// //               <td>
// //                 <select
// //                   onChange={(e) => handlePayHeadChange(index, e)}
// //                   value={detail.payHead?._id || ""}
// //                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
// //                 >
// //                   <option value="">Select Pay Head</option>
// //                   {payHeadsLoading && <option>Loading...</option>}
// //                   {payHeadsError && <option>Error loading pay heads</option>}
// //                   {payHeads.map((head) => (
// //                     <option key={head._id} value={head._id}>
// //                       {head.displayNameInPayslip}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </td>
// //               <td>
// //                 <input
// //                   type="text"
// //                   value={detail.rate}
// //                   onChange={(e) =>
// //                     handleDetailChange(index, "rate", e.target.value)
// //                   }
// //                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
// //                 />
// //               </td>
// //               <td>
// //                 <input
// //                   type="number"
// //                   value={detail.totalDays}
// //                   onChange={(e) =>
// //                     handleDetailChange(index, "totalDays", e.target.value)
// //                   }
// //                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
// //                 />
// //               </td>
// //               <td>
// //                 <input
// //                   type="text"
// //                   value={detail.payHeadType}
// //                   onChange={(e) =>
// //                     handleDetailChange(index, "payHeadType", e.target.value)
// //                   }
// //                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
// //                 />
// //               </td>
// //               <td>
// //                 <input
// //                   type="text"
// //                   value={detail.calculationType}
// //                   onChange={(e) =>
// //                     handleDetailChange(index, "calculationType", e.target.value)
// //                   }
// //                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
// //                 />
// //               </td>
// //               <td>
// //                 <input
// //                   type="text"
// //                   value={detail.computedOn}
// //                   onChange={(e) =>
// //                     handleDetailChange(index, "computedOn", e.target.value)
// //                   }
// //                   className="border border-gray-300 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
// //                 />
// //               </td>
// //               <td>
// //                 <button
// //                   onClick={() => deletePayHeadDetail(index)}
// //                   className="text-red-500 hover:text-red-700"
// //                 >
// //                   <FaTrash />
// //                 </button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>

// //       <div className="flex space-x-2 mt-4">
// //         <button
// //           onClick={addNewPayHeadDetail}
// //           className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
// //         >
// //           <FaPlus className="mr-2" />
// //           Add Pay Head
// //         </button>

// //         <button
// //           onClick={handleUpdate}
// //           className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center"
// //         >
// //           <FaUndo className="mr-2" />
// //           Update
// //         </button>

// //         <button
// //           onClick={handleDeleteAll}
// //           className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
// //         >
// //           <FaTrash className="mr-2" />
// //           Delete All
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EmployeeSalarySlipEdit;

// import React, { useState, useRef, useEffect } from "react";
// import { useGetGroupsQuery } from "../store/api/Group"; // Adjust the path as necessary
// import { HiChevronDown, HiChevronUp } from "react-icons/hi"; // Optional for dropdown icon

// const CustomDropdown = () => {
//   // Fetch groups data from the API
//   const { data: groups = [], error, isLoading } = useGetGroupsQuery();

//   // State to manage the selected group and dropdown visibility
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // State to manage form data
//   const [formData, setFormData] = useState({
//     name: "Branch/Divisions",
//     under: "66c27602c51b7705214b39db", // Ledger ID
//     group: "Branch/Divisions", // Ledger Name
//     category: "Equity", // Ledger category
//     nature: "Credit", // Ledger nature
//   });
//   console.log("formData", formData);
//   // Handler for when the user selects an option
//   const handleSelect = (group) => {
//     // Update formData with selected group details
//     setFormData({
//       ...formData,
//       name: group.name,
//       under: group._id,
//       group: group.name,
//       category: group.category,
//       nature: group.nature,
//     });

//     // Set selected group and close dropdown
//     setSelectedGroup(group);
//     setIsOpen(false);
//   };

//   // Filter groups based on search term
//   const filteredGroups = groups.filter((group) =>
//     group.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   if (isLoading)
//     return <div className="text-center text-gray-500">Loading...</div>;
//   if (error)
//     return <div className="text-center text-red-500">Error loading groups</div>;

//   return (
//     <div ref={dropdownRef} className="relative w-full max-w-xs">
//       <div
//         className="flex items-center justify-between p-2 border border-gray-300 rounded bg-white cursor-pointer"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="truncate">
//           {selectedGroup ? selectedGroup.name : "Select a group"}
//         </span>
//         {isOpen ? (
//           <HiChevronUp className="text-gray-500" />
//         ) : (
//           <HiChevronDown className="text-gray-500" />
//         )}
//       </div>

//       {isOpen && (
//         <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
//           <div className="p-2 border-b border-gray-300">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full p-1 border border-gray-300 rounded"
//             />
//           </div>
//           <div className="max-h-60 overflow-y-auto">
//             {filteredGroups.length > 0 ? (
//               filteredGroups.map((group) => (
//                 <div
//                   key={group._id}
//                   className="p-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => handleSelect(group)}
//                 >
//                   {group.name}
//                 </div>
//               ))
//             ) : (
//               <div className="p-2 text-gray-500">No groups available</div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomDropdown;
import React from "react";

export default function miyu() {
  return <div>miyu</div>;
}
