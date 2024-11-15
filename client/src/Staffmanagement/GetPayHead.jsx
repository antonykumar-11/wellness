// import React, { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useFetchEmployeeGroupsQuery } from "../store/api/EmployeeGroupApi";

// const CombinedDataDisplay = () => {
//   const {
//     data: employeeGroupData,
//     isLoading: isEmployeeGroupLoading,
//     error: employeeGroupError,
//     refetch, // refetch function from the hook
//   } = useFetchEmployeeGroupsQuery();

//   const navigate = useNavigate();
//   const location = useLocation();

//   // Use useEffect to refetch employee groups when necessary
//   useEffect(() => {
//     // If location.state contains a 'refetchData' flag, trigger refetch
//     if (location.state?.refetchData) {
//       refetch(); // Manually refetch employee groups
//     }
//   }, [location, refetch]);

//   // Check loading state
//   if (isEmployeeGroupLoading) return <p className="text-center">Loading...</p>;

//   // Check for errors
//   if (employeeGroupError)
//     return <p className="text-center text-red-600">Error loading data.</p>;

//   return (
//     <div className="p-6 mx-auto max-w-6xl bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md transition-all duration-300 ease-in-out">
//       <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
//         Welcome to Employee Management
//       </h2>

//       {/* Employee Group Data Section */}
//       <section>
//         <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
//           Employee Groups
//         </h3>
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {employeeGroupData && employeeGroupData.length ? (
//             employeeGroupData.map((group) => (
//               <div
//                 key={group._id}
//                 className="p-4 rounded-lg shadow hover:shadow-lg cursor-pointer bg-white dark:bg-gray-800 transition-transform transform hover:scale-105"
//                 onClick={() => navigate(`/staff/dashboard/${group._id}`)}
//               >
//                 <div className="flex items-center space-x-4">
//                   <img
//                     src={group.avatar || "/images/default_avatar.png"}
//                     alt={group.name}
//                     className="w-16 h-16 rounded-full object-cover"
//                   />
//                   <div>
//                     <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
//                       {group.name}
//                     </h4>
//                     <p className="text-gray-600 dark:text-gray-400">
//                       Date of Hire:{" "}
//                       {new Date(group.dateOfHire).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-gray-600 dark:text-gray-400">
//               No employee group data found.
//             </p>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default CombinedDataDisplay;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useFetchEmployeeGroupsQuery,
  useDeleteEmployeeGroupMutation,
} from "../store/api/EmployeeGroupApi"; // Added delete mutation

const CombinedDataDisplay = () => {
  const {
    data: employeeGroupData,
    isLoading,
    error,
    refetch,
  } = useFetchEmployeeGroupsQuery();
  const [deleteEmployeeGroup] = useDeleteEmployeeGroupMutation(); // Use delete mutation
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.refetchData) {
      refetch();
    }
  }, [location, refetch]);

  // Handle delete functionality
  const handleDelete = async (id) => {
    try {
      await deleteEmployeeGroup(id).unwrap();
      refetch(); // Refetch the employee groups after deletion
    } catch (error) {
      console.error("Failed to delete the group:", error);
    }
  };

  // Handle edit group navigation
  const handleEdit = (id) => {
    navigate(`/staff/createemployee/${id}`); // Navigate to the edit page with group id
  };

  // Handle create group navigation
  const handleCreate = () => {
    navigate("/staff/createemployee"); // Navigate to create employee group page
  };
  // Handle create group navigation
  const handleCreate1 = () => {
    navigate("/staff/staff"); // Navigate to create employee group page
  };

  // Handle create group navigation
  const handleCreate2 = () => {
    navigate("/staff/createvehicle"); // Navigate to create employee group page
  };

  // Filter employee groups based on search term
  const filteredGroups = employeeGroupData?.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600">Error loading data.</p>;

  return (
    <div className="p-6 mx-auto max-w-6xl bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Welcome to Employee Management
      </h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by group name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 w-full rounded-lg shadow border border-gray-300 dark:bg-gray-700 dark:text-white"
      />

      <section>
        <h3 className="text-2xl font-semibold mb-4">Employee Groups</h3>
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">Group Name</th>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups?.length ? (
              filteredGroups.map((group, index) => (
                <tr
                  key={group._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => navigate(`/staff/dashboard/${group._id}`)} // Redirect to the group details page
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{group.name}</td>
                  <td className="py-2 px-4">
                    <img
                      src={group.avatar || "/images/default_avatar.png"}
                      alt={group.name}
                      className="w-16 h-16 rounded-full"
                    />
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(group._id);
                      }}
                    >
                      Edit Group
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(group._id);
                      }}
                    >
                      Delete Group
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-2 text-center">
                  No employee group data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded mr-4"
          onClick={handleCreate}
        >
          Add Group
        </button>
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded mr-4"
          onClick={handleCreate1}
        >
          Create Staff
        </button>
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleCreate2}
        >
          Create Owner
        </button>
      </section>
    </div>
  );
};

export default CombinedDataDisplay;
