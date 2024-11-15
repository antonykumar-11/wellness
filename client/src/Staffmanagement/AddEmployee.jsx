// AddEmployee.js
import React, { useState, useEffect } from "react";

const AddEmployee = ({ showModal, setShowModal, employeeObj }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    avtar: "",
    salary: "",
  });

  useEffect(() => {
    if (employeeObj) {
      setFormData(employeeObj);
    }
  }, [employeeObj]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic goes here
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center ${
        showModal ? "block" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {employeeObj ? "Edit Employee" : "Add Employee"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Add form fields here with Tailwind CSS classes */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
          />
          {/* Add other fields similarly */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {employeeObj ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
