import React, { useState, useEffect } from "react";
import {
  useFetchEmployeeGroupByIdQuery,
  useUpdateEmployeeGroupMutation,
} from "../store/api/EmployeeGroupApi";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const EditEmployee = () => {
  const { id } = useParams(); // Get employee ID from the URL
  const navigate = useNavigate();

  // Fetch employee data by ID
  const {
    data: employeeData,
    error,
    isLoading,
  } = useFetchEmployeeGroupByIdQuery(id);
  const [updateEmployee] = useUpdateEmployeeGroupMutation(); // Update mutation

  // State to store employee details
  const [employee, setEmployee] = useState({ name: "", date: "" });
  console.log("employee", employee);
  const [avatar, setAvatar] = useState(null); // To handle image upload
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.png"
  ); // Default avatar preview
  console.log("employee", avatar);
  // Effect to prepopulate form when employee data is loaded
  useEffect(() => {
    if (employeeData) {
      // Set the form data from the fetched employee
      setEmployee({
        name: employeeData.name,

        under: employeeData.under || "", // Assuming "under" is a valid field, otherwise remove
      });

      // You can handle image preview if avatar is available
      setAvatarPreview(employeeData.avatar || "/images/default_avatar.png");
      setAvatar(employeeData.avatar || "/images/default_avatar.png");
    }
  }, [employeeData]);

  // Handle image upload preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(file);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission for updating employee details
  const handleFormSubmit = async () => {
    try {
      // Create form data to handle both text and file data
      const formData = new FormData();
      formData.append("name", employee.name);
      formData.append("date", employee.date);
      formData.append("under", employee.under);

      // If an avatar is updated, append it
      if (avatar) {
        formData.append("avatar", avatar);
      }

      // Send the updated employee data to the server
      await updateEmployee({ id, data: formData }).unwrap();

      // Display success toast and redirect
      toast.success("Employee details updated successfully!");
      navigate("/staff/payHeadDetails"); // Redirect after update
    } catch (error) {
      toast.error("An error occurred while updating the employee.");
    }
  };

  // Loading and error handling
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className=" flex  justify-center bg-gray-100  dark:bg-gray-900  p-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-40 mb-28">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Edit Employee Details
        </h1>

        <div className="space-y-4">
          {/* Avatar Upload and Preview */}
          <div className="w-full max-w-md bg-gray-100 dark:bg-gray-900 shadow-md rounded-md mb-8">
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
                  Change Avatar
                </label>
              </div>
            </div>
          </div>

          {/* Name */}
          <input
            type="text"
            value={employee.name}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            placeholder="Employee Name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
          />

          {/* Submit Button */}
          <button
            onClick={handleFormSubmit}
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Employee
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default EditEmployee;
