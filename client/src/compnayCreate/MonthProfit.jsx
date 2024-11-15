import React, { useState } from "react";
import { useAddMonthProfitMutation } from "../store/api/MonthProfitApi";
import { toast } from "react-toastify"; // Ensure react-toastify is installed

const ResponsiveForm = () => {
  // Initial state for form data
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    vehicleNumber: "",
    amount: "",
    ownerName: "",
    gst: "",
    tds: "",
    ownerAmount: "",
    esi: "",
    pf: "",
    openingBalance: "",
    expense: "",
    closingBalance: "",
    transactionDate: "", // Single input for transaction date
  });

  const [addMonthProfit, { isLoading }] = useAddMonthProfitMutation(); // Handle loading state for submission

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if transactionDate is filled
    if (!formData.transactionDate) {
      toast.error("Transaction date is required.");
      return;
    }

    try {
      // Call the mutation and wait for result
      const result = await addMonthProfit(formData);

      // Check if the result has an error field or if the status indicates a failure
      if (result.error) {
        // Handle any errors that come from the server
        throw new Error(
          result.error?.data?.message || "Failed to create transaction."
        );
      }

      // Show success message on successful transaction creation
      toast.success("Transaction created successfully!");

      // Clear form after successful submission
      setFormData({
        invoiceNumber: "",
        vehicleNumber: "",
        amount: "",
        ownerName: "",
        gst: "",
        tds: "",
        ownerAmount: "",
        esi: "",
        pf: "",
        openingBalance: "",
        expense: "",
        closingBalance: "",
        transactionDate: "", // Clear transaction date after submission
      });
    } catch (error) {
      // Log the error for debugging
      console.error("Failed to submit the form:", error);

      // Show error message to the user
      toast.error(
        error.message || "Error creating transaction. Please try again."
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-300">
        Transaction Form
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
      >
        {/* Form Fields */}
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label
              htmlFor={key}
              className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-200"
            >
              {key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={
                key === "transactionDate"
                  ? "date" // Use date input for transaction date
                  : key === "amount" ||
                    key === "gst" ||
                    key === "tds" ||
                    key === "esi" ||
                    key === "pf" ||
                    key === "openingBalance" ||
                    key === "expense"
                  ? "number"
                  : "text"
              }
              id={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={`Enter ${
                key.charAt(0).toUpperCase() + key.slice(1)
              }`}
              className="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}

        {/* Submit Button */}
        <div className="md:col-span-3 flex justify-end">
          <button
            type="submit"
            className={`px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading} // Disable button during form submission
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResponsiveForm;
