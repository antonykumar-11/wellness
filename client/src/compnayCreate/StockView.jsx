import React from "react";
import {
  useGetStockItemsQuery,
  useDeleteStockItemMutation,
} from "../store/api/StockItemsApi";
import EditStockModal from "./EditStockModal"; // Assuming you have an EditStockModal component

const StockList = () => {
  const { data: stocks, error, isLoading } = useGetStockItemsQuery();
  const [deleteStock] = useDeleteStockItemMutation();
  const [editingStock, setEditingStock] = React.useState(null);

  if (isLoading) return <p>Loading stocks...</p>;
  if (error) return <p>Error loading stocks: {error.message}</p>;
  if (!stocks || stocks.length === 0) return <p>No stocks available</p>;

  const handleDelete = async (id) => {
    try {
      await deleteStock(id).unwrap();
      alert("Stock deleted successfully");
    } catch (err) {
      alert(`Error deleting stock: ${err.message}`);
    }
  };

  const openEditModal = (stock) => {
    setEditingStock(stock);
  };

  const closeEditModal = () => {
    setEditingStock(null);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Stock List</h2>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-300 dark:border-gray-600">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {/* Table headers */}
            {[
              "ID",
              "Group",
              "Category",
              "Item",
              "Description",
              "Created At",
              "Updated At",
              "Actions",
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900">
          {stocks.map((stock) => (
            <tr
              key={stock._id}
              className="border-t border-gray-300 dark:border-gray-600"
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                {stock._id}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {stock.stockGroup?.name || "N/A"}{" "}
                {/* Ensure you're accessing the correct property */}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {stock.stockCategory}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {stock.stockItem}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {stock.description}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {new Date(stock.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {new Date(stock.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                <button
                  onClick={() => openEditModal(stock)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-500 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(stock._id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingStock && (
        <EditStockModal stock={editingStock} onClose={closeEditModal} />
      )}
    </div>
  );
};

export default StockList;
