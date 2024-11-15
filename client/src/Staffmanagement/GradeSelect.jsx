// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useFetchEmployeeGroupsQuery } from "../store/api/EmployeeGroupApi";

// const GradeSelect = () => {
//   const { data, isLoading, error } = useFetchEmployeeGroupsQuery();
//   const [selectedGroup, setSelectedGroup] = useState("");
//   const navigate = useNavigate();

//   const handleSelectChange = (event) => {
//     setSelectedGroup(event.target.value);
//   };

//   const handleNavigate = () => {
//     if (selectedGroup) {
//       navigate(`/staff/dashboard/${selectedGroup}`);
//     }
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error loading employee groups.</p>;

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Employee Groups</h2>
//       <div className="mb-4">
//         <label
//           htmlFor="employeeGroup"
//           className="block mb-2 text-lg font-semibold"
//         >
//           Select Group:
//         </label>
//         <select
//           id="employeeGroup"
//           value={selectedGroup}
//           onChange={handleSelectChange}
//           className="p-2 border rounded w-full"
//         >
//           <option value="" disabled>
//             Select a group
//           </option>
//           {data.map((group) => (
//             <option key={group._id} value={group._id}>
//               {group.name} - {new Date(group.date).toLocaleDateString()}
//             </option>
//           ))}
//         </select>
//         <button
//           onClick={handleNavigate}
//           className="mt-4 p-2 bg-blue-500 text-white rounded"
//           disabled={!selectedGroup}
//         >
//           Go to Group
//         </button>
//       </div>
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {data.map((group) => (
//           <div
//             key={group._id}
//             className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer"
//             onClick={() => navigate(`/staff/dashboard/${group._id}`)}
//           >
//             <h3 className="text-xl font-semibold">{group.name}</h3>
//             <p className="text-gray-600">
//               Date: {new Date(group.date).toLocaleDateString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GradeSelect;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchEmployeeGroupsQuery } from "../store/api/EmployeeGroupApi";

const GradeSelect = ({ onEmployeeChange }) => {
  const { data, isLoading, error } = useFetchEmployeeGroupsQuery();
  const [selectedGroup, setSelectedGroup] = useState("");

  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedGroup(value);
    const selectedEmployee = data.find((group) => group._id === value);

    if (onEmployeeChange) {
      onEmployeeChange(selectedEmployee ? selectedEmployee : null);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading employee groups.</p>;

  return (
    <div className="flex items-center">
      <select
        id="employeeGroup"
        value={selectedGroup}
        onChange={handleSelectChange}
        className="p-3 border rounded w-full"
      >
        <option value="">Select an employee</option>
        {data.map((group) => (
          <option key={group._id} value={group._id}>
            {group.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GradeSelect;
