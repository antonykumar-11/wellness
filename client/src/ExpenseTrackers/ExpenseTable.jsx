import React, { useState } from "react";
import {
  useEditTransactionMutation,
  useDeleteTransectionMutation,
  useGetAllTransectionsQuery,
} from "../store/api/TransactionTrackApi";
import { AiOutlineClose } from "react-icons/ai";

function TransactionTable() {
  const [frequency, setFrequency] = useState("all");
  const [selectedDate, setSelectedDate] = useState(["", ""]);
  const [type, setType] = useState("all");

  const [editTransaction, { isLoading: isEditing }] =
    useEditTransactionMutation();
  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransectionMutation();

  const {
    data: transactions,
    isLoading: isFetching,
    refetch,
  } = useGetAllTransectionsQuery({ frequency, selectedDate, type });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const openEditModal = (transaction) => {
    setSelectedTransaction({
      ...transaction,
      date: transaction.date.substring(0, 10),
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { _id: transactionId, ...updatedData } = selectedTransaction;
      await editTransaction({ transactionId, payload: updatedData }).unwrap();
      await refetch();
      closeEditModal();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDelete = async (_id) => {
    try {
      await deleteTransaction(_id).unwrap();
      await refetch();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="text-gray-900 mb-4">
        {/* Frequency Filter */}
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="mr-4 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
        >
          <option value="custom">Custom</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="all">All time</option>
        </select>
        {frequency === "custom" && (
          <>
            <input
              type="date"
              name="fromDate"
              onChange={(e) =>
                setSelectedDate([e.target.value, selectedDate[1]])
              }
              className="mr-2 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
            />
            <input
              type="date"
              name="toDate"
              onChange={(e) =>
                setSelectedDate([selectedDate[0], e.target.value])
              }
              className="mr-2 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
            />
          </>
        )}
        {/* Type Filter */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
        >
          <option value="all">All</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <h2 className="text-xl font-semibold mb-4">Transaction List</h2>

      {/* Responsive Table or Card Display */}
      <div className="overflow-x-auto">
        {Array.isArray(transactions) && transactions.length > 0 ? (
          <>
            {/* Table for larger screens */}
            <div className="hidden lg:block">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-center">
                      Date
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Amount
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Type
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Category
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Description
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
                    >
                      <td className="p-2 text-center">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-center">{transaction.amount}</td>
                      <td className="p-2 text-center">{transaction.type}</td>
                      <td className="p-2 text-center">
                        {transaction.category}
                      </td>
                      <td className="p-2 text-center">
                        {transaction.description}
                      </td>
                      <td className="p-2 text-center">
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card layout for small screens */}
            <div className="block lg:hidden">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-gray-300 p-4 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <div className="flex justify-between mb-2">
                    <span>Date:</span>
                    <span>
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Amount:</span>
                    <span>{transaction.amount}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Type:</span>
                    <span>{transaction.type}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Category:</span>
                    <span>{transaction.category}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Description:</span>
                    <span>{transaction.description}</span>
                  </div>
                  <div className="flex justify-end">
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
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center border border-gray-300 p-2">
            No transactions available
          </div>
        )}
      </div>
      {/* Edit Modal */}
      {editModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg relative w-full sm:w-2/3 lg:w-1/2 max-w-xl mx-auto overflow-y-auto">
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
                  className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 w-full rounded"
                  required
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
                  className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 w-full rounded"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
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
                  className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 w-full rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  value={selectedTransaction.description}
                  onChange={(e) =>
                    setSelectedTransaction({
                      ...selectedTransaction,
                      description: e.target.value,
                    })
                  }
                  className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 w-full rounded"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
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
