import React, { useEffect, useState } from "react";
import { useGetAllTransectionsQuery } from "../store/api/TransactionTrackApi";

function ExpenseChart() {
  // Range filter states
  const [frequency, setFrequency] = useState("all");
  const [selectedDate, setSelectedDate] = useState([null, null]); // ["fromDate", "toDate"]
  const [type, setType] = useState("all");

  // Fetch transactions based on filter criteria
  const {
    data: transactions,
    isLoading: isFetching,
    refetch,
  } = useGetAllTransectionsQuery({ frequency, selectedDate, type });

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Unique transactions filtering
  const uniqueTransactions = transactions || [];

  // Total transactions
  const totalTransaction = uniqueTransactions.length;
  const totalIncomeTransactions = uniqueTransactions.filter(
    (transaction) => transaction.type === "income"
  ).length;
  const totalExpenseTransactions = uniqueTransactions.filter(
    (transaction) => transaction.type === "expense"
  ).length;

  // Total turnover
  const totalIncomeTurnover = uniqueTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0);

  const totalExpenseTurnover = uniqueTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0);

  const totalTurnover = uniqueTransactions.reduce(
    (acc, transaction) => acc + Number(transaction.amount),
    0
  );

  // Category-wise income and expense amounts
  const expenseCategories = uniqueTransactions
    .filter(
      (transaction) => transaction.type === "expense" && transaction.category
    )
    .reduce((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + Number(transaction.amount);
      return acc;
    }, {});

  const incomeCategories = uniqueTransactions
    .filter(
      (transaction) => transaction.type === "income" && transaction.category
    )
    .reduce((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + Number(transaction.amount);
      return acc;
    }, {});

  return (
    <div className="flex flex-col items-center p-4">
      <div className="text-gray-900">
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
              placeholder="From date"
            />
            <input
              type="date"
              name="toDate"
              onChange={(e) =>
                setSelectedDate([selectedDate[0], e.target.value])
              }
              className="mr-2 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
              placeholder="To date"
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

      <h2 className="text-lg font-semibold mb-4">Transaction Overview</h2>

      <div className="flex flex-col md:flex-row justify-center space-x-0 md:space-x-4 w-full max-w-6xl h-full">
        {/* Transaction Box */}
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md w-full max-w-xl mb-4 md:mb-0">
          <h3 className="text-xl font-semibold">Total Transaction</h3>
          <p className="bg-gray-100 dark:bg-gray-700">
            Total Transactions: {totalTransaction}
          </p>
          <p className="text-green-500">
            Income Transactions: {totalIncomeTransactions}
          </p>
          <p className="text-red-500">
            Expense Transactions: {totalExpenseTransactions}
          </p>

          {/* Progress Bars for Income and Expenses */}
          <div className="flex flex-col md:flex-row justify-center space-x-0 md:space-x-4 my-6">
            {/* Income Progress Bar */}
            <div className="relative mb-4 md:mb-0 w-full md:w-48">
              <svg
                width="150"
                height="150"
                className="transform -rotate-90 mx-auto"
              >
                <circle
                  cx="75"
                  cy="75"
                  r="60"
                  stroke="#e6e6e6"
                  strokeWidth="15"
                  fill="none"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="60"
                  stroke="green"
                  strokeWidth="15"
                  fill="none"
                  strokeDasharray={`${
                    (totalIncomeTransactions / totalTransaction) * 100
                  } ${
                    100 - (totalIncomeTransactions / totalTransaction) * 100
                  }`}
                  style={{ transition: "stroke-dasharray 0.5s ease-in-out" }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <h3 className="text-2xl font-bold text-green-600">
                  {totalIncomeTransactions > 0
                    ? (
                        (totalIncomeTransactions / totalTransaction) *
                        100
                      ).toFixed(2)
                    : 0}
                  %
                </h3>
                <span className="text-sm text-gray-500">Income</span>
              </div>
            </div>

            {/* Expense Progress Bar */}
            <div className="relative mb-4 md:mb-0 w-full md:w-48">
              <svg
                width="150"
                height="150"
                className="transform -rotate-90 mx-auto"
              >
                <circle
                  cx="75"
                  cy="75"
                  r="60"
                  stroke="#e6e6e6"
                  strokeWidth="15"
                  fill="none"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="60"
                  stroke="red"
                  strokeWidth="15"
                  fill="none"
                  strokeDasharray={`${
                    (totalExpenseTransactions / totalTransaction) * 100
                  } ${
                    100 - (totalExpenseTransactions / totalTransaction) * 100
                  }`}
                  style={{ transition: "stroke-dasharray 0.5s ease-in-out" }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <h3 className="text-2xl font-bold text-red-600">
                  {totalExpenseTransactions > 0
                    ? (
                        (totalExpenseTransactions / totalTransaction) *
                        100
                      ).toFixed(2)
                    : 0}
                  %
                </h3>
                <span className="text-sm text-gray-500">Expenses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Turnover Summary */}
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md w-full max-w-xl">
          <h3 className="text-xl font-semibold ">Total Turnover</h3>
          <p className=" bg-gray-100 dark:bg-gray-700">
            Total Turnover: ₹{totalTurnover.toFixed(2)}
          </p>
          <p className="text-green-500">
            Income Turnover: ₹{totalIncomeTurnover.toFixed(2)}
          </p>
          <p className="text-red-500">
            Expense Turnover: ₹{totalExpenseTurnover.toFixed(2)}
          </p>

          {/* Progress Bars for Income and Expenses Turnover */}
          <div className="flex flex-col md:flex-row justify-center space-x-0 md:space-x-4 my-6">
            {/* Income Turnover Progress Bar */}
            <div className="relative mb-4 md:mb-0 w-full md:w-48">
              <svg
                width="150"
                height="150"
                className="transform -rotate-90 mx-auto"
              >
                <circle
                  cx="75"
                  cy="75"
                  r="60"
                  stroke="#e6e6e6"
                  strokeWidth="15"
                  fill="none"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="60"
                  stroke="green"
                  strokeWidth="15"
                  fill="none"
                  strokeDasharray={`${
                    (totalIncomeTurnover / totalTurnover) * 100
                  } ${100 - (totalIncomeTurnover / totalTurnover) * 100}`}
                  style={{ transition: "stroke-dasharray 0.5s ease-in-out" }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <h3 className="text-2xl font-bold text-green-600">
                  {totalIncomeTurnover > 0
                    ? ((totalIncomeTurnover / totalTurnover) * 100).toFixed(2)
                    : 0}
                  %
                </h3>
                <span className="text-sm text-gray-500">Income</span>
              </div>
            </div>

            {/* Expense Turnover Progress Bar */}
            <div className="relative mb-4 md:mb-0 w-full md:w-48">
              <svg
                width="150"
                height="150"
                className="transform -rotate-90 mx-auto"
              >
                <circle
                  cx="75"
                  cy="75"
                  r="60"
                  stroke="#e6e6e6"
                  strokeWidth="15"
                  fill="none"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="60"
                  stroke="red"
                  strokeWidth="15"
                  fill="none"
                  strokeDasharray={`${
                    (totalExpenseTurnover / totalTurnover) * 100
                  } ${100 - (totalExpenseTurnover / totalTurnover) * 100}`}
                  style={{ transition: "stroke-dasharray 0.5s ease-in-out" }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <h3 className="text-2xl font-bold text-red-600">
                  {totalExpenseTurnover > 0
                    ? ((totalExpenseTurnover / totalTurnover) * 100).toFixed(2)
                    : 0}
                  %
                </h3>
                <span className="text-sm text-gray-500">Expenses</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category-wise Breakdown */}
      <div className="mt-6 w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-4">Category-wise Breakdown</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expense Categories */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-red-600">
              Expense Categories
            </h4>
            <ul>
              {Object.entries(expenseCategories).map(([category, amount]) => (
                <li
                  key={category}
                  className="flex justify-between p-2 border-b border-gray-300"
                >
                  <span>{category}</span>
                  <span>₹{amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Income Categories */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-green-600">
              Income Categories
            </h4>
            <ul>
              {Object.entries(incomeCategories).map(([category, amount]) => (
                <li
                  key={category}
                  className="flex justify-between p-2 border-b border-gray-300"
                >
                  <span>{category}</span>
                  <span>₹{amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseChart;
