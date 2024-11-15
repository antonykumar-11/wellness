import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAllPaymasterVouchersQuery } from "../store/api/PayMasterApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faEye } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
const PayMasterReportMonth = () => {
  const { month } = useParams();
  const navigate = useNavigate();
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [totalDebitForMonth, setTotalDebitForMonth] = useState(0);
  const [totalCreditForMonth, setTotalCreditForMonth] = useState(0);
  const [totalDebitForDay, setTotalDebitForDay] = useState(0);
  const [totalCreditForDay, setTotalCreditForDay] = useState(0);
  const [printData, setPrintData] = useState(null);
  console.log("printData", printData);
  const {
    data: vouchers,
    isLoading,
    isError,
    refetch,
  } = useGetAllPaymasterVouchersQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (vouchers) {
      const transactionsForMonth = vouchers.filter((voucher) => {
        const voucherDate = new Date(voucher.date);
        const formattedMonth = voucherDate.toLocaleString("default", {
          month: "long",
        });
        const voucherYear = voucherDate.getFullYear();
        return `${formattedMonth} ${voucherYear}` === month;
      });

      setDailyTransactions(transactionsForMonth);
      calculateMonthlyTotals(transactionsForMonth);
    }
  }, [vouchers, month]);

  const calculateMonthlyTotals = (transactions) => {
    const totals = transactions.reduce(
      (acc, transaction) => {
        const monthlyDebit = transaction.debitLedgers.reduce(
          (total, ledger) => total + (ledger.amount || 0),
          0
        );
        const monthlyCredit = transaction.creditLedgers.reduce(
          (total, ledger) => total + (ledger.amount || 0),
          0
        );
        acc.totalDebit += monthlyDebit;
        acc.totalCredit += monthlyCredit;
        return acc;
      },
      { totalDebit: 0, totalCredit: 0 }
    );

    setTotalDebitForMonth(totals.totalDebit.toFixed(2));
    setTotalCreditForMonth(totals.totalCredit.toFixed(2));
  };

  useEffect(() => {
    if (selectedDate) {
      const totalForSelectedDate = dailyTransactions.filter((transaction) => {
        return (
          new Date(transaction.date).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString()
        );
      });

      const dailyTotals = totalForSelectedDate.reduce(
        (acc, transaction) => {
          const dailyDebit = transaction.debitLedgers.reduce(
            (total, ledger) => total + (ledger.amount || 0),
            0
          );
          const dailyCredit = transaction.creditLedgers.reduce(
            (total, ledger) => total + (ledger.amount || 0),
            0
          );
          acc.totalDebit += dailyDebit;
          acc.totalCredit += dailyCredit;
          return acc;
        },
        { totalDebit: 0, totalCredit: 0 }
      );

      setTotalDebitForDay(dailyTotals.totalDebit.toFixed(2));
      setTotalCreditForDay(dailyTotals.totalCredit.toFixed(2));
    } else {
      setTotalDebitForDay(0);
      setTotalCreditForDay(0);
    }
  }, [selectedDate, dailyTransactions]);

  const handleMainClick = (id) => navigate(`/staff/paymasterreports/${id}`);

  // Function to generate PDF

  const filteredTransactions = dailyTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date).toLocaleDateString();
    const formattedSelectedDate = new Date(selectedDate).toLocaleDateString();

    // Search by voucherType, voucherNumber, and description
    return (
      (transaction.voucherType
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        transaction.voucherNumber?.toString().includes(searchQuery) ||
        transaction.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())) &&
      (!selectedDate || transactionDate === formattedSelectedDate)
    );
  });

  // Calculate totals based on filtered transactions
  const calculateTotals = (transactions) => {
    const totals = transactions.reduce(
      (acc, transaction) => {
        const debit = transaction.debitLedgers.reduce(
          (total, ledger) => total + (ledger.amount || 0),
          0
        );
        const credit = transaction.creditLedgers.reduce(
          (total, ledger) => total + (ledger.amount || 0),
          0
        );
        acc.totalDebit += debit;
        acc.totalCredit += credit;
        return acc;
      },
      { totalDebit: 0, totalCredit: 0 }
    );

    return {
      totalDebit: totals.totalDebit.toFixed(2),
      totalCredit: totals.totalCredit.toFixed(2),
    };
  };

  // Totals for filtered transactions
  const {
    totalDebit: totalDebitForFiltered,
    totalCredit: totalCreditForFiltered,
  } = calculateTotals(filteredTransactions);
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`PayMaster Transactions for ${month}`, 14, 10);

    // Table Column Headings
    const tableColumn = [
      "Date",
      "Voucher Number",
      "Description",
      "Debit Ledger",
      "Debit Amount",
      "Credit Ledger",
      "Credit Amount",
    ];

    // Table Rows Data
    const tableRows = [];

    filteredTransactions.forEach((transaction) => {
      const debitLedgers = transaction.debitLedgers
        ? transaction.debitLedgers.map((ledger) => ledger.ledgerName).join(", ")
        : "N/A";

      const creditLedgers = transaction.creditLedgers
        ? transaction.creditLedgers
            .map((ledger) => ledger.ledgerName)
            .join(", ")
        : "N/A";

      const transactionData = [
        new Date(transaction.date).toLocaleDateString(),
        transaction.voucherNumber,
        transaction.description,
        debitLedgers, // Only ledger names for debit
        transaction.debitLedgers?.reduce(
          (sum, ledger) => sum + ledger.amount,
          0
        ) || "N/A", // Sum of debit amounts
        creditLedgers, // Only ledger names for credit
        transaction.creditLedgers?.reduce(
          (sum, ledger) => sum + ledger.amount,
          0
        ) || "N/A", // Sum of credit amounts
      ];

      tableRows.push(transactionData);
    });

    // Generate the table using autoTable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 8,
        cellPadding: 1,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        5: { cellWidth: "auto", cellPadding: 2 },
        6: { cellWidth: "auto" },
      },
      theme: "grid",
      didDrawCell: (data) => {
        const cell = data.cell;
        if (cell.raw && cell.raw.length > 15) {
          cell.styles.fontSize = 6;
        }
      },
    });

    // Calculate totals and display them in the PDF
    const startY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);

    // Monthly or Daily Totals
    doc.setFontSize(12); // Set font size for totals
    doc.setFont("helvetica", "bold"); // Set font style for better emphasis
    if (!selectedDate) {
      // Display monthly totals
      doc.setTextColor(34, 139, 34); // Green color for Debit
      doc.text(`Total Debit: ${totalDebitForFiltered}`, 14, startY + 10);
      doc.setTextColor(255, 0, 0); // Red color for Credit
      doc.text(`Total Credit: ${totalCreditForFiltered}`, 14, startY + 16);
    } else {
      // Display daily totals
      doc.text(
        `Daily Totals for ${new Date(selectedDate).toLocaleDateString()}`,
        14,
        startY
      );
      doc.setTextColor(34, 139, 34); // Green color for Debit
      doc.text(`Total Debit: ₹${totalDebitForFiltered}`, 14, startY + 10);
      doc.setTextColor(255, 0, 0); // Red color for Credit
      doc.text(`Total Credit: ₹${totalCreditForFiltered}`, 14, startY + 20);
    }

    // Save the PDF
    doc.save(`Transactions_${month}.pdf`);
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (isError)
    return <div className="text-center p-4">Error fetching transactions</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        PayMaster Transaction for {month}
      </h2>
      <div className="flex">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-700 p-2 mb-2 w-full placeholder-gray-400 dark:placeholder-gray-300"
          placeholder="Select a date"
        />
        <input
          type="text"
          placeholder="Search by date or voucher number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 mb-2 w-full placeholder-gray-400 dark:placeholder-gray-300"
        />
      </div>

      <div className="overflow-x-auto">
        {filteredTransactions.length > 0 ? (
          <>
            <div className="hidden lg:block">
              <table className="min-w-full border border-gray-300 dark:bg-gray-700 ">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-center dark:bg-gray-700 ">
                      Date
                    </th>
                    <th className="border border-gray-300 p-2 text-center dark:bg-gray-700 ">
                      Voucher Number
                    </th>
                    <th className="border border-gray-300 p-2 text-center dark:bg-gray-700 ">
                      Description
                    </th>
                    <th className="border border-gray-300 p-2 text-center dark:bg-gray-700 ">
                      Debit Ledger
                    </th>
                    <th className="border border-gray-300 p-2 text-center dark:bg-gray-700 ">
                      Debit Amount
                    </th>
                    <th className="border border-gray-300 p-2 text-center dark:bg-gray-700 ">
                      Credit Ledger
                    </th>
                    <th className="border border-gray-300 p-2 text-center dark:bg-gray-700 ">
                      Credit Amount
                    </th>
                    <th className="border border-gray-300 p-2 text-center dark:bg-gray-700 ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="border border-gray-400"
                    >
                      <td className="border border-gray-300 p-1 text-center dark:bg-gray-700 ">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 p-1 text-center dark:bg-gray-700 ">
                        {transaction.voucherNumber || "N/A"}
                      </td>
                      <td className="border border-gray-300 p-1 text-center dark:bg-gray-700 ">
                        {transaction.description || "N/A"}
                      </td>
                      <td className="border border-gray-300 p-1 text-center dark:bg-gray-700 ">
                        {transaction.debitLedgers
                          .map((ledger) => ledger.ledgerName)
                          .join(", ") || "N/A"}
                      </td>
                      <td className="border border-gray-300 p-1 text-center dark:bg-gray-700 ">
                        {transaction.debitLedgers
                          .reduce(
                            (total, ledger) => total + (ledger.amount || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-1 text-center dark:bg-gray-700 ">
                        {transaction.creditLedgers
                          .map((ledger) => ledger.ledgerName)
                          .join(", ") || "N/A"}
                      </td>
                      <td className="border border-gray-300 p-1 text-center dark:bg-gray-700 ">
                        {transaction.creditLedgers
                          .reduce(
                            (total, ledger) => total + (ledger.amount || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-1 text-center dark:bg-gray-700 ">
                        <button onClick={generatePDF} className="text-blue-600">
                          <FontAwesomeIcon icon={faPrint} className="mr-2" />
                        </button>
                        <button
                          onClick={() => handleMainClick(transaction._id)}
                          className="text-red-600"
                        >
                          <FontAwesomeIcon icon={faEye} className="ml-2" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="block lg:hidden dark:bg-gray-700 ">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="border border-gray-300 p-4 mb-4 bg-white dark:bg-gray-700 "
                >
                  <div>
                    Date: {new Date(transaction.date).toLocaleDateString()}
                  </div>
                  <div>V/N: {transaction.voucherNumber || "N/A"}</div>
                  <div>P/V: {transaction.voucherType}</div>
                  <div>Description: {transaction.description || "N/A"}</div>
                  <div>
                    (₹) Debit:{" "}
                    {transaction.debitLedgers
                      .reduce(
                        (total, ledger) => total + (ledger.amount || 0),
                        0
                      )
                      .toFixed(2) || "0.00"}
                  </div>
                  <div>
                    (₹) Credit:{" "}
                    {transaction.creditLedgers
                      .reduce(
                        (total, ledger) => total + (ledger.amount || 0),
                        0
                      )
                      .toFixed(2) || "0.00"}
                  </div>
                  <button onClick={generatePDF} className="mr-2 text-blue-600">
                    Detail
                  </button>

                  <button
                    onClick={() => handleMainClick(transaction._id)}
                    className="text-red-600"
                  >
                    Voucher
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 py-8">
              {/* Monthly Totals Display */}
              {!selectedDate && (
                <div className="flex flex-col items-end bg-gray-100 p-4 rounded dark:bg-gray-700  shadow-md">
                  <h3 className="font-semibold text- dark:bg-gray-700 ">
                    Totals for {month}
                  </h3>
                  <div className="text-green-600 dark:bg-gray-700 ">
                    <span>Total Debit:</span>
                    <span className="font-bold"> ₹{totalDebitForFiltered}</span>
                  </div>
                  <div className="text-red-600 dark:bg-gray-700 ">
                    <span>Total Credit:</span>
                    <span className="font-bold dark:bg-gray-700 ">
                      {" "}
                      ₹{totalCreditForFiltered}
                    </span>
                  </div>
                </div>
              )}

              {/* Daily Totals Display */}
              {selectedDate && (
                <div className="flex flex-col items-end bg-gray-100 p-4 rounded dark:bg-gray-700  shadow-md">
                  <h3 className="font-semibold text-lg dark:bg-gray-700 dark:text-white  ">
                    Daily Totals for{" "}
                    {new Date(selectedDate).toLocaleDateString()}
                  </h3>
                  <div className="text-green-600 dark:bg-gray-700 ">
                    <span>Total Debit:</span>
                    <span className="font-bold"> ₹{totalDebitForFiltered}</span>
                  </div>
                  <div className="text-red-600 dark:bg-gray-700 ">
                    <span className="dark:bg-gray-700 ">Total Credit:</span>
                    <span className="font-bold dark:bg-gray-700 ">
                      {" "}
                      ₹{totalCreditForFiltered}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center">No transactions found.</div>
        )}
      </div>
    </div>
  );
};

export default PayMasterReportMonth;
