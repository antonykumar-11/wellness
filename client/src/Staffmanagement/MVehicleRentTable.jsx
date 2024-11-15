import React, { useEffect } from "react";
import { useGetVehicleRentsQuery } from "../store/api/VehicleRentApi";
import { useNavigate } from "react-router-dom";

const VehicleRentTable = () => {
  const { data = [], error, isLoading, refetch } = useGetVehicleRentsQuery();
  const navigate = useNavigate();

  // Add logging for better debugging
  console.log("isLoading:", isLoading);
  console.log("error:", error);
  console.log("data:", data); // This should now show the array
  useEffect(() => {
    refetch;
  }, [refetch]);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Group data by month and vehicle
  const groupedData = {};

  data.forEach((vehicle) => {
    const date = new Date(vehicle.date);
    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Format: "MM-YYYY"

    if (!groupedData[vehicle.vehicleNumber]) {
      groupedData[vehicle.vehicleNumber] = {
        vehicleName: vehicle.vehicleName,
        ownerName: vehicle.ownerName,
        records: {},
      };
    }

    if (!groupedData[vehicle.vehicleNumber].records[monthYear]) {
      groupedData[vehicle.vehicleNumber].records[monthYear] = {
        totalHMR: 0,
        totalOT: 0,
        totalBreakdown: 0,
        totalKm: 0,
        totalDiesel: 0,
      };
    }

    // Accumulate totals
    const record = groupedData[vehicle.vehicleNumber].records[monthYear];
    record.totalHMR += vehicle.totalHMR;
    record.totalOT += vehicle.otHours;
    record.totalBreakdown += vehicle.bdHours;
    record.totalKm += vehicle.totalKm;
    record.totalDiesel += vehicle.diesel;
  });

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Vehicle Rent Records
      </h1>
      <table className="min-w-full border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
              Month
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
              Owner Name
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
              Vehicle Number
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
              Vehicle Name
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
              Total HMR
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
              Total OT
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
              Total Breakdown
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
              Total KM
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
              Total Diesel
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedData).map(([vehicleNumber, vehicleInfo]) =>
            Object.entries(vehicleInfo.records).map(([monthYear, record]) => (
              <tr
                key={`${vehicleNumber}-${monthYear}`}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {monthYear}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {vehicleInfo.ownerName}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {vehicleNumber}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {vehicleInfo.vehicleName}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {record.totalHMR}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {record.totalOT}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {record.totalBreakdown}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {record.totalKm}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {record.totalDiesel}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  <button
                    onClick={
                      () =>
                        navigate(
                          `/staff/vehicle-rent/${vehicleInfo.ownerName}/${vehicleNumber}`
                        ) // Navigate to vehicle details page
                    }
                    className="bg-blue-500 text-white font-bold py-1 px-2 rounded hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleRentTable;
