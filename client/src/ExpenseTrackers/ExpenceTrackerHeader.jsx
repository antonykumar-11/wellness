import React, { useState } from "react";
import {
  useEditTransactionMutation,
  useDeleteTransectionMutation,
  useGetAllTransectionsQuery,
} from "../store/api/TransactionTrackApi";
import { AiOutlineClose } from "react-icons/ai";

function TransactionTable({ transactions }) {
  const [editTransaction, { isLoading: isEditing }] =
    useEditTransactionMutation();
  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransectionMutation();
  const { refetch } = useGetAllTransectionsQuery(); // To refetch data after update

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Open edit modal with selected transaction data
  const openEditModal = (transaction) => {
    setSelectedTransaction({
      ...transaction,
      date: transaction.date.substring(0, 10), // Format date for input
    });
    setEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedTransaction(null);
  };

  // Handle form submission for editing
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const { _id: transactionId, ...updatedData } = selectedTransaction;

      // Call the editTransaction mutation
      await editTransaction({ transactionId, payload: updatedData }).unwrap();

      // Refetch the data after update
      await refetch();

      // Close modal after successful update
      closeEditModal();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  // Handle transaction deletion
  const handleDelete = async (_id) => {
    try {
      await deleteTransaction(_id).unwrap();
      await refetch(); // Refetch data after deletion
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Transaction List</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-center">Date</th>
            <th className="border border-gray-300 p-2 text-center">Amount</th>
            <th className="border border-gray-300 p-2 text-center">Type</th>
            <th className="border border-gray-300 p-2 text-center">Category</th>
            <th className="border border-gray-300 p-2 text-center">
              Description
            </th>
            <th className="border border-gray-300 p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(transactions) && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="border border-gray-300 p-2 text-center">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>

                <td className="border border-gray-300 p-2 text-center">
                  {transaction.amount}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {transaction.type}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {transaction.category}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {transaction.description}
                </td>

                <td className="border border-gray-300 p-2 text-center">
                  <button
                    className="mr-2 text-blue-600"
                    onClick={() => openEditModal(transaction)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(transaction._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center border border-gray-300 p-2"
              >
                No transactions available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full sm:w-2/3 lg:w-1/2 max-w-xl mx-auto overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeEditModal}
            >
              <AiOutlineClose size={24} />
            </button>

            <h2 className="text-lg font-semibold mb-4">Edit Transaction</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={selectedTransaction.amount}
                  onChange={(e) =>
                    setSelectedTransaction({
                      ...selectedTransaction,
                      amount: e.target.value,
                    })
                  }
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Type</label>
                <select
                  name="type"
                  value={selectedTransaction.type}
                  onChange={(e) =>
                    setSelectedTransaction({
                      ...selectedTransaction,
                      type: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={selectedTransaction.category}
                  onChange={(e) =>
                    setSelectedTransaction({
                      ...selectedTransaction,
                      category: e.target.value,
                    })
                  }
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={selectedTransaction.description}
                  onChange={(e) =>
                    setSelectedTransaction({
                      ...selectedTransaction,
                      description: e.target.value,
                    })
                  }
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={selectedTransaction.date} // Already formatted earlier
                  onChange={(e) =>
                    setSelectedTransaction({
                      ...selectedTransaction,
                      date: e.target.value,
                    })
                  }
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <button
                type="submit"
                className={`w-full px-4 py-2 rounded-md text-white ${
                  isEditing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isEditing}
              >
                {isEditing ? "Updating..." : "Update Transaction"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionTable;
