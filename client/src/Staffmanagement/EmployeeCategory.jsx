import React, { useState, useEffect } from "react";
import {
  useGetEmployeesQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "../store/api/EmployeeHeadApi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeCategory = () => {
  const { data: employees, error, isLoading, refetch } = useGetEmployeesQuery(); // Add refetch for reloading the data
  const [addEmployee] = useAddEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  // Form state
  const [employee, setEmployee] = useState({ name: "", date: "" });
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  useEffect(() => {
    // Optionally, refetch the data if necessary
    refetch();
  }, [addEmployee, updateEmployee, deleteEmployee]); // Refetch after any mutations

  // Handle form submission (Add/Update)
  const handleFormSubmit = async () => {
    try {
      if (editingEmployeeId) {
        // Update logic
        const updatedEmployee = { id: editingEmployeeId, ...employee };
        await updateEmployee(updatedEmployee).unwrap();
        toast.success("Employee updated successfully!");
      } else {
        // Add logic
        const newEmployee = await addEmployee(employee).unwrap();
        toast.success("Employee added successfully!");
      }

      // Reset form
      setEmployee({ name: "", date: "" });
      setEditingEmployeeId(null);
      refetch(); // Refresh the list after the mutation
    } catch (error) {
      toast.error("An error occurred!");
    }
  };

  // Handle edit employee
  const handleEdit = (emp) => {
    setEmployee({ name: emp.name, date: emp.date });
    setEditingEmployeeId(emp._id);
  };

  // Handle delete employee
  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id).unwrap();
      console.log("Employee deleted successfully!"); // Debug log
      toast.success("Employee deleted successfully!"); // Toast should trigger here
      refetch(); // Refresh the list after deletion
    } catch (error) {
      toast.error("Error deleting employee!");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Under Employee
        </h1>

        {/* Form for adding/updating employee */}
        <div className="space-y-4">
          <input
            type="text"
            value={employee.name}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            placeholder="Add Under..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <input
            type="date"
            value={employee.date}
            onChange={(e) => setEmployee({ ...employee, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            onClick={handleFormSubmit}
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {editingEmployeeId ? "Update Employee" : "Add Employee"}
          </button>
        </div>

        {/* Employee list */}
        <ul className="mt-6 space-y-2">
          {employees?.map((emp) => (
            <li
              key={emp._id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {emp.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(emp.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(emp)}
                  className="bg-yellow-500 dark:bg-yellow-600 text-white py-1 px-2 rounded-md hover:bg-yellow-600 dark:hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="bg-red-500 dark:bg-red-600 text-white py-1 px-2 rounded-md hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default EmployeeCategory;
