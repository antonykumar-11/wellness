// // import { useState, useEffect, useRef } from "react";
// // import {
// //   useUpdateEmployeeByIdMutation,
// //   useGetEmployeeDetailsByIdQuery,
// // } from "../store/api/StaffApi";
// // import { useGetTaxesQuery } from "../store/api/TaxApi";
// // import { HiChevronDown, HiChevronUp } from "react-icons/hi";
// // import { useGetGroupsQuery } from "../store/api/Group";
// // import UnderPayHead1 from "../Staffmanagement/UderPayHead1";
// // import { useCreateLedgerMutation } from "../store/api/LedgerPayHead";
// // import { useParams, useNavigate } from "react-router-dom";
// // const UpdateEmployeeForm = () => {
// //   const { employeeId } = useParams();
// //   console.log("transactionId", employeeId);
// //   const dropdownRef = useRef(null);
// //   const [createEmployee] = useUpdateEmployeeByIdMutation();
// //   const [createLedger] = useCreateLedgerMutation();
// //   const [formData, setFormData] = useState({
// //     registrationType: "employee",
// //     employeeRegistration: {
// //       name: "",
// //       designation: "",
// //       address: "",
// //       gender: "",
// //       dateOfBirth: "",
// //       bloodGroup: "",
// //       fatherOrMotherName: "",
// //       spouseName: "",
// //       contact: { phone: "", email: "" },
// //       bankDetails: { bankName: "", accountNumber: "", ifscCode: "" },
// //       incomeTaxPAN: "",
// //       aadhaarCard: "",
// //       pfAccountNumber: "",
// //       prAccountNumber: "",
// //       under: "",
// //       esiNumber: "",
// //       dateOfHire: "",
// //       salary: 0,
// //       status: "active",
// //       attendance: "Present",
// //       registrationType: "employee",
// //       basicPay: 0,
// //       DA: 0,
// //       HRA: 0,
// //       overtime: 0,
// //       EPF: 0,
// //       ESI: 0,
// //       conveyance: 0,
// //       tax: 0,
// //       advance: 0,
// //     },
// //     under: "",
// //     name: "",
// //     group: "",
// //   });
// //   console.log("formDatahere data", formData);
// //   const [avatar, setAvatar] = useState("");
// //   const [avatarPreview, setAvatarPreview] = useState(
// //     "/images/default_avatar.png"
// //   );
// //   const { data: ledgers } = useGetTaxesQuery();
// //   const { data: groups = [], error, isLoading } = useGetGroupsQuery();

// //   // State to manage the selected group, search term, and dropdown visibility
// //   const [selectedGroup, setSelectedGroup] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [isOpen, setIsOpen] = useState(false);
// //   const {
// //     data: specificEmployee,
// //     isLoading: voucherLoading,
// //     isError: voucherError,
// //     refetch: refetchVoucherData,
// //   } = useGetEmployeeDetailsByIdQuery(employeeId || "", {
// //     skip: !employeeId,
// //   });
// //   console.log("paymentVoucher", specificEmployee);
// //   useEffect(() => {
// //     if (specificEmployee) {
// //       setFormData((prevState) => ({
// //         ...prevState,
// //         employeeRegistration: {
// //           ...prevState.employeeRegistration,
// //           ...specificEmployee,
// //           name: specificEmployee.name || prevState.employeeRegistration.name,
// //           designation:
// //             specificEmployee.designation ||
// //             prevState.employeeRegistration.designation,
// //           address:
// //             specificEmployee.address || prevState.employeeRegistration.address,
// //           gender:
// //             specificEmployee.gender || prevState.employeeRegistration.gender,
// //           dateOfBirth:
// //             specificEmployee.dateOfBirth ||
// //             prevState.employeeRegistration.dateOfBirth,
// //           bloodGroup:
// //             specificEmployee.bloodGroup ||
// //             prevState.employeeRegistration.bloodGroup,
// //           fatherOrMotherName:
// //             specificEmployee.fatherOrMotherName ||
// //             prevState.employeeRegistration.fatherOrMotherName,
// //           spouseName:
// //             specificEmployee.spouseName ||
// //             prevState.employeeRegistration.spouseName,
// //           contact: {
// //             phone:
// //               specificEmployee.contact?.phone ||
// //               prevState.employeeRegistration.contact.phone,
// //             email:
// //               specificEmployee.contact?.email ||
// //               prevState.employeeRegistration.contact.email,
// //           },
// //           bankDetails: {
// //             bankName:
// //               specificEmployee.bankDetails?.bankName ||
// //               prevState.employeeRegistration.bankDetails.bankName,
// //             accountNumber:
// //               specificEmployee.bankDetails?.accountNumber ||
// //               prevState.employeeRegistration.bankDetails.accountNumber,
// //             ifscCode:
// //               specificEmployee.bankDetails?.ifscCode ||
// //               prevState.employeeRegistration.bankDetails.ifscCode,
// //           },
// //           incomeTaxPAN:
// //             specificEmployee.incomeTaxPAN ||
// //             prevState.employeeRegistration.incomeTaxPAN,
// //           aadhaarCard:
// //             specificEmployee.aadhaarCard ||
// //             prevState.employeeRegistration.aadhaarCard,
// //           pfAccountNumber:
// //             specificEmployee.pfAccountNumber ||
// //             prevState.employeeRegistration.pfAccountNumber,
// //           prAccountNumber:
// //             specificEmployee.prAccountNumber ||
// //             prevState.employeeRegistration.prAccountNumber,
// //           esiNumber:
// //             specificEmployee.esiNumber ||
// //             prevState.employeeRegistration.esiNumber,
// //           dateOfHire:
// //             specificEmployee.dateOfHire ||
// //             prevState.employeeRegistration.dateOfHire,
// //           salary:
// //             specificEmployee.salary || prevState.employeeRegistration.salary,
// //           status:
// //             specificEmployee.status || prevState.employeeRegistration.status,
// //           attendance:
// //             specificEmployee.attendance ||
// //             prevState.employeeRegistration.attendance,
// //           basicPay:
// //             specificEmployee.payheads?.basicPay ||
// //             prevState.employeeRegistration.basicPay,
// //           DA:
// //             specificEmployee.payheads?.DA || prevState.employeeRegistration.DA,
// //           HRA:
// //             specificEmployee.payheads?.HRA ||
// //             prevState.employeeRegistration.HRA,
// //           overtime:
// //             specificEmployee.payheads?.overtime ||
// //             prevState.employeeRegistration.overtime,
// //           EPF:
// //             specificEmployee.payheads?.EPF ||
// //             prevState.employeeRegistration.EPF,
// //           ESI:
// //             specificEmployee.payheads?.ESI ||
// //             prevState.employeeRegistration.ESI,
// //           conveyance:
// //             specificEmployee.payheads?.conveyance ||
// //             prevState.employeeRegistration.conveyance,
// //           tax:
// //             specificEmployee.payheads?.tax ||
// //             prevState.employeeRegistration.tax,
// //           advance:
// //             specificEmployee.payheads?.advance ||
// //             prevState.employeeRegistration.advance,
// //         },
// //         under: specificEmployee.under || prevState.under,
// //         name: specificEmployee.name || prevState.name,
// //         group: specificEmployee.group || prevState.group,
// //       }));

// //       // Set selected group
// //       const initialGroup = groups.find(
// //         (group) => group._id === specificEmployee.under
// //       );
// //       if (initialGroup) {
// //         setSelectedGroup(initialGroup);
// //       }

// //       // Set avatar preview if there's an existing avatar
// //       if (specificEmployee.avatar) {
// //         setAvatarPreview(specificEmployee.avatar);
// //       }
// //     }
// //   }, [specificEmployee, groups]);

// //   const handleImageChange = (e) => {
// //     const reader = new FileReader();
// //     reader.onload = () => {
// //       if (reader.readyState === 2) {
// //         setAvatarPreview(reader.result);
// //         setAvatar(e.target.files[0]);
// //       }
// //     };
// //     reader.readAsDataURL(e.target.files[0]);
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     const keys = name.split("."); // Split the name to determine the nesting level

// //     if (keys.length > 1) {
// //       // Handle nested fields
// //       setFormData((prevState) => ({
// //         ...prevState,
// //         [keys[0]]: {
// //           ...prevState[keys[0]],
// //           [keys[1]]: value,
// //         },
// //       }));
// //     } else {
// //       // Handle non-nested fields
// //       setFormData((prevState) => ({
// //         ...prevState,
// //         [name]: value,
// //       }));
// //     }
// //   };

// //   // Filter groups based on search term
// //   const filteredGroups = groups.filter((group) =>
// //     group.name.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   // Handler for when the user selects an option
// //   const handleSelect = (group) => {
// //     console.log("group", group);
// //     setFormData({
// //       ...formData,

// //       under: group._id,
// //       group: group.name,

// //       nature: group.nature,
// //     });
// //     setSelectedGroup(group);
// //     setIsOpen(false);
// //   };

// //   // Close dropdown when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// //         setIsOpen(false);
// //       }
// //     };

// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => {
// //       document.removeEventListener("mousedown", handleClickOutside);
// //     };
// //   }, []);

// //   if (isLoading)
// //     return <div className="text-center text-gray-500">Loading...</div>;
// //   if (error)
// //     return <div className="text-center text-red-500">Error loading groups</div>;

// //   const handleDropdownChange = (selectedOption) => {
// //     console.log("selectedOption", selectedOption);
// //     setFormData((prevState) => ({
// //       ...prevState,
// //       employeeRegistration: {
// //         ...prevState.employeeRegistration,
// //         under: selectedOption._id,
// //       },
// //     }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     try {
// //       // Create FormData instance for employee registration
// //       const formDataToSubmit = new FormData();

// //       // Append employee registration fields
// //       Object.keys(formData.employeeRegistration).forEach((key) => {
// //         const value = formData.employeeRegistration[key];
// //         if (typeof value === "object" && value !== null) {
// //           Object.keys(value).forEach((subKey) => {
// //             formDataToSubmit.append(
// //               `employeeRegistration.${key}.${subKey}`,
// //               value[subKey]
// //             );
// //           });
// //         } else {
// //           formDataToSubmit.append(`employeeRegistration.${key}`, value);
// //         }
// //       });

// //       // Append the avatar file to FormData if selected
// //       if (avatar) {
// //         formDataToSubmit.append("avatar", avatar);
// //       }

// //       // Debug FormData content
// //       for (const [key, value] of formDataToSubmit.entries()) {
// //         console.log(key, value);
// //       }

// //       // Submit employee data
// //       const employeeResponse = await createEmployee(formDataToSubmit).unwrap();
// //       console.log("Employee created successfully", employeeResponse);

// //       if (formData.employeeRegistration.under) {
// //         const ledgerData = {
// //           name: formData.employeeRegistration.name,
// //           under: formData.under,
// //           group: formData.group,
// //         };

// //         const ledgerResponse = await createLedger(ledgerData).unwrap();
// //         console.log("Ledger created successfully", ledgerResponse);
// //       }

// //       setFormData({
// //         registrationType: "employee",
// //         employeeRegistration: {
// //           name: "",
// //           designation: "",
// //           address: "",
// //           gender: "",
// //           dateOfBirth: "",
// //           bloodGroup: "",
// //           fatherOrMotherName: "",
// //           spouseName: "",
// //           contact: { phone: "", email: "" },
// //           bankDetails: { bankName: "", accountNumber: "", ifscCode: "" },
// //           incomeTaxPAN: "",
// //           aadhaarCard: "",
// //           pfAccountNumber: "",
// //           prAccountNumber: "",
// //           under: "",
// //           esiNumber: "",
// //           dateOfHire: "",
// //           salary: 0,
// //           status: "active",
// //           attendance: "Present",
// //           basicPay: 0,
// //           DA: 0,
// //           HRA: 0,
// //           overtime: 0,
// //           EPF: 0,
// //           ESI: 0,
// //           conveyance: 0,
// //           tax: 0,
// //           advance: 0,
// //         },
// //         under: "",
// //         name: "",
// //         group: "",
// //       });

// //       alert("Employee and Ledger saved successfully!");
// //     } catch (error) {
// //       console.error("Failed to save employee or ledger: ", error);
// //       alert("Failed to save employee or ledger.");
// //     }
// //   };
// //   const formatDate = (date) => {
// //     if (!date || isNaN(Date.parse(date))) {
// //       return ""; // Return an empty string if the date is invalid
// //     }
// //     return new Date(date).toISOString().split("T")[0];
// //   };

// //   return (
// //     <div className="flex flex-col items-center">
// //       <form
// //         onSubmit={handleSubmit}
// //         className="max-w-[95%] mx-auto p-8 bg-gray-100 dark:bg-gray-900 rounded shadow-md"
// //       >
// //         <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 sm:grid-cols-2">
// //           {/* Form Fields */}
// //           {[
// //             { label: "Name", name: "employeeRegistration.name", type: "text" },
// //             {
// //               label: "Designation",
// //               name: "employeeRegistration.designation",
// //               type: "text",
// //             },
// //             {
// //               label: "Address",
// //               name: "employeeRegistration.address",
// //               type: "text",
// //             },
// //             {
// //               label: "Gender",
// //               name: "employeeRegistration.gender",
// //               type: "select",
// //               options: ["", "Male", "Female"],
// //             },
// //             {
// //               label: "Date of Birth",
// //               name: "employeeRegistration.dateOfBirth",
// //               type: "date",
// //             },
// //             {
// //               label: "Blood Group",
// //               name: "employeeRegistration.bloodGroup",
// //               type: "text",
// //             },
// //             {
// //               label: "Father/Mother Name",
// //               name: "employeeRegistration.fatherOrMotherName",
// //               type: "text",
// //             },
// //             {
// //               label: "Spouse Name",
// //               name: "employeeRegistration.spouseName",
// //               type: "text",
// //             },
// //             {
// //               label: "Phone",
// //               name: "employeeRegistration.contact.phone",
// //               type: "text",
// //             },
// //             {
// //               label: "Email",
// //               name: "employeeRegistration.contact.email",
// //               type: "email",
// //             },
// //             {
// //               label: "Bank Name",
// //               name: "employeeRegistration.bankDetails.bankName",
// //               type: "text",
// //             },
// //             {
// //               label: "Account Number",
// //               name: "employeeRegistration.bankDetails.accountNumber",
// //               type: "text",
// //             },
// //             {
// //               label: "IFSC Code",
// //               name: "employeeRegistration.bankDetails.ifscCode",
// //               type: "text",
// //             },
// //             {
// //               label: "Income Tax PAN",
// //               name: "employeeRegistration.incomeTaxPAN",
// //               type: "text",
// //             },
// //             {
// //               label: "Aadhaar Card",
// //               name: "employeeRegistration.aadhaarCard",
// //               type: "text",
// //             },
// //             {
// //               label: "PF Account Number",
// //               name: "employeeRegistration.pfAccountNumber",
// //               type: "text",
// //             },
// //             {
// //               label: "PR Account Number",
// //               name: "employeeRegistration.prAccountNumber",
// //               type: "text",
// //             },
// //             {
// //               label: "ESI Number",
// //               name: "employeeRegistration.esiNumber",
// //               type: "text",
// //             },
// //             {
// //               label: "Date of Hire",
// //               name: "employeeRegistration.dateOfHire",
// //               type: "date",
// //             },
// //           ].map((field, index) => {
// //             const nameParts = field.name.split(".");
// //             const value =
// //               nameParts.reduce((acc, part) => acc && acc[part], formData) || "";

// //             return (
// //               <div key={index} className="mb-4">
// //                 <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
// //                   {field.label}
// //                 </label>
// //                 {field.type === "select" ? (
// //                   <select
// //                     name={field.name}
// //                     value={value}
// //                     onChange={handleChange}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
// //                   >
// //                     {field.options.map((option, idx) => (
// //                       <option key={idx} value={option}>
// //                         {option}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 ) : (
// //                   <input
// //                     type={field.type}
// //                     name={field.name}
// //                     value={field.type === "date" ? formatDate(value) : value}
// //                     onChange={handleChange}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
// //                   />
// //                 )}
// //                 {console.log("Date value:", value)}
// //                 {console.log("Formatted date:", formatDate(value))}
// //               </div>
// //             );
// //           })}
// //           {/* File Upload */}
// //           <div className="flex items-center justify-between">
// //             <div className="w-full max-w-md bg-gray-900 text-white shadow-md rounded-md ">
// //               <div className="flex items-center space-x-4">
// //                 <figure className="w-24 h-24 flex-shrink-0">
// //                   <img
// //                     src={avatarPreview}
// //                     className="w-full h-full object-cover rounded-full border border-gray-600"
// //                     alt="Avatar"
// //                   />
// //                 </figure>
// //                 <div className="flex-1">
// //                   <input
// //                     type="file"
// //                     name="avatar"
// //                     onChange={handleImageChange}
// //                     className="hidden"
// //                     id="customFile"
// //                   />
// //                   <label
// //                     htmlFor="customFile"
// //                     className="mt-1 block py-2 px-4 border border-gray-600 rounded-md text-sm font-medium text-white cursor-pointer hover:bg-gray-700"
// //                   >
// //                     Choose File
// //                   </label>
// //                 </div>
// //               </div>
// //             </div>
// //             {/* Dropdown */}
// //             <div ref={dropdownRef} className="relative w-full max-w-xs mt-7">
// //               <div
// //                 className="flex items-center justify-between p-2 border border-gray-300 rounded bg-white cursor-pointer"
// //                 onClick={() => setIsOpen(!isOpen)}
// //               >
// //                 <span className="truncate">
// //                   {selectedGroup ? selectedGroup.name : "Select a group"}
// //                 </span>
// //                 {isOpen ? (
// //                   <HiChevronUp className="text-gray-500" />
// //                 ) : (
// //                   <HiChevronDown className="text-gray-500" />
// //                 )}
// //               </div>

// //               {isOpen && (
// //                 <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
// //                   <div className="p-2 border-b border-gray-300">
// //                     <input
// //                       type="text"
// //                       placeholder="Search..."
// //                       value={searchTerm}
// //                       onChange={(e) => setSearchTerm(e.target.value)}
// //                       className="w-full p-1 border border-gray-300 rounded"
// //                     />
// //                   </div>
// //                   <div className="max-h-60 overflow-y-auto">
// //                     {filteredGroups.length > 0 ? (
// //                       filteredGroups.map((group) => (
// //                         <div
// //                           key={group._id}
// //                           className="p-2 hover:bg-gray-100 cursor-pointer"
// //                           onClick={() => handleSelect(group)}
// //                         >
// //                           {group.name}
// //                         </div>
// //                       ))
// //                     ) : (
// //                       <div className="p-2 text-gray-500">
// //                         No groups available
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //           <div className="flex items-center justify-between">
// //             <button
// //               type="submit"
// //               disabled={isLoading}
// //               className={`py-2 px-4 rounded-md shadow-md ${
// //                 isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
// //               } text-white`}
// //             >
// //               {isLoading ? "Creating..." : "Create Employee"}
// //             </button>
// //           </div>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default UpdateEmployeeForm;
// import { useState, useEffect, useRef } from "react";
// import {
//   useUpdateEmployeeByIdMutation,
//   useGetEmployeeDetailsByIdQuery,
// } from "../store/api/StaffApi";
// import { useGetTaxesQuery } from "../store/api/TaxApi";
// import { HiChevronDown, HiChevronUp } from "react-icons/hi";
// import { useGetGroupsQuery } from "../store/api/Group";
// import { useCreateLedgerMutation } from "../store/api/LedgerPayHead";
// import { useParams } from "react-router-dom";

// const UpdateEmployeeForm = () => {
//   const { employeeId } = useParams();
//   const dropdownRef = useRef(null);
//   const [createEmployee] = useUpdateEmployeeByIdMutation();
//   const [createLedger] = useCreateLedgerMutation();

//   // Initial state setup
//   const [formData, setFormData] = useState({
//     registrationType: "employee",
//     employeeRegistration: {
//       name: "",
//       designation: "",
//       address: "",
//       gender: "",
//       dateOfBirth: "",
//       bloodGroup: "",
//       fatherOrMotherName: "",
//       spouseName: "",
//       contact: { phone: "", email: "" },
//       bankDetails: { bankName: "", accountNumber: "", ifscCode: "" },
//       incomeTaxPAN: "",
//       aadhaarCard: "",
//       pfAccountNumber: "",
//       prAccountNumber: "",
//       under: "",
//       esiNumber: "",
//       dateOfHire: "",
//       salary: 0,
//       status: "active",
//       attendance: "Present",
//       registrationType: "employee",
//       basicPay: 0,
//       DA: 0,
//       HRA: 0,
//       overtime: 0,
//       EPF: 0,
//       ESI: 0,
//       conveyance: 0,
//       tax: 0,
//       advance: 0,
//     },
//     under: "",
//     name: "",
//     group: "",
//   });

//   const [avatar, setAvatar] = useState("");
//   const [avatarPreview, setAvatarPreview] = useState(
//     "/images/default_avatar.png"
//   );

//   const { data: ledgers } = useGetTaxesQuery();
//   const { data: groups = [], error, isLoading } = useGetGroupsQuery();

//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const {
//     data: specificEmployee,
//     isLoading: voucherLoading,
//     isError: voucherError,
//     refetch: refetchVoucherData,
//   } = useGetEmployeeDetailsByIdQuery(employeeId || "", {
//     skip: !employeeId,
//   });

//   useEffect(() => {
//     if (specificEmployee) {
//       setFormData((prevState) => ({
//         ...prevState,
//         employeeRegistration: {
//           ...prevState.employeeRegistration,
//           ...specificEmployee,
//           dateOfHire: formatDate(specificEmployee.dateOfHire),
//           dateOfBirth: formatDate(specificEmployee.dateOfBirth),
//         },
//         under: specificEmployee.under || prevState.under,
//         name: specificEmployee.name || prevState.name,
//         group: specificEmployee.group || prevState.group,
//       }));

//       const initialGroup = groups.find(
//         (group) => group._id === specificEmployee.under
//       );
//       if (initialGroup) {
//         setSelectedGroup(initialGroup);
//       }

//       if (specificEmployee.avatar) {
//         setAvatarPreview(specificEmployee.avatar);
//       }
//     }
//   }, [specificEmployee, groups]);

//   const formatDate = (date) => {
//     if (!date) return "";
//     return new Date(date).toISOString().split("T")[0];
//   };

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

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const keys = name.split("."); // Split the name to determine the nesting level

//     if (keys.length > 1) {
//       // Handle nested fields
//       setFormData((prevState) => ({
//         ...prevState,
//         [keys[0]]: {
//           ...prevState[keys[0]],
//           [keys[1]]: value,
//         },
//       }));
//     } else {
//       // Handle non-nested fields
//       setFormData((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//     }
//   };

//   const filteredGroups = groups.filter((group) =>
//     group.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSelect = (group) => {
//     setFormData({
//       ...formData,
//       under: group._id,
//       group: group.name,
//     });
//     setSelectedGroup(group);
//     setIsOpen(false);
//   };

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

//   const handleDropdownChange = (selectedOption) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       employeeRegistration: {
//         ...prevState.employeeRegistration,
//         under: selectedOption._id,
//       },
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formDataToSubmit = new FormData();
//       Object.keys(formData.employeeRegistration).forEach((key) => {
//         const value = formData.employeeRegistration[key];
//         if (typeof value === "object" && value !== null) {
//           Object.keys(value).forEach((subKey) => {
//             formDataToSubmit.append(
//               `employeeRegistration.${key}.${subKey}`,
//               value[subKey]
//             );
//           });
//         } else {
//           formDataToSubmit.append(`employeeRegistration.${key}`, value);
//         }
//       });

//       if (avatar) {
//         formDataToSubmit.append("avatar", avatar);
//       }

//       for (const [key, value] of formDataToSubmit.entries()) {
//         console.log(key, value);
//       }

//       const employeeResponse = await createEmployee(formDataToSubmit).unwrap();
//       console.log("Employee created successfully", employeeResponse);

//       if (formData.employeeRegistration.under) {
//         const ledgerData = {
//           name: formData.employeeRegistration.name,
//           under: formData.under,
//           group: formData.group,
//         };

//         const ledgerResponse = await createLedger(ledgerData).unwrap();
//         console.log("Ledger created successfully", ledgerResponse);
//       }

//       setFormData({
//         registrationType: "employee",
//         employeeRegistration: {
//           name: "",
//           designation: "",
//           address: "",
//           gender: "",
//           dateOfBirth: "",
//           bloodGroup: "",
//           fatherOrMotherName: "",
//           spouseName: "",
//           contact: { phone: "", email: "" },
//           bankDetails: { bankName: "", accountNumber: "", ifscCode: "" },
//           incomeTaxPAN: "",
//           aadhaarCard: "",
//           pfAccountNumber: "",
//           prAccountNumber: "",
//           under: "",
//           esiNumber: "",
//           dateOfHire: "",
//           salary: 0,
//           status: "active",
//           attendance: "Present",
//           basicPay: 0,
//           DA: 0,
//           HRA: 0,
//           overtime: 0,
//           EPF: 0,
//           ESI: 0,
//           conveyance: 0,
//           tax: 0,
//           advance: 0,
//         },
//         under: "",
//         name: "",
//         group: "",
//       });

//       alert("Employee and Ledger saved successfully!");
//     } catch (error) {
//       console.error("Failed to save employee or ledger: ", error);
//       alert("Failed to save employee or ledger.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-[95%] mx-auto p-8 bg-gray-100 dark:bg-gray-900 rounded shadow-md"
//       >
//         <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 sm:grid-cols-2">
//           {/* Form Fields */}
//           {[
//             { label: "Name", name: "employeeRegistration.name", type: "text" },
//             {
//               label: "Date of Birth",
//               name: "employeeRegistration.dateOfBirth",
//               type: "date",
//             },
//             {
//               label: "Date of Hire",
//               name: "employeeRegistration.dateOfHire",
//               type: "date",
//             },
//             // Add more fields as needed
//           ].map((field) => (
//             <div key={field.name} className="flex flex-col">
//               <label htmlFor={field.name} className="text-sm font-medium mb-1">
//                 {field.label}
//               </label>
//               <input
//                 type={field.type}
//                 id={field.name}
//                 name={field.name}
//                 value={
//                   formData.employeeRegistration[field.name.split(".")[1]] || ""
//                 }
//                 onChange={handleChange}
//                 className="p-2 border border-gray-300 rounded"
//               />
//             </div>
//           ))}

//           <div className="flex flex-col">
//             <label htmlFor="avatar" className="text-sm font-medium mb-1">
//               Avatar
//             </label>
//             <input
//               type="file"
//               id="avatar"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="p-2 border border-gray-300 rounded"
//             />
//             <img
//               src={avatarPreview}
//               alt="Avatar Preview"
//               className="mt-2 w-24 h-24 rounded-full"
//             />
//           </div>

//           {/* Group Dropdown */}
//           <div className="flex flex-col">
//             <label htmlFor="group" className="text-sm font-medium mb-1">
//               Group
//             </label>
//             <button
//               type="button"
//               onClick={() => setIsOpen(!isOpen)}
//               className="p-2 border border-gray-300 rounded flex items-center justify-between"
//             >
//               {selectedGroup ? selectedGroup.name : "Select Group"}
//               {isOpen ? <HiChevronUp /> : <HiChevronDown />}
//             </button>
//             {isOpen && (
//               <div
//                 ref={dropdownRef}
//                 className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-60 overflow-auto z-10"
//               >
//                 <input
//                   type="text"
//                   placeholder="Search Groups"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="p-2 border-b border-gray-300 w-full"
//                 />
//                 <ul>
//                   {filteredGroups.map((group) => (
//                     <li
//                       key={group._id}
//                       onClick={() => handleSelect(group)}
//                       className="p-2 hover:bg-gray-200 cursor-pointer"
//                     >
//                       {group.name}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div className="col-span-full flex justify-end mt-4">
//             <button
//               type="submit"
//               className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateEmployeeForm;
import React, { useState, useEffect } from "react";

const UpdateEmployeeForm = () => {
  // Initial state
  const [formData, setFormData] = useState({
    registrationType: "employee",
    employeeRegistration: {
      name: "",
      dateOfBirth: "",
      dateOfHire: "",
      contact: { phone: "", email: "" },
    },
    under: "",
    name: "",
    group: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length > 1) {
      // Handle nested fields
      setFormData((prevState) => ({
        ...prevState,
        employeeRegistration: {
          ...prevState.employeeRegistration,
          [keys[1]]: {
            ...prevState.employeeRegistration[keys[1]],
            [keys[2]]: value,
          },
        },
      }));
    } else {
      // Handle non-nested fields
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Convert date to YYYY-MM-DD format
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add your submission logic here
  };

  // Example useEffect to set initial form data (for demonstration)
  useEffect(() => {
    // Example specificEmployee data
    const specificEmployee = {
      name: "Ajith Kumar",
      dateOfBirth: "2024-09-13T00:00:00.000Z",
      dateOfHire: "2024-09-19T00:00:00.000Z",
      contact: { phone: "1234567890", email: "ajith@example.com" },
    };

    // Update formData with specificEmployee details
    setFormData((prevState) => ({
      ...prevState,
      employeeRegistration: {
        ...prevState.employeeRegistration,
        name: specificEmployee.name,
        dateOfBirth: formatDate(specificEmployee.dateOfBirth),
        dateOfHire: formatDate(specificEmployee.dateOfHire),
        contact: {
          phone: specificEmployee.contact.phone,
          email: specificEmployee.contact.email,
        },
      },
    }));
  }, []);

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-[95%] mx-auto p-8 bg-gray-100 dark:bg-gray-900 rounded shadow-md"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 sm:grid-cols-2">
          {/* Form Fields */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="employeeRegistration.name"
              value={formData.employeeRegistration.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="employeeRegistration.dateOfBirth"
              value={formData.employeeRegistration.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Date of Hire
            </label>
            <input
              type="date"
              name="employeeRegistration.dateOfHire"
              value={formData.employeeRegistration.dateOfHire}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Phone
            </label>
            <input
              type="text"
              name="employeeRegistration.contact.phone"
              value={formData.employeeRegistration.contact.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="employeeRegistration.contact.email"
              value={formData.employeeRegistration.contact.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            className="py-2 px-4 rounded-md shadow-md bg-green-500 hover:bg-green-600 text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployeeForm;
