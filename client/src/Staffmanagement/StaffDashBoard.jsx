import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useFetchEmployeeGroupsQuery } from "../store/api/EmployeeGroupApi";
import { useGetAllEmployeesQuery } from "../store/api/StaffApi";
import Image from "../assets/logo.png";

const EmployeeGroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch employee groups
  const {
    data: groups,
    isLoading: groupsLoading,
    error: groupsError,
    refetch: refetchGroups, // Refetch function for groups
  } = useFetchEmployeeGroupsQuery();

  // Fetch employees
  const {
    data: employees,
    isLoading: employeesLoading,
    error: employeesError,
    refetch: refetchEmployees, // Refetch function for employees
  } = useGetAllEmployeesQuery();

  // Trigger refetch when location state has `refetchData` flag
  useEffect(() => {
    refetchGroups(); // Refetch employee groups
    refetchEmployees(); // Refetch employees
  }, [refetchGroups, refetchEmployees]);

  // Loading and error handling
  if (groupsLoading || employeesLoading) return <p>Loading...</p>;
  if (groupsError) return <p>Error loading employee groups.</p>;
  if (employeesError) return <p>Error loading employees.</p>;

  // Find the group by ID
  const group = groups.find((item) => item._id === groupId);
  if (!group) return <p>Group not found.</p>;

  // Filter employees where 'under' matches the groupId
  const filteredEmployees = employees.filter(
    (employee) => employee.under === groupId
  );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-md rounded-lg max-w-4xl mx-auto mt-8 border border-gray-300 dark:border-gray-600">
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee._id}
              className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-300 dark:border-gray-600"
              onClick={() => navigate(`/staff/employee/${employee._id}`)}
            >
              <figure className="w-24 h-24 flex-shrink-0">
                <img
                  src={employee.avatar || Image}
                  alt={employee.userName}
                  className="w-full h-full object-cover rounded-full border border-gray-600 dark:border-gray-400"
                />
              </figure>
              <div className="flex flex-col">
                <p className="font-semibold text-lg">
                  {employee.userName || employee.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reg No: {employee.employeeId}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Joined:{" "}
                  {new Date(
                    employee.dateOfHire || employee.rentalStartDate
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-8">
          <div className="animate-bounce text-center mb-4">
            <p className="text-xl font-bold text-red-500">
              No staff members found!
            </p>
          </div>
          <img
            src={Image}
            alt="No data"
            className="w-32 h-32 object-cover rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeGroupDetail;
