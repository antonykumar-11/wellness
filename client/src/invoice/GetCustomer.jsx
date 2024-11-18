import React, { useState, useEffect } from "react";
import {
  useGetAllCustomersQuery,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
} from "../store/api/CustomerAPi"; // Ensure the import path is correct
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const GetCustomer = () => {
  const {
    data: customers,
    error: fetchError,
    isLoading,
    refetch,
  } = useGetAllCustomersQuery();
  const [deleteCustomer] = useDeleteCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [lastCalledMessage, setLastCalledMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [newCustomer, setNewCustomer] = useState({
    id: "",
    name: "",
    phone_number: "",
    last_called: null,
    next_call: null,
  });

  // Handle customer deletion
  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer(id).unwrap(); // Pass the customer ID
      toast.success("Customer deleted successfully!");
      refetch();
    } catch (error) {
      toast.error("Error deleting customer. Please try again.");
    }
  };

  // Handle customer update
  const handleUpdateCustomer = async (e) => {
    e.preventDefault();

    const updatedCustomer = {
      id: newCustomer.id, // The customer ID from the form
      updatedData: {
        name: newCustomer.name,
        phone_number: newCustomer.phone_number,
        last_called: newCustomer.last_called,
        next_call: newCustomer.next_call,
      },
    };

    try {
      await updateCustomer(updatedCustomer).unwrap(); // Pass ID and updated data
      toast.success("Customer updated successfully!");
      refetch();
      setNewCustomer({
        id: "",
        name: "",
        phone_number: "",
        last_called: null,
        next_call: null,
      });
    } catch (error) {
      toast.error("Error updating customer. Please try again.");
    }
  };

  // Set form data for editing when "Edit" button is clicked
  const handleEditCustomer = (customer) => {
    setNewCustomer({
      id: customer._id, // Use _id from server data
      name: customer.name,
      phone_number: customer.phone_number,
      last_called: customer.last_called,
      next_call: customer.next_call,
    });
  };

  // Function to handle marking a customer as called
  const handleCallCustomer = async (customer) => {
    // Ask for confirmation before marking the call
    const isConfirmed = window.confirm(
      "Are you sure you want to mark this call?"
    );

    if (isConfirmed) {
      const updatedData = {
        last_called: new Date(), // Set the current date and time
      };

      try {
        await updateCustomer({ id: customer._id, updatedData }).unwrap();
        setLastCalledMessage(
          `This number was called on ${new Date().toLocaleString()}`
        );
        toast.success("Customer call marked successfully!");
        refetch();
      } catch (error) {
        toast.error("Error marking call. Please try again.");
      }
    }
  };

  // Show error message if fetching customers failed
  if (fetchError) {
    toast.error("Error fetching customer data. Please try again.");
  }

  // Display loading, error, or no data messages
  if (isLoading) return <div>Loading customer data...</div>;

  // Filter customers based on search query
  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by name
      customer.phone_number.includes(searchQuery) // Search by phone number
  );

  return (
    <>
      <div className="hidden sm:block container mx-auto p-4 sm:p-2">
        <h1 className="text-xl font-bold mb-4 text-center">
          Veda Wellness Customer
        </h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            placeholder="Search by name or phone number..."
            className="border border-gray-300 p-2 rounded-md w-full sm:w-1/3"
          />
        </div>

        {filteredCustomers && filteredCustomers.length === 0 ? (
          <div>No customers found. Please add a customer.</div>
        ) : (
          <ul className="list-disc pl-5">
            {filteredCustomers?.map((customer) => (
              <li
                key={customer._id} // Use _id as key
                className="mb-4 flex flex-col items-start space-y-2"
              >
                <div>
                  <p className="text-sm">
                    {customer.name} - {customer.phone_number}
                  </p>
                  {customer.last_called && (
                    <div className="mb-4 flex flex-col items-start space-y-2">
                      Last called:{" "}
                      {new Date(customer.last_called).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="mb-4 flex flex-col items-start space-y-2">
                  <button
                    onClick={() => handleEditCustomer(customer)} // Populate form on edit
                    className="bg-yellow-500 text-white py-1 px-2 rounded-md text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer._id)} // Pass _id to delete
                    className="bg-red-500 text-white py-1 px-2 rounded-md text-xs"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      (window.location.href = `tel:${customer.phone_number}`)
                    }
                    className="bg-green-500 text-white py-1 px-2 rounded-md text-xs"
                  >
                    Call
                  </button>
                  <button
                    onClick={() => handleCallCustomer(customer)} // Mark the call
                    className="bg-blue-500 text-white py-1 px-2 rounded-md text-xs"
                  >
                    Mark Call
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h2 className="text-lg font-semibold mt-6 mb-4 text-center">
          {newCustomer.id ? "Update Customer" : "Create New Customer"}
        </h2>
        <form
          onSubmit={handleUpdateCustomer} // Use update handler for the form
          className="space-y-4 max-w-sm mx-auto"
        >
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter Name"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              required
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone_number" className="text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              id="phone_number"
              placeholder="Enter Phone Number"
              value={newCustomer.phone_number}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone_number: e.target.value })
              }
              required
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 text-sm"
          >
            {newCustomer.id ? "Update Customer" : "Create Customer"}
          </button>
        </form>

        <ToastContainer />
      </div>
      <div className="block sm:hidden container mx-auto p-4 sm:p-2 flex flex-col justify-center items-center">
        <h1 className="text-xl font-bold mb-4 text-center">
          Veda Wellness Customer
        </h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            placeholder="Search by name or phone number..."
            className="border border-gray-300 p-2 rounded-md w-full sm:w-1/3"
          />
        </div>

        {filteredCustomers && filteredCustomers.length === 0 ? (
          <div>No customers found. Please add a customer.</div>
        ) : (
          <ul className="list-disc pl-5">
            {filteredCustomers?.map((customer) => (
              <li
                key={customer._id} // Use _id as key
                className="mb-4 flex flex-col items-start space-y-2"
              >
                <div>
                  <p className="text-sm">
                    {customer.name} - {customer.phone_number}
                  </p>
                  {customer.last_called && (
                    <div className="text-xs text-gray-500 mt-1">
                      Last called:{" "}
                      {new Date(customer.last_called).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap space-x-2">
                  <button
                    onClick={() => handleEditCustomer(customer)} // Populate form on edit
                    className="bg-yellow-500 text-white py-1 px-2 rounded-md text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer._id)} // Pass _id to delete
                    className="bg-red-500 text-white py-1 px-2 rounded-md text-xs"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      (window.location.href = `tel:${customer.phone_number}`)
                    }
                    className="bg-green-500 text-white py-1 px-2 rounded-md text-xs"
                  >
                    Call
                  </button>
                  <button
                    onClick={() => handleCallCustomer(customer)} // Mark the call
                    className="bg-blue-500 text-white py-1 px-2 rounded-md text-xs"
                  >
                    Mark Call
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h2 className="text-lg font-semibold mt-6 mb-4 text-center">
          {newCustomer.id ? "Update Customer" : "Create New Customer"}
        </h2>
        <form
          onSubmit={handleUpdateCustomer} // Use update handler for the form
          className="space-y-4 max-w-sm mx-auto"
        >
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter Name"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              required
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone_number" className="text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              id="phone_number"
              placeholder="Enter Phone Number"
              value={newCustomer.phone_number}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone_number: e.target.value })
              }
              required
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 text-sm"
          >
            {newCustomer.id ? "Update Customer" : "Create Customer"}
          </button>
        </form>

        <ToastContainer />
      </div>
      ;
    </>
  );
};

export default GetCustomer;
