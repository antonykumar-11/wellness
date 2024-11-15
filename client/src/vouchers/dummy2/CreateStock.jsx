import React, { useState } from "react";
import { useGetGroupsQuery } from "../../store/api/Group";
import { toast, ToastContainer } from "react-toastify";

const CreateStockGroupForm = ({ createStockGroup, onClose }) => {
  const [formData, setFormData] = useState({
    StockName: "ithuStock",
    name: "",
    group: "Sales Accounts",
    under: "670e618f61db04bc25619c69",
    category: "Income",
    nature: "Credit",
    description: "",
    openingBalance: 0, // Initial state for opening balance
    date: "",
  });

  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useGetGroupsQuery();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createStockGroup(formData); // Call the createStockGroup function passed from the parent
  };

  if (categoriesLoading) return <p>Loading categories...</p>;
  if (categoriesError)
    return <p>Error loading categories: {categoriesError.message}</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Create Stock Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Stock Group Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 focus:ring-indigo-500"
              required
            />
          </div>
          {/* <div>
            <label
              htmlFor="stockGroup"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Stock Category
            </label>
            <select
              id="stockGroup"
              name="stockGroup" // Correct field name here
              value={formData.stockGroup}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 focus:ring-indigo-500"
              required
            >
              <option value="" disabled>
                Select a group
              </option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div> */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md"
            >
              Create Stock Group
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CreateStockGroupForm;
