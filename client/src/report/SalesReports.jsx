import React, { useMemo, useEffect } from "react";
import { useGetSalesVouchersQuery } from "../store/api/SalesApi";
import { useNavigate } from "react-router-dom";

// Function to get the "Month Year" from the transactionDate
const getMonthYear = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid Date"; // Handle invalid date

  const options = { year: "numeric", month: "long" }; // e.g., "September 2024"
  return date.toLocaleDateString("en-US", options);
};

const SalesReport = () => {
  const [purchaseData, setPurchaseData] = React.useState({
    thisPurchase: "New bill", // Initial value matching dropdown
  });

  const {
    data: purchase,
    isLoading,
    isError,
    refetch,
  } = useGetSalesVouchersQuery();
  useEffect(() => {
    refetch();
  }, [refetch]);
  const navigate = useNavigate();

  // Memoized summary of debits month-wise and closing balance
  const monthSummary = useMemo(() => {
    if (!purchase) return {}; // Return empty if purchase is undefined or null

    const summary = purchase.reduce((acc, voucher) => {
      const monthYear = getMonthYear(voucher.transactionDate); // Use the transactionDate
      const { debitLedgers } = voucher;

      // Initialize the month if not already present in acc
      if (!acc[monthYear]) {
        acc[monthYear] = { totalDebit: 0, closingBalance: 0 };
      }

      // Add all debit amounts for the current month
      debitLedgers.forEach((ledger) => {
        acc[monthYear].totalDebit += ledger.amount || 0;
      });

      return acc;
    }, {});

    // Calculate the closing balance by accumulating month-to-month
    let previousClosingBalance = 0;
    Object.keys(summary).forEach((month) => {
      summary[month].closingBalance =
        previousClosingBalance + summary[month].totalDebit;
      previousClosingBalance = summary[month].closingBalance;
    });

    return summary;
  }, [purchase]);

  // Function to handle row clicks and navigate to detailed month report
  const handleAccountClick = (month) => {
    navigate(`/reports/salesreport/${month}`);
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (isError)
    return <div className="text-center p-4">Error fetching purchase data</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 transition duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
        Sales Register
      </h2>

      <div className="block md:hidden grid grid-cols-1 gap-4">
        {/* Mobile View as Cards */}
        {Object.keys(monthSummary).length > 0 ? (
          Object.keys(monthSummary).map((month) => (
            <div
              key={month}
              onClick={() => handleAccountClick(month)}
              className="cursor-pointer hover:shadow-lg transform transition-all bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 p-4"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {month}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Total Debit (₹): {monthSummary[month].totalDebit.toFixed(2)}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Closing Balance (₹):{" "}
                {monthSummary[month].closingBalance.toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-600 dark:text-gray-300">
            No data available
          </div>
        )}
      </div>

      <div className="hidden md:block">
        {/* Desktop View as Table */}
        <table className="min-w-full bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-600">
              <th className="px-4 py-2 text-center text-gray-600 dark:text-gray-300 text-sm md:text-base">
                Month
              </th>
              <th className="px-4 py-2 text-center text-gray-600 dark:text-gray-300 text-sm md:text-base">
                Total Debit (₹)
              </th>
              <th className="px-4 py-2 text-center text-gray-600 dark:text-gray-300 text-sm md:text-base">
                Closing Balance (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(monthSummary).length > 0 ? (
              Object.keys(monthSummary).map((month) => (
                <tr
                  key={month}
                  onClick={() => handleAccountClick(month)}
                  className="cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-600 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 transition duration-150"
                >
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                    <div className="flex items-center justify-center">
                      {month}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300 text-right text-sm md:text-base">
                    <div className="flex items-center justify-end">
                      {monthSummary[month].totalDebit.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300 text-right text-sm md:text-base">
                    <div className="flex items-center justify-end">
                      {monthSummary[month].closingBalance.toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-4 text-gray-600 dark:text-gray-300"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
