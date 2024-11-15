import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCompanyByIdQuery,
  useDeleteCompanyMutation,
} from "../store/api/CompanyApi";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: company, isLoading, isError } = useGetCompanyByIdQuery(id);
  const [deleteCompany, { isLoading: isDeleting, isError: isDeleteError }] =
    useDeleteCompanyMutation();

  const handleDelete = async () => {
    try {
      await deleteCompany(id).unwrap();
      alert("Company deleted successfully!");
      navigate("/admin/companydetails"); // Redirect to company list after deletion
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/companies/update/${id}`); // Navigate to update page
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading company details.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Company Details
      </h1>

      {company && (
        <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
          {/* Company Avatar */}
          <div className="flex-shrink-0">
            {company.avatar && (
              <img
                src={company.avatar}
                alt={`${company.companyName} logo`}
                className="w-40 h-40 object-cover mb-4 rounded-full border border-gray-300 dark:border-gray-600"
              />
            )}
          </div>

          {/* Main Company Information */}
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              {company.data.companyName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              <strong>Registration Type:</strong>{" "}
              {company.data.registrationType}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              <strong>Registration Under:</strong>{" "}
              {company.data.registrationUnder}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Created on:{" "}
              {new Date(company.data.createdAt).toLocaleDateString()}
            </p>

            {/* Company Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Basic Address Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Address Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Street:</strong> {company.data.street}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Main Area:</strong> {company.data.MainArea}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>ZIP Code:</strong> {company.data.ZIPCode}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>City:</strong> {company.data.City}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Country:</strong> {company.data.Country}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>State:</strong> {company.data.State}
                </p>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Contact Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Email:</strong> {company.data.companyEmail}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Mobile:</strong> {company.data.companyMobile}
                </p>
              </div>
            </div>

            {/* Bank & Registration Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Bank Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Bank Name:</strong> {company.data.bankName}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Account Number:</strong> {company.data.accountNumber}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>IFSC Code:</strong> {company.data.ifscCode}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Branch:</strong> {company.data.branch}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Registration Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Aadhar Number:</strong>{" "}
                  {company.data.companyAdarNumber}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>GST Number:</strong> {company.data.gstNumber}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>PAN Number:</strong> {company.data.companyPanNumber}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>TAN Number:</strong> {company.data.tanNumber}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Edit Company
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Company"}
              </button>
              {isDeleteError && (
                <p className="text-red-500 mt-4 text-center">
                  Error deleting company.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
