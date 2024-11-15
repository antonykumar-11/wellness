import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetVehicleRegistrationByIdQuery,
  useUpdateVehicleRegistrationMutation,
  useDeleteVehicleRegistrationMutation,
} from "../store/api/vehicleRegistrationApi";

const VehicleRegistrationDetail = () => {
  const { groupId } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();

  const { data, isLoading, error } =
    useGetVehicleRegistrationByIdQuery(groupId);
  const [updateVehicleRegistration] = useUpdateVehicleRegistrationMutation();
  const [deleteVehicleRegistration] = useDeleteVehicleRegistrationMutation();

  const [formData, setFormData] = useState({
    vehicleRegistrationNumber: "",
    ownerName: "",
    vehicleType: "",
    rentalStartDate: "",
    ownerAddress: "",
    phoneNumber: "",
    gst: "",
    pan: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        vehicleRegistrationNumber: data.vehicleRegistrationNumber || "",
        ownerName: data.ownerName || "",
        vehicleType: data.vehicleType || "",
        rentalStartDate: data.rentalStartDate || "",
        ownerAddress: data.ownerAddress || "",
        phoneNumber: data.phoneNumber || "",
        gst: data.gst || "",
        pan: data.pan || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateVehicleRegistration({ groupId, ...formData }).unwrap();
      alert("Vehicle Registration Updated Successfully");
    } catch (error) {
      alert("Failed to update vehicle registration: " + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVehicleRegistration(groupId).unwrap();
      alert("Vehicle Registration Deleted Successfully");
      navigate("/vehicles"); // Navigate back to the list
    } catch (error) {
      alert("Failed to delete vehicle registration: " + error.message);
    }
  };

  const handleCreateSalary = () => {
    navigate(`/staff/pay/${groupId}`);
  };

  const handleShowSalaryCalculator = () => {
    navigate(`/staff/setting/${groupId}`); // Update the path based on your route configuration
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading vehicle registration.</p>;

  return (
    <div className="max-w-lg mx-auto p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
        Vehicle Registration Details
      </h2>
      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Vehicle Registration Number
            </label>
            <input
              type="text"
              name="vehicleRegistrationNumber"
              value={formData.vehicleRegistrationNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Owner Name
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Vehicle Type
            </label>
            <input
              type="text"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Rental Start Date
            </label>
            <input
              type="date"
              name="rentalStartDate"
              value={formData.rentalStartDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Owner Address
            </label>
            <input
              type="text"
              name="ownerAddress"
              value={formData.ownerAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              GST
            </label>
            <input
              type="text"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              PAN
            </label>
            <input
              type="text"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Delete
          </button>
        </div>
      </form>

      {/* Create Salary Button */}
      <button
        onClick={handleCreateSalary}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Create Salary
      </button>

      {/* Show Salary Calculator Button */}
      <button
        onClick={handleShowSalaryCalculator}
        className="bg-yellow-500 text-white px-4 py-2 rounded mt-4"
      >
        Show Salary Calculator
      </button>
    </div>
  );
};

export default VehicleRegistrationDetail;
