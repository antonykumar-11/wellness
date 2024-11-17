// import React, { useState, useRef } from "react";
// import { useCreateCompanyMutation } from "../store/api/CompanyApi";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function CreateCompany() {
//   const [createCompany, { isLoading }] = useCreateCompanyMutation();
//   const [companyDetails, setCompanyDetails] = useState({
//     companyName: "",
//     registrationType: "",
//     registrationUnder: "",
//     street: "",
//     MainArea: "",
//     postOffice: "",
//     ZIPCode: "",
//     City: "",
//     State: "",
//     Country: "",
//     companyMobile: "",
//     companyEmail: "",
//     gstNumber: "",
//     companyPanNumber: "",
//     companyAdarNumber: "",
//     bankName: "",
//     branch: "",
//     accountNumber: "",
//     ifscCode: "",
//     authorizedByName: "",
//     authorizedByDesignation: "",
//     authorizedBySignature: "",
//     tanNumber: "",
//     tdsDeductionNo: "",
//     image: null,
//   });

//   // Refs for each input field
//   const refs = {
//     companyNameRef: useRef(null),
//     registrationTypeRef: useRef(null),
//     registrationUnderRef: useRef(null),
//     streetRef: useRef(null),
//     MainAreaRef: useRef(null),
//     postOfficeRef: useRef(null),
//     ZIPCodeRef: useRef(null),
//     CityRef: useRef(null),
//     StateRef: useRef(null),
//     CountryRef: useRef(null),
//     companyMobileRef: useRef(null),
//     companyEmailRef: useRef(null),
//     gstNumberRef: useRef(null),
//     companyPanNumberRef: useRef(null),
//     companyAdarNumberRef: useRef(null),
//     bankNameRef: useRef(null),
//     branchRef: useRef(null),
//     accountNumberRef: useRef(null),
//     ifscCodeRef: useRef(null),
//     authorizedByNameRef: useRef(null),
//     authorizedByDesignationRef: useRef(null),
//     authorizedBySignatureRef: useRef(null),
//     tanNumberRef: useRef(null),
//     tdsDeductionNoRef: useRef(null),
//     imageRef: useRef(null),
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setCompanyDetails((prevDetails) => ({
//       ...prevDetails,
//       [name]: name === "image" ? files[0] : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await createCompany(companyDetails).unwrap();
//       toast.success("Company created successfully!");
//       setCompanyDetails({
//         companyName: "",
//         registrationType: "",
//         registrationUnder: "",
//         street: "",
//         MainArea: "",
//         postOffice: "",
//         ZIPCode: "",
//         City: "",
//         State: "",
//         Country: "",
//         companyMobile: "",
//         companyEmail: "",
//         gstNumber: "",
//         companyPanNumber: "",
//         companyAdarNumber: "",
//         bankName: "",
//         branch: "",
//         accountNumber: "",
//         ifscCode: "",
//         authorizedByName: "",
//         authorizedByDesignation: "",
//         authorizedBySignature: "",
//         tanNumber: "",
//         tdsDeductionNo: "",
//         image: null,
//       });
//     } catch (err) {
//       toast.error("Failed to create company. Please try again.");
//     }
//   };

//   const handleKeyDown = (e, currentRef, nextRef, prevRef) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       if (e.shiftKey) {
//         // Shift + Enter to move to previous input
//         if (prevRef && prevRef.current) {
//           prevRef.current.focus();
//         }
//       } else {
//         // Enter to move to next input
//         if (nextRef && nextRef.current) {
//           nextRef.current.focus();
//         }
//       }
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Create Company</h1>
//       <form
//         onSubmit={handleSubmit}
//         className="space-y-6 rounded-lg p-6 shadow-md transition-all duration-300 ease-in-out bg-gray-200 dark:bg-gray-800"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Field for Company Name */}
//           <div className="mb-4">
//             <label
//               htmlFor="companyName"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Company Name
//             </label>
//             <input
//               type="text"
//               id="companyName"
//               name="companyName"
//               value={companyDetails.companyName}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.companyNameRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.registrationTypeRef,
//                   refs.registrationTypeRef,
//                   null
//                 )
//               }
//             />
//           </div>

//           {/* Field for Registration Type */}
//           <div className="mb-4">
//             <label
//               htmlFor="registrationType"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Registration Type
//             </label>
//             <input
//               type="text"
//               id="registrationType"
//               name="registrationType"
//               value={companyDetails.registrationType}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.registrationTypeRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.registrationUnderRef,
//                   refs.registrationUnderRef,
//                   refs.companyNameRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for Registration Under */}
//           <div className="mb-4">
//             <label
//               htmlFor="registrationUnder"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Registration Under
//             </label>
//             <input
//               type="text"
//               id="registrationUnder"
//               name="registrationUnder"
//               value={companyDetails.registrationUnder}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.registrationUnderRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.streetRef,
//                   refs.streetRef,
//                   refs.registrationTypeRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for Street */}
//           <div className="mb-4">
//             <label
//               htmlFor="street"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Street
//             </label>
//             <input
//               type="text"
//               id="street"
//               name="street"
//               value={companyDetails.street}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.streetRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.MainAreaRef,
//                   refs.MainAreaRef,
//                   refs.registrationUnderRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for Main Area */}
//           <div className="mb-4">
//             <label
//               htmlFor="MainArea"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Main Area
//             </label>
//             <input
//               type="text"
//               id="MainArea"
//               name="MainArea"
//               value={companyDetails.MainArea}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.MainAreaRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.postOfficeRef,
//                   refs.postOfficeRef,
//                   refs.streetRef
//                 )
//               }
//             />
//           </div>
//           {/* Field for Main Area */}
//           <div className="mb-4">
//             <label
//               htmlFor="MainArea"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               post office
//             </label>
//             <input
//               type="text"
//               id="postOffice"
//               name="postOffice"
//               value={companyDetails.postOffice}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.postOfficeRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.ZIPCodeRef,
//                   refs.ZIPCodeRef,
//                   refs.MainAreaRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for ZIP Code */}
//           <div className="mb-4">
//             <label
//               htmlFor="ZIPCode"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               ZIP Code
//             </label>
//             <input
//               type="text"
//               id="ZIPCode"
//               name="ZIPCode"
//               value={companyDetails.ZIPCode}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.ZIPCodeRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(e, refs.CityRef, refs.CityRef, refs.MainAreaRef)
//               }
//             />
//           </div>

//           {/* Field for City */}
//           <div className="mb-4">
//             <label
//               htmlFor="City"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               City
//             </label>
//             <input
//               type="text"
//               id="City"
//               name="City"
//               value={companyDetails.City}
//               onChange={handleChange}
//               placeholder="Enter City"
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.CityRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(e, refs.StateRef, refs.StateRef, refs.ZIPCodeRef)
//               }
//             />
//           </div>

//           {/* Field for State */}
//           <div className="mb-4">
//             <label
//               htmlFor="State"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               State
//             </label>
//             <input
//               type="text"
//               id="State"
//               name="State"
//               value={companyDetails.State}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.StateRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(e, refs.CountryRef, refs.CountryRef, refs.CityRef)
//               }
//             />
//           </div>

//           {/* Field for Country */}
//           <div className="mb-4">
//             <label
//               htmlFor="Country"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Country
//             </label>
//             <input
//               type="text"
//               id="Country"
//               name="Country"
//               value={companyDetails.Country}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.CountryRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.companyMobileRef,
//                   refs.companyMobileRef,
//                   refs.StateRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for Company Mobile */}
//           <div className="mb-4">
//             <label
//               htmlFor="companyMobile"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Company Mobile
//             </label>
//             <input
//               type="text"
//               id="companyMobile"
//               name="companyMobile"
//               value={companyDetails.companyMobile}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.companyMobileRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.companyEmailRef,
//                   refs.companyEmailRef,
//                   refs.CountryRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for Company Email */}
//           <div className="mb-4">
//             <label
//               htmlFor="companyEmail"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Company Email
//             </label>
//             <input
//               type="email"
//               id="companyEmail"
//               name="companyEmail"
//               value={companyDetails.companyEmail}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.companyEmailRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.gstNumberRef,
//                   refs.gstNumberRef,
//                   refs.companyMobileRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for GST Number */}
//           <div className="mb-4">
//             <label
//               htmlFor="gstNumber"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               GST Number
//             </label>
//             <input
//               type="text"
//               id="gstNumber"
//               name="gstNumber"
//               value={companyDetails.gstNumber}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.gstNumberRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.companyPanNumberRef,
//                   refs.companyPanNumberRef,
//                   refs.companyEmailRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for Company PAN Number */}
//           <div className="mb-4">
//             <label
//               htmlFor="companyPanNumber"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Company PAN Number
//             </label>
//             <input
//               type="text"
//               id="companyPanNumber"
//               name="companyPanNumber"
//               value={companyDetails.companyPanNumber}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.companyPanNumberRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.companyAdarNumberRef,
//                   refs.companyAdarNumberRef,
//                   refs.gstNumberRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for Company Aadhaar Number */}
//           <div className="mb-4">
//             <label
//               htmlFor="companyAdarNumber"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Company Aadhaar Number
//             </label>
//             <input
//               type="text"
//               id="companyAdarNumber"
//               name="companyAdarNumber"
//               value={companyDetails.companyAdarNumber}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.companyAdarNumberRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.bankNameRef,
//                   refs.bankNameRef,
//                   refs.companyPanNumberRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for Bank Name */}
//           <div className="mb-4">
//             <label
//               htmlFor="bankName"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Bank Name
//             </label>
//             <input
//               type="text"
//               id="bankName"
//               name="bankName"
//               value={companyDetails.bankName}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.bankNameRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.branchRef,
//                   refs.branchRef,
//                   refs.companyAdarNumberRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for Branch */}
//           <div className="mb-4">
//             <label
//               htmlFor="branch"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Branch
//             </label>
//             <input
//               type="text"
//               id="branch"
//               name="branch"
//               value={companyDetails.branch}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.branchRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.accountNumberRef,
//                   refs.accountNumberRef,
//                   refs.bankNameRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for Account Number */}
//           <div className="mb-4">
//             <label
//               htmlFor="accountNumber"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Account Number
//             </label>
//             <input
//               type="text"
//               id="accountNumber"
//               name="accountNumber"
//               value={companyDetails.accountNumber}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.accountNumberRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.ifscCodeRef,
//                   refs.ifscCodeRef,
//                   refs.branchRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for IFSC Code */}
//           <div className="mb-4">
//             <label
//               htmlFor="ifscCode"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               IFSC Code
//             </label>
//             <input
//               type="text"
//               id="ifscCode"
//               name="ifscCode"
//               value={companyDetails.ifscCode}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.ifscCodeRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.authorizedByNameRef,
//                   refs.authorizedByNameRef,
//                   refs.accountNumberRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for Authorized By Name */}
//           <div className="mb-4">
//             <label
//               htmlFor="authorizedByName"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Authorized By Name
//             </label>
//             <input
//               type="text"
//               id="authorizedByName"
//               name="authorizedByName"
//               value={companyDetails.authorizedByName}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.authorizedByNameRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.authorizedByDesignationRef,
//                   refs.authorizedByDesignationRef,
//                   refs.ifscCodeRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for Authorized By Designation */}
//           <div className="mb-4">
//             <label
//               htmlFor="authorizedByDesignation"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Authorized By Designation
//             </label>
//             <input
//               type="text"
//               id="authorizedByDesignation"
//               name="authorizedByDesignation"
//               value={companyDetails.authorizedByDesignation}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.authorizedByDesignationRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.authorizedBySignatureRef,
//                   refs.authorizedBySignatureRef,
//                   refs.authorizedByNameRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for Authorized By Signature */}
//           <div className="mb-4">
//             <label
//               htmlFor="authorizedBySignature"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               Authorized By Signature
//             </label>
//             <input
//               type="text"
//               id="authorizedBySignature"
//               name="authorizedBySignature"
//               value={companyDetails.authorizedBySignature}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.authorizedBySignatureRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.tanNumberRef,
//                   refs.tanNumberRef,
//                   refs.authorizedByDesignationRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for TAN Number */}
//           <div className="mb-4">
//             <label
//               htmlFor="tanNumber"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               TAN Number
//             </label>
//             <input
//               type="text"
//               id="tanNumber"
//               name="tanNumber"
//               value={companyDetails.tanNumber}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.tanNumberRef}
//               onKeyDown={(e) =>
//                 handleKeyDown(
//                   e,
//                   refs.tdsDeductionNoRef,
//                   refs.tdsDeductionNoRef,
//                   refs.authorizedBySignatureRef
//                 )
//               }
//             />
//           </div>

//           {/* Field for TDS Deduction Number */}
//           <div className="mb-4">
//             <label
//               htmlFor="tdsDeductionNo"
//               className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
//             >
//               TDS Deduction Number
//             </label>
//             <input
//               type="text"
//               id="tdsDeductionNo"
//               name="tdsDeductionNo"
//               value={companyDetails.tdsDeductionNo}
//               onChange={handleChange}
//               placeholder=""
//               className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
//               ref={refs.tdsDeductionNoRef}
//               onKeyDown={(e) => handleKeyDown(e, null, null, refs.tanNumberRef)}
//             />
//           </div>
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//           disabled={isLoading}
//         >
//           {isLoading ? "Creating..." : "Create Company"}
//         </button>
//         <ToastContainer />
//       </form>
//     </div>
//   );
// }

// export default CreateCompany;
import React, { useState, useRef } from "react";
import { useCreateCompanyMutation } from "../store/api/CompanyApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateCompany() {
  const [createCompany, { isLoading }] = useCreateCompanyMutation();
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",

    street: "",
    MainArea: "",
    postOffice: "",
    ZIPCode: "",
    City: "",
    State: "",
    Country: "",
    companyMobile: "",
    companyEmail: "",
    gstNumber: "",
    companyPanNumber: "",
    companyAdarNumber: "",
    bankName: "",
    branch: "",
    accountNumber: "",
    ifscCode: "",

    image: null,
  });

  // Refs for each input field
  const refs = {
    companyNameRef: useRef(null),
    registrationTypeRef: useRef(null),
    registrationUnderRef: useRef(null),
    streetRef: useRef(null),
    MainAreaRef: useRef(null),
    postOfficeRef: useRef(null),
    ZIPCodeRef: useRef(null),
    CityRef: useRef(null),
    StateRef: useRef(null),
    CountryRef: useRef(null),
    companyMobileRef: useRef(null),
    companyEmailRef: useRef(null),
    gstNumberRef: useRef(null),
    companyPanNumberRef: useRef(null),
    companyAdarNumberRef: useRef(null),
    bankNameRef: useRef(null),
    branchRef: useRef(null),
    accountNumberRef: useRef(null),
    ifscCodeRef: useRef(null),
    authorizedByNameRef: useRef(null),
    authorizedByDesignationRef: useRef(null),
    authorizedBySignatureRef: useRef(null),
    tanNumberRef: useRef(null),
    tdsDeductionNoRef: useRef(null),
    imageRef: useRef(null),
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setCompanyDetails((prevDetails) => ({
      ...prevDetails,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createCompany(companyDetails).unwrap();
      toast.success("Company created successfully!");
      setCompanyDetails({
        companyName: "",
        registrationType: "",
        registrationUnder: "",
        street: "",
        MainArea: "",
        postOffice: "",
        ZIPCode: "",
        City: "",
        State: "",
        Country: "",
        companyMobile: "",
        companyEmail: "",
        gstNumber: "",
        companyPanNumber: "",
        companyAdarNumber: "",
        bankName: "",
        branch: "",
        accountNumber: "",
        ifscCode: "",
        authorizedByName: "",
        authorizedByDesignation: "",
        authorizedBySignature: "",
        tanNumber: "",
        tdsDeductionNo: "",
        image: null,
      });
    } catch (err) {
      toast.error("Failed to create company. Please try again.");
    }
  };

  const handleKeyDown = (e, currentRef, nextRef, prevRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift + Enter to move to previous input
        if (prevRef && prevRef.current) {
          prevRef.current.focus();
        }
      } else {
        // Enter to move to next input
        if (nextRef && nextRef.current) {
          nextRef.current.focus();
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Company</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg p-6 shadow-md transition-all duration-300 ease-in-out bg-gray-200 dark:bg-gray-800"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Field for Company Name */}
          <div className="mb-4">
            <label
              htmlFor="companyName"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={companyDetails.companyName}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.companyNameRef}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  refs.registrationTypeRef,
                  refs.registrationTypeRef,
                  null
                )
              }
            />
          </div>

          {/* Field for Street */}
          <div className="mb-4">
            <label
              htmlFor="street"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              Address 1
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={companyDetails.street}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.streetRef}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  refs.MainAreaRef,
                  refs.MainAreaRef,
                  refs.registrationUnderRef
                )
              }
            />
          </div>

          {/* Field for Main Area */}
          <div className="mb-4">
            <label
              htmlFor="MainArea"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              Address 2
            </label>
            <input
              type="text"
              id="MainArea"
              name="MainArea"
              value={companyDetails.MainArea}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.MainAreaRef}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  refs.postOfficeRef,
                  refs.postOfficeRef,
                  refs.streetRef
                )
              }
            />
          </div>
          {/* Field for Main Area */}
          <div className="mb-4">
            <label
              htmlFor="MainArea"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              Address 3
            </label>
            <input
              type="text"
              id="postOffice"
              name="postOffice"
              value={companyDetails.postOffice}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.postOfficeRef}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  refs.ZIPCodeRef,
                  refs.ZIPCodeRef,
                  refs.MainAreaRef
                )
              }
            />
          </div>

          {/* Field for ZIP Code */}
          <div className="mb-4">
            <label
              htmlFor="ZIPCode"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              Address 4
            </label>
            <input
              type="text"
              id="ZIPCode"
              name="ZIPCode"
              value={companyDetails.ZIPCode}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.ZIPCodeRef}
              onKeyDown={(e) =>
                handleKeyDown(e, refs.CityRef, refs.CityRef, refs.MainAreaRef)
              }
            />
          </div>

          {/* Field for City */}
          <div className="mb-4">
            <label
              htmlFor="City"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              Adress 5
            </label>
            <input
              type="text"
              id="City"
              name="City"
              value={companyDetails.City}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.CityRef}
              onKeyDown={(e) =>
                handleKeyDown(e, refs.StateRef, refs.StateRef, refs.ZIPCodeRef)
              }
            />
          </div>

          {/* Field for Company Mobile */}
          <div className="mb-4">
            <label
              htmlFor="companyMobile"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              Company Mobile
            </label>
            <input
              type="text"
              id="companyMobile"
              name="companyMobile"
              value={companyDetails.companyMobile}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.companyMobileRef}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  refs.companyEmailRef,
                  refs.companyEmailRef,
                  refs.CountryRef
                )
              }
            />
          </div>

          {/* Field for Company Email */}
          <div className="mb-4">
            <label
              htmlFor="companyEmail"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              Company Email
            </label>
            <input
              type="email"
              id="companyEmail"
              name="companyEmail"
              value={companyDetails.companyEmail}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.companyEmailRef}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  refs.gstNumberRef,
                  refs.gstNumberRef,
                  refs.companyMobileRef
                )
              }
            />
          </div>

          {/* Field for GST Number */}
          <div className="mb-4">
            <label
              htmlFor="gstNumber"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              GST Number
            </label>
            <input
              type="text"
              id="gstNumber"
              name="gstNumber"
              value={companyDetails.gstNumber}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.gstNumberRef}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  refs.companyPanNumberRef,
                  refs.companyPanNumberRef,
                  refs.companyEmailRef
                )
              }
            />
          </div>

          {/* Field for Company PAN Number */}
          <div className="mb-4">
            <label
              htmlFor="companyPanNumber"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              Company PAN Number
            </label>
            <input
              type="text"
              id="companyPanNumber"
              name="companyPanNumber"
              value={companyDetails.companyPanNumber}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.companyPanNumberRef}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  refs.companyAdarNumberRef,
                  refs.companyAdarNumberRef,
                  refs.gstNumberRef
                )
              }
            />
          </div>

          {/* Field for Company Aadhaar Number */}
          <div className="mb-4">
            <label
              htmlFor="companyAdarNumber"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              Company Aadhaar Number
            </label>
            <input
              type="text"
              id="companyAdarNumber"
              name="companyAdarNumber"
              value={companyDetails.companyAdarNumber}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.companyAdarNumberRef}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  refs.bankNameRef,
                  refs.bankNameRef,
                  refs.companyPanNumberRef
                )
              }
            />
          </div>

          {/* Field for Bank Name */}
          <div className="mb-4">
            <label
              htmlFor="bankName"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={companyDetails.bankName}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.bankNameRef}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  refs.branchRef,
                  refs.branchRef,
                  refs.companyAdarNumberRef
                )
              }
            />
          </div>

          {/* Field for Branch */}
          <div className="mb-4">
            <label
              htmlFor="branch"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              Branch
            </label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={companyDetails.branch}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.branchRef}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  refs.accountNumberRef,
                  refs.accountNumberRef,
                  refs.bankNameRef
                )
              }
            />
          </div>

          {/* Field for Account Number */}
          <div className="mb-4">
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={companyDetails.accountNumber}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.accountNumberRef}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  refs.ifscCodeRef,
                  refs.ifscCodeRef,
                  refs.branchRef
                )
              }
            />
          </div>

          {/* Field for IFSC Code */}
          <div className="mb-4">
            <label
              htmlFor="ifscCode"
              className="block text-sm font-medium capitalize text-gray-700 dark:text-gray-300"
            >
              IFSC Code
            </label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              value={companyDetails.ifscCode}
              onChange={handleChange}
              placeholder=""
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              ref={refs.ifscCodeRef}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  refs.authorizedByNameRef,
                  refs.authorizedByNameRef,
                  refs.accountNumberRef
                )
              }
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Company"}
        </button>
        <ToastContainer />
      </form>
    </div>
  );
}

export default CreateCompany;
