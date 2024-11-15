import React, { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import {
  useGetVehicleRentByIdQuery,
  useDeleteVehicleRentMutation,
  useUpdateVehicleRentMutation,
} from "../store/api/VehicleRentApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VehicleRentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch vehicle rent record by id
  const {
    data: vehicleRecord,
    error,
    isLoading,
  } = useGetVehicleRentByIdQuery(id);
  console.log("vehicleRecord,", vehicleRecord);
  const [deleteVehicleRentDetails, { isLoading: isDeleting }] =
    useDeleteVehicleRentMutation();
  // Initialize form data state
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleName: "",
    ownerName: "",
    date: "",
    openingTime: "",
    openingTimePeriod: "AM",
    closingTime: "",
    closingTimePeriod: "PM",
    totalHMR: "",
    otHours: "",
    bdHours: "",
    openingKm: "",
    closingKm: "",
    totalKm: "",
    diesel: "",
    remarks: "",
    totalHours: 0,
    vehicleType: "companyVehicle",
  });

  useEffect(() => {
    if (vehicleRecord) {
      setFormData({
        vehicleNumber: vehicleRecord.vehicleNumber || "",
        vehicleName: vehicleRecord.vehicleName || "",
        ownerName: vehicleRecord.ownerName || "",
        date: new Date(vehicleRecord.date).toISOString().split("T")[0],
        openingTime: vehicleRecord.openingTime || "",
        openingTimePeriod: vehicleRecord.openingTimePeriod || "AM",
        closingTime: vehicleRecord.closingTime || "",
        closingTimePeriod: vehicleRecord.closingTimePeriod || "PM",
        totalHMR: vehicleRecord.totalHMR || "",
        otHours: vehicleRecord.otHours || "",
        bdHours: vehicleRecord.bdHours || "",
        openingKm: vehicleRecord.openingKm || "",
        closingKm: vehicleRecord.closingKm || "",
        totalKm: vehicleRecord.totalKm || "",
        diesel: vehicleRecord.diesel || "",
        remarks: vehicleRecord.remarks || "",
        totalHours: vehicleRecord.totalHours || 0,
        vehicleType: vehicleRecord.vehicleType || "companyVehicle",
      });
    }
  }, [vehicleRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [updateVehicleRent, { isLoading: isUpdating }] =
    useUpdateVehicleRentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const openingTimeFull = `${formData.openingTime} ${formData.openingTimePeriod}`;
      const closingTimeFull = `${formData.closingTime} ${formData.closingTimePeriod}`;

      await updateVehicleRent({
        id,
        updatedData: {
          ...formData,
          openingTime: openingTimeFull,
          closingTime: closingTimeFull,
        },
      }).unwrap();

      toast.success("Purchase created successfully!", {
        autoClose: 3000,
      });
      navigate(
        `/staff/vehicle-rent/${formData.ownerName}/${encodeURIComponent(
          formData.vehicleNumber
        )}`
      );
      setFormData({
        vehicleNumber: "",
        vehicleName: "",
        ownerName: "",
        date: "",
        vehicleType: "companyVehicle",
        openingTime: "",
        openingTimePeriod: "AM",
        closingTime: "",
        closingTimePeriod: "PM",
        totalHMR: "",
        otHours: "",
        bdHours: "",
        openingKm: "",
        closingKm: "",
        totalKm: "",
        diesel: "",
        remarks: "",
        totalHours: 0,
      });
    } catch (error) {
      console.error("Update failed:", error);
      toast.success("Purchase created successfully!", {
        autoClose: 3000,
      });
    }
  };
  // Handle delete button click
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const result = await deleteVehicleRentDetails(id);

        if (result.error) {
          throw new Error(
            result.error?.data?.message || "Failed to delete transaction."
          );
        }

        toast.success("Transaction deleted successfully!");
        navigate(
          `/staff/vehicle-rent/${formData.ownerName}/${encodeURIComponent(
            formData.vehicleNumber
          )}`
        );
      } catch (error) {
        console.error("Failed to delete the transaction:", error);
        toast.error(
          error.message || "Error deleting transaction. Please try again."
        );
      }
    }
  };
  return (
    <div className="p-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Vehicle Number */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Vehicle Number
            </label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
            />
          </div>

          {/* Vehicle Name */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Vehicle Name
            </label>
            <input
              type="text"
              name="vehicleName"
              value={formData.vehicleName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
            />
          </div>
          {/* Vehicle Type */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType} // This should reflect the current state
              onChange={handleChange} // This function updates the state on change
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
            >
              <option value="companyVehicle">Company Vehicle</option>
              <option value="rentVehicle">Rent Vehicle</option>
            </select>
          </div>

          {/* Vehicle Name */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Owner Name
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
            />
          </div>
          {/* Date Field */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
            />
          </div>

          {/* Opening Time */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Opening Time
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleChange}
                placeholder="hh:mm"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
              />
              <select
                name="openingTimePeriod"
                value={formData.openingTimePeriod}
                onChange={handleChange}
                className="mt-1 block border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* Closing Time */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Closing Time
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleChange}
                placeholder="hh:mm"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
              />
              <select
                name="closingTimePeriod"
                value={formData.closingTimePeriod}
                onChange={handleChange}
                className="mt-1 block border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* Total HMR */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Total HMR
            </label>
            <input
              type="text"
              name="totalHMR"
              value={formData.totalHMR}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
            />
          </div>

          {/* OT Hours */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              OT Hours
            </label>
            <input
              type="text"
              name="otHours"
              value={formData.otHours}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
            />
          </div>

          {/* BD Hours */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              BD Hours
            </label>
            <input
              type="text"
              name="bdHours"
              value={formData.bdHours}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
            />
          </div>

          {/* Opening KM */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Opening KM
            </label>
            <input
              type="text"
              name="openingKm"
              value={formData.openingKm}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
            />
          </div>

          {/* Closing KM */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Closing KM
            </label>
            <input
              type="text"
              name="closingKm"
              value={formData.closingKm}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
            />
          </div>

          {/* Total KM */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Total KM
            </label>
            <input
              type="text"
              name="totalKm"
              value={formData.totalKm}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
            />
          </div>

          {/* Diesel */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Diesel
            </label>
            <input
              type="text"
              name="diesel"
              value={formData.diesel}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
            />
          </div>

          {/* Remarks */}
          <div className="bg-gray-50 dark:bg-gray-800 lg:col-span-2 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        {/* Submit Button */}
        <div className="md:col-span-3 flex justify-between">
          <button
            type="submit"
            className={`px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              isUpdating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className={`px-6 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition duration-300 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
        {/* Submit Button */}
      </form>
    </div>
  );
}

export default VehicleRentEdit;
