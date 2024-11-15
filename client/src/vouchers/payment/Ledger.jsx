import React, { useState, useCallback } from "react";
import { useCreateLedgerMutation } from "../../store/api/LedgerApi"; // Adjust path as per your file structure
import { groups, groupTypes } from "./LedgerData";
import { AiOutlineClose } from "react-icons/ai"; // Importing close icon

const Ledger = ({ closeModal }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    voucherNumber: "",
    alias: "",
    group: "",
    category: "",
    nature: "",
    amount: "",
    description: "",
    openingBalance: "",
    date: "", // Added date field
  });

  const [error, setError] = useState(null);
  const [createLedgerMutation] = useCreateLedgerMutation();

  const createLedger = async (ledgerData) => {
    try {
      await createLedgerMutation(ledgerData).unwrap();
      setError(null);
      setFormData({
        name: "",
        voucherNumber: "",
        alias: "",
        group: "",
        category: "",
        nature: "",
        amount: "",
        description: "",
        openingBalance: "",
        date: "", // Reset date field
      });
    } catch (error) {
      console.error("Error creating ledger:", error);
      const errorMessage = error.response
        ? error.response.data.error
        : "An error occurred";
      setError(errorMessage);
      if (errorMessage === "Ledger name already exists") {
        alert("Ledger name already exists");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      ...(name === "group" && {
        category: groupTypes[value]?.type || "",
        nature: groupTypes[value]?.nature || "",
      }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createLedger(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-40"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-full max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex-grow text-center">
            Create Ledger
          </h1>
          <button
            onClick={closeModal}
            className="text-gray-600 hover:text-gray-900"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 shadow-md rounded-md flex-grow space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700">Voucher Number</label>
              <input
                type="text"
                name="voucherNumber"
                value={formData.voucherNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Alias</label>
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Group</label>
              <select
                name="group"
                value={formData.group}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              >
                <option value="">Select Group</option>
                {groups.map((group, index) => (
                  <option key={index} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
            {formData.group && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-200"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Nature</label>
                  <input
                    type="text"
                    name="nature"
                    value={formData.nature}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-200"
                  />
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-gray-700">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Opening Balance</label>
              <input
                type="number"
                name="openingBalance"
                value={formData.openingBalance}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mt-4"
          >
            Create Ledger
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Ledger;
