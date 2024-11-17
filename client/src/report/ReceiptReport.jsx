import React, { useState, useMemo, useEffect } from "react";
import { useGetReceiptVouchersQuery } from "../store/api/RecieptVoucher";
import { useNavigate } from "react-router-dom";

// Function to get the "Month Year" from the date field
const getMonthYear = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid Date"; // Handle invalid date
  const options = { year: "numeric", month: "long" }; // e.g., "September 2024"
  return date.toLocaleDateString("en-US", options);
};

const ReceiptReport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: payments,
    isLoading,
    isError,
    refetch,
  } = useGetReceiptVouchersQuery();
  console.log("payments", payments);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const navigate = useNavigate();

  // Memoized summary of payments month-wise and closing balance
  const monthSummary = useMemo(() => {
    if (!payments) return {}; // Return empty if payments is undefined or null

    const summary = payments.reduce((acc, payment) => {
      const monthYear = getMonthYear(payment.date); // Use date instead of transactionDate
      if (monthYear === "Invalid Date") return acc; // Skip if date is invalid

      const { creditLedgers } = payment;

      // Initialize the month if not already present in acc
      if (!acc[monthYear]) {
        acc[monthYear] = { totalCredit: 0, closingBalance: 0 };
      }

      // Add all credit amounts for the current month
      creditLedgers.forEach((ledger) => {
        acc[monthYear].totalCredit += ledger.amount || 0;
      });

      return acc;
    }, {});

    // Calculate the closing balance by accumulating month-to-month
    let previousClosingBalance = 0;
    Object.keys(summary).forEach((month) => {
      summary[month].closingBalance =
        previousClosingBalance + summary[month].totalCredit;
      previousClosingBalance = summary[month].closingBalance;
    });

    return summary;
  }, [payments]);

  // Filter month summary based on search query
  const filteredMonthSummary = useMemo(() => {
    if (!searchQuery) return monthSummary;
    return Object.keys(monthSummary)
      .filter((month) =>
        month.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .reduce((acc, month) => {
        acc[month] = monthSummary[month];
        return acc;
      }, {});
  }, [monthSummary, searchQuery]);

  // Function to handle row clicks and navigate to detailed month report
  const handleAccountClick = (month) => {
    navigate(`/reports/receiptreport/${month}`);
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (isError)
    return <div className="text-center p-4">Error fetching payment data</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 transition duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
        Receipt Register
      </h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Month and Year (e.g., September 2024)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
        />
      </div>

      <div className="block md:hidden grid grid-cols-1 gap-4">
        {/* Mobile View as Cards */}
        {Object.keys(filteredMonthSummary).length > 0 ? (
          Object.keys(filteredMonthSummary).map((month) => (
            <div
              key={month}
              onClick={() => handleAccountClick(month)}
              className="cursor-pointer hover:shadow-lg transform transition-all bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 p-4"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {month}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Total Credit (₹):{" "}
                {filteredMonthSummary[month].totalCredit.toFixed(2)}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Closing Balance (₹):{" "}
                {filteredMonthSummary[month].closingBalance.toFixed(2)}
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
                Total Credit (₹)
              </th>
              <th className="px-4 py-2 text-center text-gray-600 dark:text-gray-300 text-sm md:text-base">
                Closing Balance (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(filteredMonthSummary).length > 0 ? (
              Object.keys(filteredMonthSummary).map((month) => (
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
                      {filteredMonthSummary[month].totalCredit.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300 text-right text-sm md:text-base">
                    <div className="flex items-center justify-end">
                      {filteredMonthSummary[month].closingBalance.toFixed(2)}
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

export default ReceiptReport;
