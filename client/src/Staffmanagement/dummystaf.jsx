// import React, { useState } from "react";
// import { useCreateEmployeeMutation } from "../store/api/StaffApi";
// import { useGetTaxesQuery } from "../store/api/TaxApi";
// import UnderPayHead from "../Staffmanagement/UnderPayHead";
// import UnderPayHead1 from "../Staffmanagement/UderPayHead1";
// import { useGetGroupsQuery } from "../store/api/Group";
// const CreateEmployeeForm = () => {
//   const [createVehicleRegistration] = useCreateEmployeeMutation();
//   const { data: ledgers } = useGetTaxesQuery();

//   const [formData, setFormData] = useState({
//     vehicleDetails: {
//       vehicleRegistrationNumber: "", // This will be set based on the name field
//       ownerName: "",
//       vehicleType: "",
//       rentalStartDate: "",
//       ownerAddress: "",
//       phoneNumber: "",
//       gst: "",
//       pan: "",
//       ledgerId: "",
//     },
//     registrationType: "vehicle", // Assuming this is a required field
//     category: "",
//     nature: "",
//     name: "",
//     under: "",
//   });
//   const [avatar, setAvatar] = useState("");
//   console.log("avatar", avatar, formData);
//   const {
//     data: groups = [],
//     isLoading: groupsLoading,
//     isError: groupsError,
//   } = useGetGroupsQuery();
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

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prevFormData) => {
//       const updatedVehicleDetails = { ...prevFormData.vehicleDetails };

//       if (name === "name") {
//         // Synchronize the vehicleRegistrationNumber with the name field
//         updatedVehicleDetails.vehicleRegistrationNumber = value;
//       } else {
//         // Update other fields
//         updatedVehicleDetails[name] = value;
//       }

//       return {
//         ...prevFormData,
//         vehicleDetails: updatedVehicleDetails,
//         [name]: value, // Update the state with the new value
//       };
//     });
//   };

//   const handleDropdownChange = (selectedOption) => {
//     console.log("selectedOption", selectedOption);
//     if (selectedOption) {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         category: selectedOption.category || prevFormData.category,
//         nature: selectedOption.nature || prevFormData.nature,
//         name: selectedOption.name || prevFormData.name,
//         under: selectedOption._id || prevFormData.under,
//       }));
//     }
//   };
//   const handleDropdownChange1 = (selectedOption1) => {
//     console.log("selectedOption1", selectedOption1);

//     if (selectedOption1) {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//       }));
//     }
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Create a new FormData instance
//     const formDataToSubmit = new FormData();

//     // Append vehicle details to FormData
//     formDataToSubmit.append(
//       "vehicleRegistrationNumber",
//       formData.vehicleDetails.vehicleRegistrationNumber
//     );
//     formDataToSubmit.append("ownerName", formData.vehicleDetails.ownerName);
//     formDataToSubmit.append("vehicleType", formData.vehicleDetails.vehicleType);
//     formDataToSubmit.append(
//       "rentalStartDate",
//       formData.vehicleDetails.rentalStartDate
//     );
//     formDataToSubmit.append(
//       "ownerAddress",
//       formData.vehicleDetails.ownerAddress
//     );
//     formDataToSubmit.append("phoneNumber", formData.vehicleDetails.phoneNumber);
//     formDataToSubmit.append("gst", formData.vehicleDetails.gst);
//     formDataToSubmit.append("pan", formData.vehicleDetails.pan);

//     // Append other fields
//     formDataToSubmit.append("registrationType", formData.registrationType);
//     formDataToSubmit.append("under", formData.under);
//     formDataToSubmit.append("name", formData.name);

//     // Append avatar file if selected
//     if (avatar) {
//       formDataToSubmit.append("avatar", avatar);
//     }

//     try {
//       // Call API or handle form submission
//       await createVehicleRegistration(formDataToSubmit).unwrap();
//       // Handle successful submission
//       alert("Vehicle Registration Created Successfully");
//     } catch (error) {
//       // Handle submission errors
//       alert("Failed to create vehicle registration: " + error.message);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
//           Add Vehicle Registration
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           {/* Vehicle Registration Number */}
//           <div className="mb-4">
//             <label
//               className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
//               htmlFor="vehicleRegistrationNumber"
//             >
//               Vehicle Registration Number
//             </label>
//             <input
//               type="text"
//               name="vehicleRegistrationNumber"
//               id="vehicleRegistrationNumber"
//               placeholder="Vehicle Registration Number"
//               className="w-full px-3 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//               onChange={handleChange}
//               value={formData.vehicleDetails.vehicleRegistrationNumber}
//               required
//             />
//           </div>
//           {/* Owner Name */}
//           <div className="mb-4">
//             <label
//               className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
//               htmlFor="ownerName"
//             >
//               Owner Name
//             </label>
//             <input
//               type="text"
//               name="ownerName"
//               id="ownerName"
//               placeholder="Owner Name"
//               className="w-full px-3 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//               onChange={handleChange}
//               value={formData.vehicleDetails.ownerName}
//               required
//             />
//           </div>
//           {/* Vehicle Type */}
//           <div className="mb-4">
//             <label
//               className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
//               htmlFor="vehicleType"
//             >
//               Vehicle Type
//             </label>
//             <input
//               type="text"
//               name="vehicleType"
//               id="vehicleType"
//               placeholder="Vehicle Type"
//               className="w-full px-3 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//               onChange={handleChange}
//               value={formData.vehicleDetails.vehicleType}
//               required
//             />
//           </div>
//           {/* Rental Start Date */}
//           <div className="mb-4">
//             <label
//               className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
//               htmlFor="rentalStartDate"
//             >
//               Rental Start Date
//             </label>
//             <input
//               type="date"
//               name="rentalStartDate"
//               id="rentalStartDate"
//               placeholder="Rental Start Date"
//               className="w-full px-3 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//               onChange={handleChange}
//               value={formData.vehicleDetails.rentalStartDate}
//               required
//             />
//           </div>
//           {/* Owner Address */}
//           <div className="mb-4">
//             <label
//               className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
//               htmlFor="ownerAddress"
//             >
//               Owner Address
//             </label>
//             <input
//               type="text"
//               name="ownerAddress"
//               id="ownerAddress"
//               placeholder="Owner Address"
//               className="w-full px-3 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//               onChange={handleChange}
//               value={formData.vehicleDetails.ownerAddress}
//               required
//             />
//           </div>
//           {/* Phone Number */}
//           <div className="mb-4">
//             <label
//               className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
//               htmlFor="phoneNumber"
//             >
//               Phone Number
//             </label>
//             <input
//               type="text"
//               name="phoneNumber"
//               id="phoneNumber"
//               placeholder="Phone Number"
//               className="w-full px-3 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//               onChange={handleChange}
//               value={formData.vehicleDetails.phoneNumber}
//               required
//             />
//           </div>
//           {/* GST */}
//           <div className="mb-4">
//             <label
//               className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
//               htmlFor="gst"
//             >
//               GST
//             </label>
//             <input
//               type="text"
//               name="gst"
//               id="gst"
//               placeholder="GST"
//               className="w-full px-3 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//               onChange={handleChange}
//               value={formData.vehicleDetails.gst}
//               required
//             />
//           </div>
//           {/* PAN */}
//           <div className="mb-6">
//             <label
//               className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
//               htmlFor="pan"
//             >
//               PAN
//             </label>
//             <input
//               type="text"
//               name="pan"
//               id="pan"
//               placeholder="PAN"
//               className="w-full px-3 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//               onChange={handleChange}
//               value={formData.vehicleDetails.pan}
//               required
//             />
//           </div>
//           {/* Extra Field */}
//           <div className="mb-4">
//             <label
//               className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
//               htmlFor="name"
//             >
//               Group
//             </label>
//             <UnderPayHead options={groups} hello={handleDropdownChange} />
//           </div>
//           {/* Category Field */}
//           <div className="flex flex-col mb-4">
//             <label
//               htmlFor="category"
//               className="mb-1 font-semibold text-gray-900 dark:text-gray-100"
//             >
//               Category
//             </label>
//             <UnderPayHead1
//               hello1={handleDropdownChange1}
//               options1={ledgers || []}
//             />
//           </div>
//           <div className="w-full max-w-md bg-gray-100 dark:bg-gray-900 shadow-md rounded-md mb-8 col-span-2">
//             <div className="flex items-center space-x-4">
//               <figure className="w-24 h-24 flex-shrink-0">
//                 <img
//                   src={avatarPreview}
//                   className="w-full h-full object-cover rounded-full border border-gray-600"
//                   alt="Avatar"
//                 />
//               </figure>
//               <div className="flex-1">
//                 {/* Hidden input field */}
//                 <input
//                   type="file"
//                   name="avatar"
//                   onChange={handleImageChange}
//                   className="hidden "
//                   id="customFile"
//                 />
//                 {/* Custom button to trigger file input */}
//                 <label
//                   htmlFor="customFile"
//                   className="mt-1 block py-2 px-4 border border-gray-600 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer "
//                 >
//                   Choose File
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//         <button
//           type="submit"
//           className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateEmployeeForm;
import React, { useState } from "react";
import { useCreateEmployeeMutation } from "../store/api/StaffApi";
import { useGetTaxesQuery } from "../store/api/TaxApi";
import UnderPayHead from "../Staffmanagement/UnderPayHead";
import UnderPayHead1 from "../Staffmanagement/UderPayHead1";
import { useGetGroupsQuery } from "../store/api/Group";

const CreateEmployeeForm = () => {
  const [createVehicleRegistration] = useCreateEmployeeMutation();
  const { data: ledgers } = useGetTaxesQuery();
  const {
    data: groups = [],
    isLoading: groupsLoading,
    isError: groupsError,
  } = useGetGroupsQuery();
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.png"
  );

  const [formData, setFormData] = useState({
    vehicleDetails: {
      vehicleRegistrationNumber: "",
      ownerName: "",
      vehicleType: "",
      rentalStartDate: "",
      ownerAddress: "",
      phoneNumber: "",
      gst: "",
      pan: "",
      ledgerId: "",
    },
    registrationType: "vehicle",
    category: "",
    nature: "",
    name: "",
    under: "",
    group: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      vehicleDetails: {
        ...prevFormData.vehicleDetails,
        [name]: value,
        vehicleRegistrationNumber:
          name === "name"
            ? value
            : prevFormData.vehicleDetails.vehicleRegistrationNumber,
      },
      [name]: value,
    }));
  };

  const handleDropdownChange = (selectedOption) => {
    console.log("selectedOption", selectedOption);
    if (selectedOption) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        category: selectedOption.category || prevFormData.category,
        nature: selectedOption.nature || prevFormData.nature,
        name: selectedOption.name || prevFormData.name,
        under: selectedOption._id || prevFormData.under,
        group: selectedOption.name || prevFormData.name,
      }));
    }
  };

  const handleDropdownChange1 = (selectedOption1) => {
    console.log("selectedOption1", selectedOption1);
    if (selectedOption1) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        vehicleDetails: {
          ...prevFormData.vehicleDetails,
          ledgerId: selectedOption1._id,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    Object.entries(formData.vehicleDetails).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });
    formDataToSubmit.append("registrationType", formData.registrationType);
    formDataToSubmit.append("under", formData.under);
    formDataToSubmit.append("name", formData.name);
    if (avatar) {
      formDataToSubmit.append("avatar", avatar);
    }

    try {
      await createVehicleRegistration(formDataToSubmit).unwrap();
      alert("Vehicle Registration Created Successfully");
    } catch (error) {
      alert("Failed to create vehicle registration: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Add Vehicle Registration
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Vehicle Registration Number */}

          {/* Other Input Fields */}
          {/* ... (Other input fields remain unchanged) */}
          {/* Group Dropdown */}
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="group"
            >
              Group
            </label>
            <UnderPayHead options={groups} hello={handleDropdownChange} />
          </div>
          {/* Ledger Dropdown */}
          <div className="flex flex-col mb-4">
            <label
              htmlFor="ledger"
              className="mb-1 font-semibold text-gray-900 dark:text-gray-100"
            >
              Ledger
            </label>
            <UnderPayHead1
              hello1={handleDropdownChange1}
              options1={ledgers || []}
            />
          </div>
          {/* Avatar Upload */}
          <div className="w-full max-w-md bg-gray-100 dark:bg-gray-900 shadow-md rounded-md mb-8 col-span-2">
            <div className="flex items-center space-x-4">
              <figure className="w-24 h-24 flex-shrink-0">
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
                  className="mt-1 block py-2 px-4 border border-gray-600 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateEmployeeForm;
