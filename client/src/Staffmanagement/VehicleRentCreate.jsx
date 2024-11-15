import React, { useState } from "react";
import { useCreateVehicleRentMutation } from "../store/api/VehicleRentApi";

const VehicleRentCreate = () => {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleName: "",
    ownerName: "",
    date: "",
    openingTime: "",
    openingTimePeriod: "", // AM/PM selection
    closingTime: "",
    closingTimePeriod: "", // AM/PM selection
    totalHMR: "",
    otHours: "",
    bdHours: "",
    openingKm: "",
    closingKm: "",
    totalKm: "",
    diesel: "",
    remarks: "",
    totalHours: 0,
    vehicleType: "companyVehicle", // Default value
  });
  console.log("formData", formData.vehicleType);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [createVehicleRent] = useCreateVehicleRentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Combine time and period into a single string for submission
      const openingTimeFull = `${formData.openingTime} ${formData.openingTimePeriod}`;
      const closingTimeFull = `${formData.closingTime} ${formData.closingTimePeriod}`;

      // Send combined time values
      await createVehicleRent({
        ...formData,
        openingTime: openingTimeFull,
        closingTime: closingTimeFull,
      }).unwrap();

      alert("Vehicle Registration  Successfully");

      // Reset form after successful submission
      setFormData({
        vehicleNumber: "",
        vehicleName: "",
        ownerName: "",
        date: "",
        vehicleType: "", // Default value
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
      alert("Failed to update vehicle registration: " + error.message);
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
              <option value="">Own/Rent</option>

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
        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleRentCreate;
