import React, { useState } from "react";
import { useCreateCustomerMutation } from "../store/api/CustomerAPi"; // Ensure the import path is correct
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const CustomerManagement = () => {
  const [createCustomer, { isLoading: isCreating, error: createError }] =
    useCreateCustomerMutation();
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone_number: "",
    last_called: null,
    next_call: null,
  });

  // Handle form submission for creating a new customer
  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone_number) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Make API call to create customer
      await createCustomer(newCustomer).unwrap();
      toast.success("Customer saved successfully!");

      // Clear the form after successful creation
      //   setNewCustomer({
      //     name: "",
      //     phone_number: "",
      //     last_called: null,
      //     next_call: null,
      //   });
    } catch (error) {
      if (error && error.message === "Customer already exists") {
        toast.error("A customer with this phone number already exists.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Customer</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateCustomer();
        }}
        className="space-y-4 max-w-md mx-auto"
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
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isCreating ? "Creating..." : "Create Customer"}
        </button>
      </form>

      {/* Toast Container for displaying notifications */}
      <ToastContainer />
    </div>
  );
};

export default CustomerManagement;
