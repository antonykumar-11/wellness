import React, { useState, useEffect } from "react";
import { useCreateLedgerMutation } from "../store/api/LedgerApi";
import { useCreateStockGroupMutation } from "../store/api/StockGroupApi";
import { useAuth } from "../auth/AuthContext";
import { useGetGroupsQuery } from "../store/api/Group";

const CreateStockCategoryForm = () => {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const [formData, setFormData] = useState({
    stockCategory: "",
    group: "",
    under: "",
    category: "",
    nature: "",
    openingBalance: 0, // Set openingBalance to 0
    date: today, // Set date to today's date automatically
  });
  console.log("formData", formData);
  const {
    data: groupsData,
    error: groupsError,
    isLoading: groupsLoading,
  } = useGetGroupsQuery();

  const [createStockCategory, { isLoading, error }] =
    useCreateStockGroupMutation();
  const [createLedger] = useCreateLedgerMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Automatically set under, category, and nature based on selected group
    if (name === "group") {
      const selectedGroup = groupsData?.find((group) => group.name === value);
      if (selectedGroup) {
        setFormData((prevData) => ({
          ...prevData,
          under: selectedGroup._id,
          category: selectedGroup.category || "",
          nature: selectedGroup.nature || "",
          date: today, // Automatically set today's date
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create stock category
      await createStockCategory({
        name: formData.stockCategory,
        userId: user._id, // Include userId from the authenticated user
      }).unwrap();

      // Create Ledger
      await createLedger({
        name: formData.stockCategory,
        payHeadType: "stock",
        group: formData.group,
        under: formData.under,
        category: formData.category,
        nature: formData.nature,
        openingBalance: formData.openingBalance,
        date: formData.date,
      }).unwrap();

      alert("Stock group and ledger created successfully!");
      setFormData({
        stockCategory: "",
        group: "",
        under: "",
        category: "",
        nature: "",
        openingBalance: 0, // Reset to 0
        date: today, // Reset to today's date
      });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Classes for dark and light mode (adjust based on your theme)
  const formClassName =
    "p-6 rounded-lg shadow-lg max-w-md mx-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600";
  const labelClassName =
    "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const inputClassName =
    "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 focus:ring-indigo-500";
  const buttonClassName = "px-4 py-2 font-semibold rounded-md shadow-md";
  const cancelButtonClassName = "bg-gray-500 text-white hover:bg-gray-600";
  const submitButtonClassName = "bg-blue-500 text-white hover:bg-blue-600";

  return (
    <div className="container mx-auto p-4">
      <div className={formClassName}>
        <h2 className="text-2xl font-bold mb-4">Create Stock Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="stockCategory" className={labelClassName}>
              Stock Category
            </label>
            <input
              type="text"
              id="stockCategory"
              name="stockCategory"
              value={formData.stockCategory}
              onChange={handleChange}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label htmlFor="group" className={labelClassName}>
              Group
            </label>
            <select
              id="group"
              name="group"
              value={formData.group}
              onChange={handleChange}
              className={inputClassName}
              required
            >
              <option value="" disabled>
                Select a group
              </option>
              {groupsData?.map((group) => (
                <option key={group._id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  stockCategory: "",
                })
              }
              className={`${buttonClassName} ${cancelButtonClassName}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${buttonClassName} ${submitButtonClassName}`}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Stock Category"}
            </button>
          </div>
          {error && <p className="text-red-500">{error.data.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateStockCategoryForm;
