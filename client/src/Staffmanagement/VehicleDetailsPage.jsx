import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllVehicleRegistrationsQuery } from "../store/api/vehicleRegistrationApi";

const VehicleDetailsPage = () => {
  const { id } = useParams(); // Get the vehicle ID from URL params
  const navigate = useNavigate();
  const {
    data: vehicles,
    isLoading,
    error,
  } = useGetAllVehicleRegistrationsQuery();

  if (isLoading) return <p>Loading vehicles...</p>;
  if (error) return <p>Error loading vehicles.</p>;

  // Display specific vehicle details if an ID is provided
  if (id) {
    const vehicle = vehicles.find((v) => v._id === id);

    if (!vehicle) return <p>Vehicle not found.</p>;
  }

  // Display list of all vehicles if no ID is provided
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">All Vehicles</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {vehicle.vehicleRegistrationNumber}
            </h3>
            <button
              onClick={() => navigate(`/staff/vehiclesdetails/${vehicle._id}`)}
              className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
