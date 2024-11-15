import React from "react";
import {
  useGetLedgerQuery,
  useDeleteLedgerMutation,
} from "../store/api/LedgerApi";
import EditLedgerModal from "./EditLedgerModal";

const LedgerList = () => {
  // Get data, error, and isLoading status
  const { data: ledgers, error, isLoading, refetch } = useGetLedgerQuery();
  // Initialize delete ledger mutation
  const [deleteLedger] = useDeleteLedgerMutation();
  // State for the ledger being edited
  const [editingLedger, setEditingLedger] = React.useState(null);

  if (isLoading) return <p>Loading ledgers...</p>;
  if (error) return <p>Error loading ledgers: {error.message}</p>;
  if (!ledgers || ledgers.length === 0) return <p>No ledgers available</p>;

  // Handle ledger deletion and refetch data
  const handleDelete = async (id) => {
    try {
      await deleteLedger(id).unwrap();
      alert("Ledger deleted successfully");
      refetch(); // Refetch data after successful deletion
    } catch (err) {
      alert(`Error deleting ledger: ${err.message}`);
    }
  };

  const openEditModal = (ledger) => {
    setEditingLedger(ledger);
  };

  const closeEditModal = () => {
    setEditingLedger(null);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Ledger List</h2>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-300 dark:border-gray-600">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {/* Updated Table headers */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Opening Balance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Group
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900">
          {ledgers.map((ledger) => (
            <tr
              key={ledger._id}
              className="border-t border-gray-300 dark:border-gray-600"
            >
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {new Date(ledger.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {ledger.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {ledger.openingBalance || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {ledger.group}
              </td>

              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {ledger.category}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {ledger.description || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                <button
                  onClick={() => openEditModal(ledger)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-500 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ledger._id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingLedger && (
        <EditLedgerModal ledger={editingLedger} onClose={closeEditModal} />
      )}
    </div>
  );
};

export default LedgerList;
// 1111111111111111111111111ivide testing nadathan pokunnu
// import React, { useState, useRef } from "react";

// const SimpleForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     password: "",
//     date: "",
//   });

//   // Refs for inputs to navigate using next/previous logic
//   const nameRef = useRef(null);
//   const passwordRef = useRef(null);
//   const dateRef = useRef(null);

//   // Array of refs for easier navigation
//   const fieldRefs = [nameRef, passwordRef, dateRef];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handling form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Submitted", formData);
//   };

//   // Handle keyboard navigation for Enter, ArrowRight, and ArrowLeft
//   const handleKeyDown = (e, index) => {
//     if (e.key === "Enter" || e.key === "ArrowRight") {
//       e.preventDefault(); // Prevent form submission on Enter
//       navigateNextField(index);
//     } else if (e.key === "ArrowLeft") {
//       e.preventDefault();
//       navigatePreviousField(index);
//     }
//   };

//   // Navigate to the next field (looping forward)
//   const navigateNextField = (index) => {
//     const nextField = (index + 1) % fieldRefs.length;
//     fieldRefs[nextField].current.focus();
//   };

//   // Navigate to the previous field (looping backward)
//   const navigatePreviousField = (index) => {
//     const prevField = (index - 1 + fieldRefs.length) % fieldRefs.length;
//     fieldRefs[prevField].current.focus();
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow-md w-full max-w-sm"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

//         {/* Name Field */}
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 font-medium mb-2"
//             htmlFor="name"
//           >
//             Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             id="name"
//             ref={nameRef}
//             value={formData.name}
//             onChange={handleChange}
//             onKeyDown={(e) => handleKeyDown(e, 0)}
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             placeholder="Enter your name"
//             required
//           />
//         </div>

//         {/* Password Field */}
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 font-medium mb-2"
//             htmlFor="password"
//           >
//             Password
//           </label>
//           <input
//             type="password"
//             name="password"
//             id="password"
//             ref={passwordRef}
//             value={formData.password}
//             onChange={handleChange}
//             onKeyDown={(e) => handleKeyDown(e, 1)}
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             placeholder="Enter your password"
//             required
//           />
//         </div>

//         {/* Date Field */}
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 font-medium mb-2"
//             htmlFor="date"
//           >
//             Select Date
//           </label>
//           <input
//             type="date"
//             name="date"
//             id="date"
//             ref={dateRef}
//             value={formData.date}
//             onChange={handleChange}
//             onKeyDown={(e) => handleKeyDown(e, 2)}
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SimpleForm;
