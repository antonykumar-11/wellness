import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useCheckVoucherNumbersQuery } from "../store/api/PurchaseApi";

const DailyTransactionReport = () => {
  const { monthName } = useParams();
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
  } = useCheckVoucherNumbersQuery(purchaseData.thisPurchase, {
    skip: !purchaseData.thisPurchase,
  });

  useEffect(() => {
    if (purchase) {
      const transactionsForMonth = purchase.filter((voucher) => {
        const voucherDate = new Date(voucher.transactionDate);
        const monthYear = voucherDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });

        return monthYear === monthName;
      });
      setDailyTransactions(transactionsForMonth);
    }
  }, [purchase, monthName]);

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

      const transactionTotal = transaction.total || 0;

      if (!summary[transactionDate]) {
        summary[transactionDate] = { totalDebit: 0, closingBalance: 0 };
      }

      summary[transactionDate].totalDebit += totalDebit;
      runningBalance += transactionTotal;
      summary[transactionDate].closingBalance = runningBalance;
    });

    setDailySummary(summary);
  }, [dailyTransactions]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Unsettled":
        return "text-red-400";
      case "Partially Settled":
        return "text-blue-400";
      case "Settled":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (isError)
    return <div className="text-center p-4">Error fetching transactions</div>;

  const handleDetailClick = (id) => {
    navigate(`/details/${id}`);
  };

  const handleMainClick = (id) => {
    navigate(`/reports/purchasereports/${id}`);
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

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const title = `Transactions for ${monthName}`;
    const padding = 10;
    const titleWidhth = doc.getTextWidth(title);
    const center = doc.internal.pageSize.width / 2 - titleWidhth / 2;
    doc.text(title, center, padding);

    const tableColumn = [
      "Date",
      "Status",
      "P/N",
      "Subtotal",
      "Tax Amount",
      "Stock Groups", // New column for stock group names
      "Credit Amount",
      "Credit Due Date",
      "Closing Balance",
    ];

    const tableRows = [];

    filteredTransactions.forEach((transaction) => {
      // Map data for each row
      const rowData = [
        new Date(transaction.transactionDate).toLocaleDateString(), // Date
        transaction.status, // Status
        transaction.purposeOfPayment || "N/A", // P/N
        transaction.subTotal?.toFixed() || "N/A", // Subtotal
        transaction.taxAmount?.toFixed() || "N/A", // Tax Amount
        transaction.items.map((item) => item.stockGroupName).join(", ") ||
          "N/A", // Stock Groups
        transaction.creditAmount?.toFixed() || "N/A", // Credit Amount
        transaction.creditDueDate // Credit Due Date
          ? new Date(transaction.creditDueDate).toLocaleDateString()
          : "N/A",
        dailySummary[
          new Date(transaction.transactionDate).toLocaleDateString()
        ]?.closingBalance.toFixed() || "N/A", // Closing Balance
      ];

      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      columnStyles: {
        0: { cellWidht: 10 },
        1: { cellWidht: 20 },
        2: { cellWidht: 30 },
        3: { cellWidht: 30 },
        4: { cellWidht: 30 },
        5: { cellWidht: 40 },
        6: { cellWidht: 40 },
        7: { cellWidht: 30 },
        8: { cellWidht: 30 },
      },
      theme: "grid",
    });

    doc.save(`Transactions_${monthName}.pdf`);
  };

  return (
    <div className="p-4">
      {/* Add button to generate PDF */}
      <button
        onClick={generatePDF}
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
      >
        Generate PDF
      </button>

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
        Transactions for {monthName}
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
                      Subtotal
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Tax Amount
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Total
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      items
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Credit Amount
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Credit Due Date
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
                      <td className="p-2 text-center">
                        {transaction.subTotal
                          ? transaction.subTotal.toFixed(2)
                          : "N/A"}
                      </td>
                      <td className="p-2 text-center">
                        {transaction.taxAmount
                          ? transaction.taxAmount.toFixed(2)
                          : "N/A"}
                      </td>
                      <td className="p-2 text-center">
                        {transaction.total
                          ? transaction.total.toFixed(2)
                          : "N/A"}
                      </td>
                      <td className="p-2 text-center">
                        {transaction.items.map((item, index) => (
                          <div key={index}>
                            <span>{item.stockGroupName}</span>{" "}
                            {/* Stock Group Name */}
                          </div>
                        ))}
                      </td>
                      <td className="p-2 text-center">
                        {transaction.creditAmount
                          ? transaction.creditAmount.toFixed(2)
                          : "N/A"}
                      </td>
                      <td className="p-2 text-center">
                        {transaction.creditDueDate
                          ? new Date(
                              transaction.creditDueDate
                            ).toLocaleDateString()
                          : "N/A"}
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
                  {/* 1 */}
                  <div className="flex justify-between mb-2">
                    <span>Date:</span>
                    <span>
                      {new Date(
                        transaction.transactionDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  {/* 2 */}
                  <div className="flex justify-between mb-2">
                    <span>Status:</span>
                    <span className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </span>
                  </div>
                  {/* 3 */}
                  <div className="flex justify-between mb-2">
                    <span>stockGroupName:</span>
                    <span>{transaction.items.stockGroupName || "N/A"}</span>
                  </div>
                  {/* 4 */}
                  <div className="flex justify-between mb-2">
                    <span>P/V:</span>
                    <span>{transaction.purposeOfPayment || "N/A"}</span>
                  </div>
                  {/* 5 */}
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                    {transaction.subTotal.toFixed(2) || "N/A"}
                  </td>
                  {/* 6 */}
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                    {transaction.taxAmount.toFixed(2) || "N/A"}
                  </td>
                  {/* 7 */}
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                    {transaction.total.toFixed(2) || "N/A"}
                  </td>
                  {/* 8 */}
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                    {transaction.authorizedBy.name || "N/A"}
                  </td>
                  {/* 9 */}
                  <div className="flex justify-between mb-2">
                    <span>(₹)Debit</span>
                    <span>{transaction.category || "N/A"}</span>
                  </div>
                  {/* 10 */}
                  <div className="flex justify-between mb-2">
                    <span>(₹)Credit</span>
                    <span>
                      {" "}
                      {transaction.debitLedgers
                        .reduce((acc, ledger) => acc + (ledger.amount || 0), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  {/* 11 */}
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
                  {/* 12*/}
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

export default DailyTransactionReport;
