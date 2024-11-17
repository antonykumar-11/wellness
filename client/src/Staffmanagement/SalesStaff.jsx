import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetEmployeeDetailsByIdQuery,
  useDeleteEmployeeByIdMutation,
} from "../store/api/StaffApi";

const EmployeeDetail = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const {
    data: employee,
    isLoading,
    error,
    refetch,
  } = useGetEmployeeDetailsByIdQuery(employeeId);
  console.log("employee", employee);
  const [deleteEmployee] = useDeleteEmployeeByIdMutation();

  const [formData, setFormData] = useState({});
  useEffect(() => {
    refetch();
  }, [refetch]);
  useEffect(() => {
    if (employee) {
      console.log("employee", employee);
      if (employee.registrationType === "vehicle") {
        setFormData({
          vehicleRegistrationNumber: employee.vehicleRegistrationNumber,
          ownerName: employee.userName,
          vehicleType: employee.vehicleType,
          rentalStartDate: employee.rentalStartDate,
          ownerAddress: employee.ownerAddress,
          gst: employee.gst,
          pan: employee.pan,
          phone: employee.phoneNumber,
        });
      } else {
        setFormData({
          ownerName: employee.name,
          position: employee.designation,
          email: employee.contact.email,
          phone: employee.contact.phone,
          address: employee.address,
          bankName: employee.bankDetails.bankName,
          accountNumber: employee.bankDetails.accountNumber,
          ifscCode: employee.bankDetails.ifscCode,
          mother: employee.familyDetails.fatherOrMotherName,
          spouse: employee.familyDetails.spouseName,
          branchName: employee.bankDetails.branchName,
          registrationType: employee.registrationType,
          dateOfHire: employee.dateOfHire,
          designation: employee.designation,
          bloodGroup: employee.bloodGroup,
          employeeId: employee.employeeId,
          aadhaarCard: employee.aadhaarCard,
          incomeTaxPAN: employee.incomeTaxPAN,
          pfAccountNumber: employee.pfAccountNumber,
          prAccountNumber: employee.prAccountNumber,
          esiNumber: employee.esiNumber,
        });
      }
    }
  }, [employee]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading employee details.</p>;
  if (!employee) return <p>Employee not found.</p>;

  const handleUpdate = () => {
    navigate(`/staff/staff/all/${employeeId}`); // Redirect to the staff page
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(employeeId).unwrap();
        alert("Employee deleted successfully");
        navigate("/staff"); // Redirect after deletion
      } catch (err) {
        console.error("Failed to delete employee:", err);
      }
    }
  };

  const handleCreateSalary = () => {
    navigate(`/staff/pay/${employeeId}`);
  };

  const handleShowSalaryCalculator = () => {
    navigate(`/staff/setting/${employeeId}`);
  };
  console.log("formData", formData);
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Employee Details Header */}
        <div className="flex items-center space-x-6 mb-6">
          <img
            src={employee.avatar || "https://via.placeholder.com/100"}
            alt={employee.userName || formData.ownerName}
            className="w-24 h-24 object-cover rounded-full border border-gray-600 dark:border-gray-400"
          />
          <div>
            <h2
              className="text-3xl font-bold text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {formData.ownerName || employee.userName}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              For Company: {formData.registrationType || "Owner of Vehicle"}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Employee ID: {employee.employeeId || "Owner of Vehicle"}
            </p>
          </div>
        </div>

        {/* Main Details Section */}
        <div className="space-y-4">
          <h3
            className="text-xl font-semibold mb-4"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {employee.registrationType === "vehicle"
              ? "Vehicle Details"
              : "Employee Details"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div>
                <p>Name: {formData.name || employee.userName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {employee.dateOfBirth
                    ? `Date of Birth: ${new Date(
                        employee.dateOfBirth
                      ).toLocaleDateString()}`
                    : employee.registrationType === "vehicle" &&
                      employee.rentalStartDate
                    ? `Rental Start Date: ${new Date(
                        employee.rentalStartDate
                      ).toLocaleDateString()}`
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gender: {employee.gender || "N/A"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Blood Group: {employee.bloodGroup || "N/A"}
                </p>
              </div>
              <div className="mt-4">
                <h1>Personal Details</h1>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Email: <span className="ml-2">{formData.email}</span>
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Phone: <span className="ml-2">{formData.phone}</span>
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Aadhaar Card:{" "}
                  <span className="ml-2">{formData.aadhaarCard}</span>
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Income Tax PAN:{" "}
                  <span className="ml-2">{formData.incomeTaxPAN}</span>
                </p>
              </div>
              {/* Family & Address Details */}
              <div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    Family
                  </p>
                  <p className="text-gray-700 dark:text-gray-400">
                    Mother/Father: {formData.mother}
                  </p>
                  <p className="text-gray-700 dark:text-gray-400">
                    Spouse: {formData.spouse}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    Address:
                  </p>
                  <p className="text-gray-700 dark:text-gray-400">
                    {formData.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Company Details
                </p>
                <p className="text-gray-700 dark:text-gray-400">
                  Date of Hire:{" "}
                  {employee.dateOfHire
                    ? new Date(employee.dateOfHire).toLocaleDateString()
                    : employee.registrationType === "vehicle" &&
                      employee.rentalStartDate
                    ? new Date(employee.rentalStartDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-400">
                  Designation: {formData.designation}
                </p>
                <p className="text-gray-700 dark:text-gray-400">
                  PF Number: {formData.pfAccountNumber}
                </p>
                <p className="text-gray-700 dark:text-gray-400">
                  PR Number: {formData.prAccountNumber}
                </p>
                <p className="text-gray-700 dark:text-gray-400">
                  ESI Number: {formData.esiNumber}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Bank Details
                </p>
                <p className="text-gray-700 dark:text-gray-400">
                  Bank Name: {formData.bankName}
                </p>
                <p className="text-gray-700 dark:text-gray-400">
                  Branch Name: {formData.branchName}
                </p>
                <p className="text-gray-700 dark:text-gray-400">
                  Account Number: {formData.accountNumber}
                </p>
                <p className="text-gray-700 dark:text-gray-400">
                  IFSC: {formData.ifscCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 w-full md:w-auto"
          >
            Update Details
          </button>
          <button
            onClick={handleCreateSalary}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 w-full md:w-auto"
          >
            Create Salary
          </button>
          <button
            onClick={handleShowSalaryCalculator}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 w-full md:w-auto"
          >
            Show Salary Calculator
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 w-full md:w-auto"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
