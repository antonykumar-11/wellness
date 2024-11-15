import React, { useState } from "react";
import { useGetCompaniesQuery } from "../store/api/CompanyApi";
import { useNavigate } from "react-router-dom";

const CompanyList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetCompaniesQuery();

  // Access the companies array correctly
  const companies = data?.data || []; // Adjust based on your API response

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectCompany = (id) => {
    navigate(`/admin/company/${id}`); // Redirect to company details page
  };

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-800 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Welcome to our customers list
      </h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search company by name"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Company List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && (
          <p className="text-gray-800 dark:text-gray-200">
            Loading companies...
          </p>
        )}
        {isError && <p className="text-red-500">Error loading companies.</p>}
        {filteredCompanies.length === 0 && !isLoading && !isError && (
          <div className="col-span-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 p-6 rounded-md border border-gray-300 dark:border-gray-600">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              No companies found. Please add some companies or adjust your
              search criteria.
            </p>
          </div>
        )}
        {filteredCompanies.map((company) => (
          <div
            key={company._id}
            onClick={() => handleSelectCompany(company._id)}
            className="cursor-pointer p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
          >
            <h2 className="text-lg font-semibold mb-2">
              {company.companyName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Created on: {new Date(company.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;
