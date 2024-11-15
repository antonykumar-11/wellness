import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useUpdateLedgerMutation } from "../store/api/LedgerApi";
import { useGetGroupsQuery } from "../store/api/Group";

const EditLedger = ({ ledger, onClose }) => {
  const { data: groupsData, isLoading } = useGetGroupsQuery();
  const [formData, setFormData] = useState(ledger);
  const [error, setError] = useState(null);
  const [updateLedger] = useUpdateLedgerMutation();

  useEffect(() => {
    setFormData(ledger);
  }, [ledger]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "group") {
      const selectedGroup = groupsData.find((group) => group.name === value);
      if (selectedGroup) {
        setFormData((prev) => ({
          ...prev,
          under: selectedGroup._id,
          category: selectedGroup.category || "",
          nature: selectedGroup.nature || "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure formData includes the _id
    const dataToSubmit = {
      ...formData,
      id: ledger._id, // Add _id explicitly from the ledger prop
    };

    try {
      await updateLedger(dataToSubmit).unwrap();
      alert("Ledger updated successfully!");
      onClose();
    } catch (err) {
      console.error("Error updating ledger:", err);
      const errorMessage = err.response
        ? err.response.data.error
        : "An error occurred";
      setError(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 mt-24">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Edit Ledger
          </h1>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ledger ID field */}
          <input type="hidden" name="id" value={formData._id} />

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mt-1"
              required
            />
          </div>
          <div>
            <label
              htmlFor="group"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Group
            </label>
            <select
              id="group"
              name="group"
              value={formData.group}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mt-1"
              required
            >
              <option value="">Select Group</option>
              {!isLoading &&
                groupsData.map((group) => (
                  <option key={group._id} value={group.name}>
                    {group.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              readOnly
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-600 rounded text-gray-900 dark:text-gray-100 mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="nature"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nature
            </label>
            <input
              type="text"
              id="nature"
              name="nature"
              value={formData.nature}
              readOnly
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-600 rounded text-gray-900 dark:text-gray-100 mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="openingBalance"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Opening Balance
            </label>
            <input
              type="number"
              id="openingBalance"
              name="openingBalance"
              value={formData.openingBalance}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mt-1"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Update Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLedger;
