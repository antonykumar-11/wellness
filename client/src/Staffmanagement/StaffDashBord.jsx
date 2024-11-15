import React from "react";
import { useGetAllEmployeesQuery } from "../store/api/StaffApi";
import Header from "../Staffmanagement/StaffHeader1";
import SalaryDisply from "../Staffmanagement/SalaryDisplay";
import StaffStatCard from "./StaffStatCard"; // Adjust the path if necessary
import { FaUsers, FaTaxi, FaUserTie } from "react-icons/fa"; // Example icons

const StaffDashBord = () => {
  const { data: employees, isLoading, isError } = useGetAllEmployeesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  // Calculate totals
  const totalEmployees = employees.length;
  const totalDrivers = employees.filter(
    (emp) => emp.underEmployee === "Driver"
  ).length;
  const totalOwners = employees.filter(
    (emp) => emp.underEmployee === "Owner"
  ).length;

  const handleCardClick = (role) => {
    console.log(`${role} card clicked!`);
  };

  return (
    <div className="flex-1 overflow-auto relative mt-10 z-10">
      <Header title="Overview your staff management" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StaffStatCard
            name="Total Employees"
            icon={FaUsers}
            value={totalEmployees}
            color="#FFDD57"
            onClick={() => handleCardClick("Total Employees")}
          />
          <StaffStatCard
            name="Total Drivers"
            icon={FaTaxi}
            value={totalDrivers}
            color="#4A90E2"
            onClick={() => handleCardClick("Total Drivers")}
          />
          <StaffStatCard
            name="Total Owners"
            icon={FaUserTie}
            value={totalOwners}
            color="#E94E77"
            onClick={() => handleCardClick("Total Owners")}
          />
        </div>
        <SalaryDisply />
      </main>
    </div>
  );
};

export default StaffDashBord;
