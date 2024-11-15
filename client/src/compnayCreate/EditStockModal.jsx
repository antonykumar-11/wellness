// EditStockModal.js
import React, { useState, useEffect } from "react";
import { useUpdateStockMutation } from "../store/api/StockApi";

const EditStockModal = ({ stock, onClose }) => {
  const [formData, setFormData] = useState(stock);
  const [updateStock, { isLoading, error }] = useUpdateStockMutation();

  useEffect(() => {
    setFormData(stock);
  }, [stock]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStock({ id: formData._id, ...formData }).unwrap();
      alert("Stock updated successfully!");
      onClose();
    } catch (err) {
      alert(`Error updating stock: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-6 rounded-lg shadow-lg max-w-md mx-auto bg-white border border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Edit Stock Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="stockGroup"
              className="block text-sm font-medium text-gray-700"
            >
              Stock Group
            </label>
            <input
              type="text"
              id="stockGroup"
              name="stockGroup"
              value={formData.stockGroup}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="stockCategory"
              className="block text-sm font-medium text-gray-700"
            >
              Stock Category
            </label>
            <input
              type="text"
              id="stockCategory"
              name="stockCategory"
              value={formData.stockCategory}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="stockItem"
              className="block text-sm font-medium text-gray-700"
            >
              Stock Item
            </label>
            <input
              type="text"
              id="stockItem"
              name="stockItem"
              value={formData.stockItem}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              rows="3"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Stock Item"}
            </button>
          </div>
          {error && <p className="text-red-500">{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditStockModal;
