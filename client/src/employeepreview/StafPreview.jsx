// import { useState, useEffect } from "react";
// import {
//   useUpdateEmployeeByIdMutation,
//   useGetEmployeeDetailsByIdQuery,
// } from "../store/api/StaffApi";
// import { useParams } from "react-router-dom";

// const UpdateEmployeeForm = () => {
//   const { employeeId } = useParams();
//   console.log("transactionId", employeeId);

//   const [updateEmployee] = useUpdateEmployeeByIdMutation();

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
//       panCardNo: "",
//     },
//     under: "",
//     name: "",
//     group: "",
//   });
//   console.log(
//     "formDatahere................................................ data",
//     formData.employeeRegistration.contact.phone
//   );
//   const [avatar, setAvatar] = useState("");
//   const [avatarPreview, setAvatarPreview] = useState(
//     "/images/default_avatar.png"
//   );

//   const {
//     data: specificEmployee,
//     isLoading: voucherLoading,
//     isError: voucherError,
//     refetch: refetchVoucherData,
//   } = useGetEmployeeDetailsByIdQuery(employeeId || "", {
//     skip: !employeeId,
//   });
//   const [updateEmployee] = useUpdateEmployeeByIdMutation();
//   console.log("paymentVoucher", specificEmployee);

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

//       if (specificEmployee.avatar) {
//         setAvatarPreview(specificEmployee.avatar);
//       }
//     }
//   }, [specificEmployee]);

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

//     if (keys.length === 1) {
//       // Handle non-nested fields
//       setFormData((prevState) => ({
//         ...prevState,
//         [keys[0]]: value,
//       }));
//     } else if (keys.length === 2) {
//       // Handle nested fields (first level of nesting)
//       setFormData((prevState) => ({
//         ...prevState,
//         [keys[0]]: {
//           ...prevState[keys[0]],
//           [keys[1]]: value,
//         },
//       }));
//     } else if (keys.length === 3) {
//       // Handle deeply nested fields (second level of nesting)
//       setFormData((prevState) => ({
//         ...prevState,
//         [keys[0]]: {
//           ...prevState[keys[0]],
//           [keys[1]]: {
//             ...prevState[keys[0]][keys[1]],
//             [keys[2]]: value,
//           },
//         },
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Create FormData instance for employee registration
//       const formDataToSubmit = new FormData();

//       // Append employee registration fields
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

//       // Append the avatar file to FormData if selected
//       if (avatar) {
//         formDataToSubmit.append("avatar", avatar);
//       }

//       // Add employee ID to FormData if updating an existing employee
//       formDataToSubmit.append("employeeId", employeeId);

//       // Debug FormData content
//       for (const [key, value] of formDataToSubmit.entries()) {
//         console.log(key, value);
//       }

//       // Submit employee data
//       const employeeResponse = await updateEmployee({
//         id: employeeId,
//         data: formDataToSubmit,
//       }).unwrap();
//       console.log("Employee updated successfully", employeeResponse);

//       // Reset form data after successful submission
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
//         },
//         under: "",
//         name: "",
//         group: "",
//       });

//       alert("Employee and Ledger updated successfully!");
//     } catch (error) {
//       console.error("Failed to update employee or ledger: ", error);
//       alert("Failed to update employee or ledger.");
//     }
//   };

//   return (
//     <div className="p-16">
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-[95%] mx-auto p-8 bg-gray-100 dark:bg-gray-900 rounded shadow-md"
//       >
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           {/* Form Fields */}
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Name
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.name"
//               value={formData.employeeRegistration.name}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Date of Birth
//             </label>
//             <input
//               type="date"
//               name="employeeRegistration.dateOfBirth"
//               value={formData.employeeRegistration.dateOfBirth}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Address
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.address"
//               value={formData.employeeRegistration.address}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Phone
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.contact.phone"
//               value={formData.employeeRegistration.contact.phone}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               name="employeeRegistration.contact.email"
//               value={formData.employeeRegistration.contact.email}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Spouse Name
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.spouseName"
//               value={formData.employeeRegistration.spouseName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Parent's Name
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.fatherOrMotherName"
//               value={formData.employeeRegistration.fatherOrMotherName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Blood Group
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.bloodGroup"
//               value={formData.employeeRegistration.bloodGroup}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Date of Hire
//             </label>
//             <input
//               type="date"
//               name="employeeRegistration.dateOfHire"
//               value={formData.employeeRegistration.dateOfHire}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Designation
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.designation"
//               value={formData.employeeRegistration.designation}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Aadhaar Card
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.aadhaarCard"
//               value={formData.employeeRegistration.aadhaarCard}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               PAN Card No
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.panCardNo"
//               value={formData.employeeRegistration.panCardNo}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Income Tax PAN
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.incomeTaxPAN"
//               value={formData.employeeRegistration.incomeTaxPAN}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               PF Account Number
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.pfAccountNumber"
//               value={formData.employeeRegistration.pfAccountNumber}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               PR Account Number
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.prAccountNumber"
//               value={formData.employeeRegistration.prAccountNumber}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               ESI Number
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.esiNumber"
//               value={formData.employeeRegistration.esiNumber}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Bank Name
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.bankDetails.bankName"
//               value={formData.employeeRegistration.bankDetails.bankName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               Account Number
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.bankDetails.accountNumber"
//               value={formData.employeeRegistration.bankDetails.accountNumber}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
//               IFSC Code
//             </label>
//             <input
//               type="text"
//               name="employeeRegistration.bankDetails.ifscCode"
//               value={formData.employeeRegistration.bankDetails.ifscCode}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
//             />
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mt-6 gap-4">
//           {/* Avatar Upload */}
//           <div className="w-full lg:w-1/2 bg-gray-900 text-white shadow-md rounded-md">
//             <div className="flex items-center space-x-4">
//               <figure className="w-24 h-24 flex-shrink-0">
//                 <img
//                   src={avatarPreview}
//                   className="w-full h-full object-cover rounded-full border border-gray-600"
//                   alt="Avatar"
//                 />
//               </figure>
//               <div className="flex-1">
//                 <input
//                   type="file"
//                   name="avatar"
//                   onChange={handleImageChange}
//                   className="hidden"
//                   id="customFile"
//                 />
//                 <label
//                   htmlFor="customFile"
//                   className="mt-1 block py-2 px-4 border border-gray-600 rounded-md text-sm font-medium text-white cursor-pointer hover:bg-gray-700"
//                 >
//                   Choose File
//                 </label>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between mt-6">
//             <button
//               type="submit"
//               disabled={voucherLoading}
//               className={`py-2 px-4 rounded-md shadow-md ${
//                 voucherLoading
//                   ? "bg-gray-400"
//                   : "bg-green-500 hover:bg-green-600"
//               } text-white`}
//             >
//               {voucherLoading ? "Creating..." : "Create Employee"}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateEmployeeForm;

import { useState, useEffect, useRef } from "react";

import { useGetTaxesQuery } from "../store/api/TaxApi";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useGetGroupsQuery } from "../store/api/Group";
import UnderPayHead1 from "../employeepreview/UnderPayHead2";
import { useCreateLedgerMutation } from "../store/api/LedgerPayHead";
import { useGetLedgerQuery } from "../store/api/LedgerApi";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useUpdateEmployeeByIdMutation,
  useGetEmployeeDetailsByIdQuery,
} from "../store/api/StaffApi";
const UpdateEmployeeForm = () => {
  const { employeeId } = useParams();
  console.log("transactionId", employeeId);

  const location = useLocation();
  const dropdownRef = useRef(null);
  const navigate = useNavigate;
  const [createEmployee] = useUpdateEmployeeByIdMutation();
  const [createLedger] = useCreateLedgerMutation();
  const {
    data: specificEmployee,
    isLoading: voucherLoading,
    isError: voucherError,
    refetch: refetchVoucherData,
  } = useGetEmployeeDetailsByIdQuery(employeeId || "", {
    skip: !employeeId,
  });
  const { data: getLedger } = useGetLedgerQuery(employeeId || "", {
    skip: !employeeId,
  });
  console.log("getLedger", getLedger);
  console.log("paymentVoucher", specificEmployee);
  const [formData, setFormData] = useState({
    registrationType: "employee",
    name: "",
    stockName: "",
    designation: "",
    address: "",
    gender: "",
    dateOfBirth: "", // Date of Birth field
    bloodGroup: "",
    fatherOrMotherName: "",
    spouseName: "",
    contactPhone: "",
    contactEmail: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    incomeTaxPAN: "",
    aadhaarCard: "",
    pfAccountNumber: "",
    prAccountNumber: "",
    under: "",

    esiNumber: "",
    dateOfHire: "", // Date of Hire field
    underForLedger: "",
    group: "",
    category: "",
    nature: "",
    selectedOption: "",
  });
  console.log("hai", formData);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.png"
  );
  const { data: ledgers = [] } = useGetTaxesQuery();
  const { data: groups = [], isLoading } = useGetGroupsQuery();

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(e.target.files[0]);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const handleDropdownChange = (selectedOption) => {
    console.log("selectedOption", selectedOption);

    setFormData((prevState) => ({
      ...prevState,
      under: selectedOption._id, //
      selectedOption: selectedOption.name,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    if (specificEmployee && getLedger && getLedger.length > 0) {
      const ledger = getLedger[0]; // Accessing the first item in the getLedger array

      setFormData((prevState) => ({
        ...prevState,
        registrationType:
          specificEmployee.registrationType || prevState.registrationType,
        name: specificEmployee.name || prevState.name,
        stockName: ledger.name || prevState.stockName,
        designation: specificEmployee.designation || prevState.designation,
        address: specificEmployee.address || prevState.address,
        gender: specificEmployee.gender || prevState.gender,
        dateOfBirth:
          formatDate(specificEmployee.dateOfBirth) || prevState.dateOfBirth, // Format Date of Birth
        bloodGroup: specificEmployee.bloodGroup || prevState.bloodGroup,
        fatherOrMotherName:
          specificEmployee.familyDetails?.fatherOrMotherName ||
          prevState.fatherOrMotherName, // Accessing nested familyDetails
        spouseName:
          specificEmployee.familyDetails?.spouseName || prevState.spouseName, // Accessing nested familyDetails
        contactPhone: specificEmployee.contact?.phone || prevState.contactPhone, // Accessing nested contact
        contactEmail: specificEmployee.contact?.email || prevState.contactEmail, // Accessing nested contact
        bankName: specificEmployee.bankDetails?.bankName || prevState.bankName, // Accessing nested bankDetails
        accountNumber:
          specificEmployee.bankDetails?.accountNumber ||
          prevState.accountNumber, // Accessing nested bankDetails
        ifscCode: specificEmployee.bankDetails?.ifscCode || prevState.ifscCode, // Accessing nested bankDetails
        incomeTaxPAN: specificEmployee.incomeTaxPAN || prevState.incomeTaxPAN,
        aadhaarCard: specificEmployee.aadhaarCard || prevState.aadhaarCard,
        pfAccountNumber:
          specificEmployee.pfAccountNumber || prevState.pfAccountNumber,
        prAccountNumber:
          specificEmployee.prAccountNumber || prevState.prAccountNumber,
        under: specificEmployee.under || prevState.under,
        esiNumber: specificEmployee.esiNumber || prevState.esiNumber,
        dateOfHire:
          formatDate(specificEmployee.dateOfHire) || prevState.dateOfHire, // Format Date of Hire

        // Accessing data from the first ledger item in the getLedger array
        underForLedger: ledger.under || prevState.underForLedger,
        group: ledger.group || prevState.group, // Accessing ledger.group as a string
        category: ledger.category || prevState.category,
        nature: ledger.nature || prevState.nature,
      }));

      // Set avatar preview if available
      if (specificEmployee.avatar) {
        setAvatarPreview(specificEmployee.avatar);
      }
    }
  }, [specificEmployee, getLedger]); // Added getLedger to the dependency array

  // Utility function to format dates in "YYYY-MM-DD" format
  const formatDate = (date) => {
    if (!date) return ""; // Return empty string if no date
    return new Date(date).toISOString().split("T")[0]; // Format date to YYYY-MM-DD
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (group) => {
    setFormData((prevData) => ({
      ...prevData,
      underForLedger: group._id,
      group: group.name,
      nature: group.nature,
      category: group.category,
    }));
    setSelectedGroup(group);
    setIsOpen(false);
  };
  const handleGenderChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      gender: e.target.value, // Update gender selection
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.under) {
      toast.error("Please select a valid group before saving the ledger.");
      return;
    }

    try {
      const ledgerData = {
        name: formData.stockName,
        under: formData.underForLedger,
        group: formData.group,
        nature: formData.nature,
        category: formData.category,
      };

      const ledgerResponse = await createLedger(ledgerData).unwrap();
      console.log("Ledger created successfully", ledgerResponse);

      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSubmit.append(key, formData[key]);
      });

      if (avatar) {
        formDataToSubmit.append("avatar", avatar);
      }

      const employeeResponse = await createEmployee(formDataToSubmit).unwrap();
      navigate("/staff/payHeadDetails");
      resetFormData();
      toast.success("Employee and Ledger saved successfully!");
    } catch (error) {
      console.error("Failed to save ledger or employee: ", error);
      toast.error("Failed to save ledger or employee.");
    }
  };

  const resetFormData = () => {
    setFormData({
      registrationType: "employee",
      name: "",
      stockName: "",
      designation: "",
      address: "",
      phone: "",
      email: "",
      gender: "",
      dateOfBirth: "", // Reset Date of Birth field
      bloodGroup: "",
      fatherOrMotherName: "",
      spouseName: "",
      contactPhone: "",

      contactEmail: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      incomeTaxPAN: "",
      aadhaarCard: "",
      pfAccountNumber: "",
      prAccountNumber: "",
      under: "",
      esiNumber: "",
      dateOfHire: "", // Reset Date of Hire field
      group: "",
      category: "",
      nature: "",
    });
    setAvatar("");
    setAvatarPreview("/images/default_avatar.png");
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-[95%] mx-auto p-8 bg-gray-100 dark:bg-gray-900 rounded shadow-md  mt-10"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 sm:grid-cols-2 mb-4">
          <div className="lg:col-span-2 w-full bg-gray-900 text-white shadow-md rounded-md ">
            <div className="flex items-center space-x-4 p-4">
              <figure className="w-12 h-12 flex-shrink-0">
                <img
                  src={avatarPreview}
                  className="w-full h-full object-cover rounded-full border border-gray-600"
                  alt="Avatar"
                />
              </figure>
              <div className="flex-1">
                <input
                  type="file"
                  name="avatar"
                  onChange={handleImageChange}
                  className="hidden"
                  id="customFile"
                />
                <label
                  htmlFor="customFile"
                  className="mt-1 block py-2 px-4 border border-gray-600 rounded-md text-sm font-medium text-white cursor-pointer hover:bg-gray-700"
                >
                  Choose File
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Who is
            </label>
            <UnderPayHead1
              selectedOption={formData.under || "hai"} // Pass selected option here
              hello={handleDropdownChange} // Handles dropdown selection
              options={ledgers || []} // Options to display in dropdown
              manu={formData.stockName}
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              For Company
            </label>
            <input
              type="text"
              name="stockName"
              value={formData.stockName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder="" // Optional placeholder
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold ">
              In group
            </label>
            <div
              ref={dropdownRef}
              className="relative lg:col-span-1 w-full max-w-xs mt-2"
            >
              <div
                className="flex items-center justify-between p-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="truncate text-gray-700 dark:text-gray-300">
                  {selectedGroup ? selectedGroup.name : formData.group}
                </span>

                {isOpen ? (
                  <HiChevronUp className="text-gray-500 dark:text-gray-400" />
                ) : (
                  <HiChevronDown className="text-gray-500 dark:text-gray-400" />
                )}
              </div>

              {isOpen && (
                <div className="absolute w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-10">
                  <div className="p-2 border-b border-gray-300 dark:border-gray-700">
                    <input
                      type="text"
                      placeholder=""
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((group) => (
                        <div
                          key={group._id}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300"
                          onClick={() => handleSelect(group)}
                        >
                          {console.log("group", group)}
                          {group.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500 dark:text-gray-400">
                        No groups available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional fields for employee registration can be added here */}
          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={handleGenderChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Date of Hire
            </label>
            <input
              type="date"
              name="dateOfHire"
              value={formData.dateOfHire}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Father/Mother Name
            </label>
            <input
              type="text"
              name="fatherOrMotherName"
              value={formData.fatherOrMotherName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Spouse Name
            </label>
            <input
              type="text"
              name="spouseName"
              value={formData.spouseName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Esi
            </label>
            <input
              type="text"
              name="esiNumber"
              value={formData.esiNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Provident Fund
            </label>
            <input
              type="text"
              name="pfAccountNumber"
              value={formData.pfAccountNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Blood Group
            </label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Phone
            </label>
            <input
              type="text"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="text"
              name="contactEmail"
              value={formData.Email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Bank Name
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Ifsc code
            </label>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Income Tax Number
            </label>
            <input
              type="text"
              name="incomeTaxPAN"
              value={formData.incomeTaxPAN}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Adhar card
            </label>
            <input
              type="text"
              name="aadhaarCard"
              value={formData.aadhaarCard}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              PR Account Number
            </label>
            <input
              type="text"
              name="prAccountNumber"
              value={formData.prAccountNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder=""
            />
          </div>
          <div className="flex items-center justify-between w-full ">
            <button
              type="submit"
              disabled={isLoading}
              className={`py-2 px-4 rounded-md shadow-md w-full ${
                isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {isLoading ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateEmployeeForm;
