import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { useGetVehicleRentsQuery } from "../store/api/VehicleRentApi";
import InvoicePDF from "./TimePdf"; // Import your InvoicePDF component

const VehicleRentDetails = () => {
  const { vehicleNumber, ownerName } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const { data = [], error, isLoading, refetch } = useGetVehicleRentsQuery();

  useEffect(() => {
    // Trigger a refetch when the component mounts
    refetch();
  }, [refetch]); // Add refetch as a dependency

  // Filter the data to find records for the specific vehicle
  const vehicleRecords = data.filter(
    (vehicle) =>
      vehicle.vehicleNumber === vehicleNumber && vehicle.ownerName === ownerName
  );

  // Calculate totals
  const totalHMR = vehicleRecords.reduce(
    (sum, vehicle) => sum + (vehicle.totalHMR || 0),
    0
  );
  const totalOT = vehicleRecords.reduce(
    (sum, vehicle) => sum + (vehicle.otHours || 0),
    0
  );
  const totalBD = vehicleRecords.reduce(
    (sum, vehicle) => sum + (vehicle.bdHours || 0),
    0
  );
  const totalKM = vehicleRecords.reduce(
    (sum, vehicle) => sum + (vehicle.totalKm || 0),
    0
  );
  const totalDiesel = vehicleRecords.reduce(
    (sum, vehicle) => sum + (vehicle.diesel || 0),
    0
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!vehicleRecords.length) return <p>No records found for this vehicle.</p>;

  const handleDownloadPDF = () => {
    // Generate and save the PDF using the InvoicePDF function
    InvoicePDF({ vehicleRecords, ownerName, vehicleNumber });
  };

  const handleEditClick = (vehicle) => {
    const id = vehicle._id; // Assuming `vehicle` is the ID
    // Navigate to the edit page for the selected vehicle
    navigate(`/admin/vehicle-rent/${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Details for {vehicleRecords[0].vehicleName} (Vehicle No: {vehicleNumber}
        )
      </h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Owner: {ownerName}
      </p>

      {/* PDF Download Button */}
      <button onClick={handleDownloadPDF} className="mb-4 text-blue-600">
        Download Rent Details PDF
      </button>

      {/* Table for vehicle rent details */}
      <table className="min-w-full border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800">
            {/* Table headers */}
            <th>Date</th>
            <th>Opening Time</th>
            <th>Closing Time</th>
            <th>Total HMR</th>
            <th>OT / Hrs</th>
            <th>B/D Hrs</th>
            <th>Opening KM</th>
            <th>Closing KM</th>
            <th>Total KM</th>
            <th>Diesel Used</th>
            <th>Remarks</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {vehicleRecords.map((vehicle) => (
            <tr
              key={vehicle._id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td>{new Date(vehicle.date).toLocaleDateString()}</td>
              <td>{vehicle.openingTime}</td>
              <td>{vehicle.closingTime}</td>
              <td>{vehicle.totalHMR}</td>
              <td>{vehicle.otHours}</td>
              <td>{vehicle.bdHours || "N/A"}</td>
              <td>{vehicle.openingKm}</td>
              <td>{vehicle.closingKm}</td>
              <td>{vehicle.totalKm}</td>
              <td>{vehicle.diesel}</td>
              <td>{vehicle.remarks || "N/A"}</td>
              <td>
                <button
                  onClick={() => handleEditClick(vehicle)}
                  className="text-blue-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        {/* Footer for totals */}
        <tfoot>
          <tr className="bg-gray-300 dark:bg-gray-700 font-bold">
            <td colSpan="3">Totals:</td>
            <td>{totalHMR}</td>
            <td>{totalOT}</td>
            <td>{totalBD || "N/A"}</td>
            <td colSpan="2"></td>
            <td>{totalKM}</td>
            <td>{totalDiesel}</td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default VehicleRentDetails;
