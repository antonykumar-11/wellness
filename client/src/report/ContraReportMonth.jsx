import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetContraVouchersQuery } from "../store/api/ContraVoucherApi";

const ContraReportMonth = () => {
  const { month } = useParams();
  const navigate = useNavigate();
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data using the query hook
  const {
    data: vouchers,
    isLoading,
    isError,
    refetch,
  } = useGetContraVouchersQuery();
  useEffect(() => {
    refetch();
  }, [refetch]);
  // Effect to filter transactions by the selected month
  useEffect(() => {
    if (vouchers) {
      const transactionsForMonth = vouchers.filter((voucher) => {
        const voucherDate = new Date(voucher.date);
        const voucherMonth = voucherDate.toLocaleString("default", {
          month: "long",
        });
        const voucherYear = voucherDate.getFullYear();
        const formattedVoucherMonthYear = `${voucherMonth} ${voucherYear}`;

        return formattedVoucherMonthYear === month;
      });
      setDailyTransactions(transactionsForMonth);
    }
  }, [vouchers, month]);

  const handleDetailClick = (id) => {
    navigate(`/details/${id}`);
  };

  const handleMainClick = (id) => {
    navigate(`/reports/contrareports/${id}`);
  };

  // Filter transactions based on search query
  const filteredTransactions = dailyTransactions.filter((transaction) => {
    return (
      transaction.voucherType
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.voucherNumber?.toString().includes(searchQuery)
    );
  });

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (isError)
    return <div className="text-center p-4">Error fetching transactions</div>;

  return (
    <div className="p-4">
      <div className="text-gray-900 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Voucher Type or Voucher Number"
          className="mb-4 p-2 border border-gray-300 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Transactions for {month}</h2>

      <div className="overflow-x-auto">
        {filteredTransactions.length > 0 ? (
          <>
            {/* Table layout for larger screens */}
            <div className="hidden lg:block">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-center">
                      Date
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Voucher Number
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Voucher Type
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Description
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Debit Ledger
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Debit Amount
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Credit Ledger
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Credit Amount
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Total Debit
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Total Credit
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => {
                    const totalDebit = transaction.debitLedgers
                      .reduce((acc, ledger) => acc + (ledger.amount || 0), 0)
                      .toFixed(2);
                    const totalCredit = transaction.creditLedgers
                      .reduce((acc, ledger) => acc + (ledger.amount || 0), 0)
                      .toFixed(2);

                    return (
                      <tr
                        key={transaction._id}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
                      >
                        <td className="p-2 text-center">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="p-2 text-center">
                          {transaction.voucherNumber || "N/A"}
                        </td>
                        <td className="p-2 text-center">
                          {transaction.voucherType}
                        </td>
                        <td className="p-2 text-center">
                          {transaction.description || "N/A"}
                        </td>
                        <td className="p-2 text-center">
                          {transaction.debitLedgers
                            .map((ledger) => ledger.ledgerName)
                            .join(", ") || "N/A"}
                        </td>
                        <td className="p-2 text-center">
                          {transaction.debitLedgers
                            .map((ledger) => ledger.amount)
                            .join(", ") || "N/A"}
                        </td>
                        <td className="p-2 text-center">
                          {transaction.creditLedgers
                            .map((ledger) => ledger.ledgerName)
                            .join(", ") || "N/A"}
                        </td>
                        <td className="p-2 text-center">
                          {transaction.creditLedgers
                            .map((ledger) => ledger.amount)
                            .join(", ") || "N/A"}
                        </td>
                        <td className="p-2 text-center">{totalDebit}</td>
                        <td className="p-2 text-center">{totalCredit}</td>
                        <td className="p-2 text-center">
                          <button
                            className="mr-2 text-blue-600"
                            onClick={() => handleDetailClick(transaction._id)}
                          >
                            Detail
                          </button>
                          <button
                            className="text-red-600"
                            onClick={() => handleMainClick(transaction._id)}
                          >
                            Voucher
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Card layout for smaller screens */}
            <div className="block lg:hidden">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="border border-gray-300 p-4 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <div className="flex justify-between mb-2">
                    <span>Date:</span>
                    <span>
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span>V/N:</span>
                    <span>{transaction.voucherNumber || "N/A"}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>P/V:</span>
                    <span>{transaction.voucherType}</span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span>Description:</span>
                    <span>{transaction.description || "N/A"}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>(₹) Debit:</span>
                    <span>
                      {transaction.debitLedgers
                        .reduce((acc, ledger) => acc + (ledger.amount || 0), 0)
                        .toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>(₹) Credit:</span>
                    <span>
                      {transaction.creditLedgers
                        .reduce((acc, ledger) => acc + (ledger.amount || 0), 0)
                        .toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="mr-2 text-blue-600"
                      onClick={() => handleDetailClick(transaction._id)}
                    >
                      Detail
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleMainClick(transaction._id)}
                    >
                      Voucher
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">No transactions found.</div>
        )}
      </div>
    </div>
  );
};

export default ContraReportMonth;
