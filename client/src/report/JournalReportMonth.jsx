import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAllJournalVouchersQuery } from "../store/api/journalVoucherApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faEye } from "@fortawesome/free-solid-svg-icons";

const JournalReportMonth = () => {
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

  const {
    data: vouchers,
    isLoading,
    isError,
    refetch,
  } = useGetAllJournalVouchersQuery();

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

  const handleMainClick = (id) => navigate(`/reports/jornalreports/${id}`);

  const handlePrint = () => {
    setPrintData({
      selectedDate,
      totalDebit: selectedDate ? totalDebitForDay : totalDebitForMonth,
      totalCredit: selectedDate ? totalCreditForDay : totalCreditForMonth,
      transactions: dailyTransactions,
    });
    setTimeout(() => {
      window.print();
      setPrintData(null);
    }, 500);
  };

  const filteredTransactions = dailyTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date).toLocaleDateString();
    const formattedSelectedDate = new Date(selectedDate).toLocaleDateString();

    return (
      (transaction.voucherType
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        transaction.voucherNumber?.toString().includes(searchQuery)) &&
      (!selectedDate || transactionDate === formattedSelectedDate)
    );
  });

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (isError)
    return <div className="text-center p-4">Error fetching transactions</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Journal Voucher Transactions for {month}
      </h2>
      <div className="flex">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 mb-2 w-full placeholder-gray-400 dark:placeholder-gray-300"
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
                      <td className="border border-gray-300 p-1 text-center">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        {transaction.voucherNumber || "N/A"}
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        {transaction.description || "N/A"}
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        {transaction.debitLedgers
                          .map((ledger) => ledger.ledgerName)
                          .join(", ") || "N/A"}
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        {transaction.debitLedgers
                          .reduce(
                            (total, ledger) => total + (ledger.amount || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        {transaction.creditLedgers
                          .map((ledger) => ledger.ledgerName)
                          .join(", ") || "N/A"}
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        {transaction.creditLedgers
                          .reduce(
                            (total, ledger) => total + (ledger.amount || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        <button onClick={handlePrint} className="text-blue-600">
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

            <div className="block lg:hidden">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="border border-gray-300 p-4 mb-4 bg-white"
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
                  <button onClick={handlePrint} className="mr-2 text-blue-600">
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
                <div className="flex flex-col items-end bg-gray-100 p-4 rounded shadow-md">
                  <h3 className="font-semibold text-lg">
                    Monthly Totals for {month}
                  </h3>
                  <div className="text-green-600">
                    <span>Total Debit:</span>
                    <span className="font-bold"> ₹{totalDebitForMonth}</span>
                  </div>
                  <div className="text-red-600">
                    <span>Total Credit:</span>
                    <span className="font-bold"> ₹{totalCreditForMonth}</span>
                  </div>
                </div>
              )}

              {/* Daily Totals Display */}
              {selectedDate && (
                <div className="flex flex-col items-end bg-gray-100 p-4 rounded shadow-md">
                  <h3 className="font-semibold text-lg">
                    Daily Totals for{" "}
                    {new Date(selectedDate).toLocaleDateString()}
                  </h3>
                  <div className="text-green-600">
                    <span>Total Debit:</span>
                    <span className="font-bold"> ₹{totalDebitForDay}</span>
                  </div>
                  <div className="text-red-600">
                    <span>Total Credit:</span>
                    <span className="font-bold"> ₹{totalCreditForDay}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center">No transactions found.</div>
        )}

        {printData && (
          <div className="print-only">
            <div className="text-center mb-4">
              <h1 className="font-bold text-2xl">ALPHA CRANE SERVICE</h1>
              <p className="semi-bold text-1xl">VIZHINJAM PORT</p>
              <p className="semi-bold text-1xl">
                THIRUVANANTHAPURAM, KERALA, INDIA
              </p>
              <p className="semi-bold text-1xl">
                EMAIL: alphacranesalpha@gmail.com
              </p>
              <p className="semi-bold text-1xl">GST NO: 32HPZPS9891L1ZB</p>
            </div>
            <h2 className="text-center mb-2">
              Journal Transactions for {month}
            </h2>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-1 text-center">
                    Date
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    Voucher Number
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    Description
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    Debit Ledger
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    Debit Amount
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    Credit Ledger
                  </th>
                  <th className="border border-gray-300 p-1 text-center">
                    Credit Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="border border-gray-400">
                    <td className="border border-gray-300 p-1 text-center">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-1 text-center">
                      {transaction.voucherNumber || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-1 text-center">
                      {transaction.description || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-1 text-center">
                      {transaction.debitLedgers
                        .map((ledger) => ledger.ledgerName)
                        .join(", ") || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-1 text-center">
                      {transaction.debitLedgers
                        .reduce(
                          (total, ledger) => total + (ledger.amount || 0),
                          0
                        )
                        .toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-1 text-center">
                      {transaction.creditLedgers
                        .map((ledger) => ledger.ledgerName)
                        .join(", ") || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-1 text-center">
                      {transaction.creditLedgers
                        .reduce(
                          (total, ledger) => total + (ledger.amount || 0),
                          0
                        )
                        .toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-col items-end mt-4 bg-gray-100 p-4 rounded shadow-md">
              <div className="flex flex-col items-end  w-full">
                <div className="text-green-600">
                  <span>Total Debit:</span>
                  <span className="font-bold">
                    {" "}
                    ₹{selectedDate ? totalDebitForDay : totalDebitForMonth}
                  </span>
                </div>
                <div className="text-red-600">
                  <span>Total Credit:</span>
                  <span className="font-bold">
                    {" "}
                    ₹{selectedDate ? totalCreditForDay : totalCreditForMonth}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalReportMonth;
