import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCreditNotesQuery } from "../store/api/CreditNoteApi";

const CreditNoteMonthReport = () => {
  const { month } = useParams();
  const navigate = useNavigate();
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [dailySummary, setDailySummary] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [purchaseData, setPurchaseData] = useState({
    thisPurchase: "New bill",
  });

  const {
    data: purchase,
    isLoading,
    isError,
    refetch,
  } = useGetCreditNotesQuery(purchaseData.thisPurchase, {
    skip: !purchaseData.thisPurchase,
  });
  useEffect(() => {
    refetch();
  }, [refetch]);
  useEffect(() => {
    if (purchase) {
      const transactionsForMonth = purchase.filter((voucher) => {
        const voucherDate = new Date(voucher.transactionDate);
        const monthYear = voucherDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
        return monthYear === month;
      });
      setDailyTransactions(transactionsForMonth);
    }
  }, [purchase, month]);

  useEffect(() => {
    const summary = {};
    let runningBalance = 0;

    const sortedTransactions = dailyTransactions.sort(
      (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate)
    );

    sortedTransactions.forEach((transaction) => {
      const transactionDate = new Date(
        transaction.transactionDate
      ).toLocaleDateString();

      const totalDebit = transaction.debitLedgers
        ? transaction.debitLedgers.reduce(
            (acc, ledger) => acc + (ledger.amount || 0),
            0
          )
        : 0;

      if (!summary[transactionDate]) {
        summary[transactionDate] = { totalDebit: 0, closingBalance: 0 };
      }

      summary[transactionDate].totalDebit += totalDebit;
      runningBalance += totalDebit;
      summary[transactionDate].closingBalance = runningBalance;
    });

    setDailySummary(summary);
  }, [dailyTransactions]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Unsettled":
        return "text-red-200";
      case "Partially Settled":
        return "text-blue-200";
      case "Settled":
        return "text-green-200";
      default:
        return "text-gray-200";
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (isError)
    return <div className="text-center p-4">Error fetching transactions</div>;

  const handleDetailClick = (id) => {
    navigate(`/details/${id}`);
  };

  const handleMainClick = (id) => {
    console.log("id", id); // Logs the ID to the console for debugging purposes
    navigate(`/reports/creditnotes/${id}`);
  };

  const filteredTransactions = dailyTransactions.filter((transaction) => {
    return (
      transaction.purposeOfPayment
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.voucherNumber?.toString().includes(searchQuery)
    );
  });

  return (
    <div className="p-4">
      <div className="text-gray-900 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Purpose, Status, or Voucher Number"
          className="mb-4 p-2 border border-gray-300 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">
        Purchase Return for {month}
      </h2>

      <div className="overflow-x-auto">
        {filteredTransactions.length > 0 ? (
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
                      Status
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      P/V
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      V/N
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      (₹) Debit
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      (₹) Credit
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      (₹) Closing balance
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
                    >
                      <td className="p-2 text-center">
                        {new Date(
                          transaction.transactionDate
                        ).toLocaleDateString()}
                      </td>
                      <td
                        className={`p-2 text-center ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </td>
                      <td className="p-2 text-center">
                        {transaction.purposeOfPayment || "N/A"}
                      </td>
                      <td className="p-2 text-center">
                        {transaction.voucherNumber || "N/A"}
                      </td>
                      <td className="p-2 text-center"></td>
                      <td className="p-2 text-center">
                        {transaction.debitLedgers
                          .reduce(
                            (acc, ledger) => acc + (ledger.amount || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        {dailySummary[
                          new Date(
                            transaction.transactionDate
                          ).toLocaleDateString()
                        ]
                          ? dailySummary[
                              new Date(
                                transaction.transactionDate
                              ).toLocaleDateString()
                            ].closingBalance.toFixed(2)
                          : "N/A"}
                      </td>
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
                  ))}
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
                      {new Date(
                        transaction.transactionDate
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span>Status:</span>
                    <span className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>V/N:</span>
                    <span>{transaction.voucherNumber || "N/A"}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>P/V:</span>
                    <span>{transaction.purposeOfPayment || "N/A"}</span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span>(₹)Debit</span>
                    <span>{transaction.category}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>(₹)Credit</span>
                    <span>
                      {" "}
                      {transaction.debitLedgers
                        .reduce((acc, ledger) => acc + (ledger.amount || 0), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>(₹) Closing Balance:</span>
                    <span>
                      {dailySummary[
                        new Date(
                          transaction.transactionDate
                        ).toLocaleDateString()
                      ]
                        ? dailySummary[
                            new Date(
                              transaction.transactionDate
                            ).toLocaleDateString()
                          ].closingBalance.toFixed(2)
                        : "N/A"}
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

export default CreditNoteMonthReport;
