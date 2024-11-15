import React, { useState, useEffect } from "react";
import { useGetEmployeesQuery } from "../store/api/EmployeeHeadApi";
import { useCreateEmployeeGroupMutation } from "../store/api/EmployeeGroupApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CreteEoyeeGroup = () => {
  const { data: employees, error, isLoading, refetch } = useGetEmployeesQuery();
  const [createEmployeeGroup] = useCreateEmployeeGroupMutation();
  const navigate = useNavigate();
  // Form state
  const [employee, setEmployee] = useState({ name: "", date: "", under: "" });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.png"
  );

  useEffect(() => {
    refetch();
  }, [createEmployeeGroup]);

  // Handle image change
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

  // Handle form submission
  const handleFormSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", employee.name);
      formData.append("date", employee.date);
      formData.append("under", employee.under);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      await createEmployeeGroup(formData).unwrap();
      toast.success("Employee group added successfully!");

      // Reset form
      setEmployee({ name: "", date: "", under: "" });
      setAvatar(null);
      setAvatarPreview("/images/default_avatar.png");
      navigate("/staff/payHeadDetails");
      refetch();
    } catch (error) {
      toast.error("An error occurred!");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className=" flex  justify-center bg-gray-100  dark:bg-gray-900  p-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-40 mb-28">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Create Employee Department
        </h1>

        {/* Form for adding/updating employee */}
        <div className="space-y-4">
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
                {/* Hidden input field */}
                <input
                  type="file"
                  name="avatar"
                  onChange={handleImageChange}
                  className="hidden"
                  id="customFile"
                />
                {/* Custom button to trigger file input */}
                <label
                  htmlFor="customFile"
                  className="mt-1 block py-2 px-4 border border-gray-600 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            </div>
          </div>

          <input
            type="text"
            value={employee.name}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            placeholder="Employee Name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />

          <button
            onClick={handleFormSubmit}
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add Employee
          </button>
        </div>
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

export default CreteEoyeeGroup;
