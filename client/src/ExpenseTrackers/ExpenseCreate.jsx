import React, { useState } from "react";
import { useAddTransectionMutation } from "../store/api/TransactionTrackApi";

function TransactionCreate() {
  const [addTransaction, { isLoading: isAdding }] = useAddTransectionMutation();
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    amount: "",
    type: "income",
    category: "",
    description: "",
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransaction(newTransaction).unwrap();
      // Reset the form
      setNewTransaction({
        date: "",
        amount: "",
        type: "income",
        category: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          create Transaction
        </h2>
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, date: e.target.value })
              }
              className="border border-gray-400 dark:border-gray-600 p-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Amount
            </label>
            <input
              type="number"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, amount: e.target.value })
              }
              className="border border-gray-400 dark:border-gray-600 p-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, type: e.target.value })
              }
              className="border border-gray-400 dark:border-gray-600 p-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Category
            </label>
            <input
              type="text"
              value={newTransaction.category}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  category: e.target.value,
                })
              }
              className="border border-gray-400 dark:border-gray-600 p-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={newTransaction.description}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  description: e.target.value,
                })
              }
              className="border border-gray-400 dark:border-gray-600 p-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TransactionCreate;
