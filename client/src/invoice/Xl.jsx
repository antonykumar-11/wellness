import React from "react";
import { useGetAllCustomersQuery } from "../store/api/CustomerAPi";
import * as XLSX from "xlsx";

const XGetCustomer = () => {
  const {
    data: customers,
    error: fetchError,
    isLoading,
    refetch,
  } = useGetAllCustomersQuery();

  const handleExportToExcel = () => {
    if (!customers || customers.length === 0) {
      alert("No customer data to export!");
      return;
    }

    // Prepare data for the Excel sheet
    const customerData = customers.map((customer) => ({
      Name: customer.name,
      PhoneNumber: customer.phone_number,
    }));

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet(customerData);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    // Generate and download the Excel file
    XLSX.writeFile(workbook, "CustomerData.xlsx");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Customer List</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : fetchError ? (
        <p>Error fetching customers!</p>
      ) : (
        <>
          <button
            onClick={handleExportToExcel}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
          >
            Export to Excel
          </button>
          <ul className="list-disc pl-5">
            {customers?.map((customer) => (
              <li key={customer._id}>
                {customer.name} - {customer.phone_number}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default XGetCustomer;
