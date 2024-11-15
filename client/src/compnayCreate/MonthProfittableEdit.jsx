import React, { useEffect, useState } from "react";
import {
  useGetMonthProfitByIdQuery,
  useUpdateMonthProfitMutation,
  useDeleteMonthProfitMutation,
} from "../store/api/MonthProfitApi";
import { toast } from "react-toastify"; // Ensure react-toastify is installed
import { useParams, useNavigate } from "react-router-dom";

const MonthProfittableEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const { data, error, isLoading: isFetching } = useGetMonthProfitByIdQuery(id);
  const [updateMonthProfit, { isLoading: isUpdating }] =
    useUpdateMonthProfitMutation();
  const [deleteMonthProfit, { isLoading: isDeleting }] =
    useDeleteMonthProfitMutation();

  // Populate form data when the data is fetched
  useEffect(() => {
    if (data) {
      setFormData({
        invoiceNumber: data.invoiceNumber,
        vehicleNumber: data.vehicleNumber,
        amount: data.amount,
        ownerName: data.ownerName,
        gst: data.gst,
        tds: data.tds,
        ownerAmount: data.ownerAmount,
        esi: data.esi,
        pf: data.pf,
        openingBalance: data.openingBalance,
        expense: data.expense,
        closingBalance: data.closingBalance,
        transactionDate: data.transactionDate,
      });
    }
  }, [data]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle form submission for updating
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.transactionDate) {
      toast.error("Transaction date is required.");
      return;
    }

    try {
      const result = await updateMonthProfit({ id, formData });

      if (result.error) {
        throw new Error(
          result.error?.data?.message || "Failed to update transaction."
        );
      }

      toast.success("Transaction updated successfully!");
      navigate(`/admin/monthprofittable`); // Redirect after successful update
    } catch (error) {
      console.error("Failed to update the form:", error);
      toast.error(
        error.message || "Error updating transaction. Please try again."
      );
    }
  };

  // Handle delete button click
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const result = await deleteMonthProfit(id);

        if (result.error) {
          throw new Error(
            result.error?.data?.message || "Failed to delete transaction."
          );
        }

        toast.success("Transaction deleted successfully!");
        navigate(`/admin/monthprofittable`); // Redirect after successful deletion
      } catch (error) {
        console.error("Failed to delete the transaction:", error);
        toast.error(
          error.message || "Error deleting transaction. Please try again."
        );
      }
    }
  };

  if (isFetching) return <div>Loading...</div>;
  if (error) return <div>Error loading transaction data</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-300">
        Transaction Form
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
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
                  ? "date"
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
        <div className="md:col-span-3 flex justify-between">
          <button
            type="submit"
            className={`px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              isUpdating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className={`px-6 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition duration-300 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MonthProfittableEdit;
