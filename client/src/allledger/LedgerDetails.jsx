import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetExpenseByIdQuery } from "../store/api/ExpenseExpenseApi";

const LedgerDetails = () => {
  const { ledgerId } = useParams(); // Get the ledger ID from the URL
  console.log("id", ledgerId);
  const {
    data: { transactions = [], ledgers = [] } = {},
    error,
    isLoading,
  } = useGetExpenseByIdQuery(ledgerId);

  const [ledger, setLedger] = useState(null);
  console.log("ransaction", transactions);
  console.log("ledger", ledgers);
  useEffect(() => {
    if (ledgers.length > 0 && transactions.length > 0) {
      const ledgerData = ledgers.find((ledger) => ledger._id === id);
      if (ledgerData) {
        const ledgerMap = {
          [ledgerData._id]: {
            name: ledgerData.name || "",
            openingBalance: ledgerData.openingBalance || 0,
            totalDebit: 0,
            totalCredit: 0,
            closingBalance: ledgerData.openingBalance || 0,
            entries: [],
          },
        };

        transactions.forEach((transaction) => {
          const {
            paymentDate: date,
            debitLedger: debitLedgerId,
            debitLedgerName,
            debitAmount,
            creditLedger: creditLedgerId,
            creditLedgerName,
            creditAmount,
          } = transaction;

          const formattedDebitAmount =
            typeof debitAmount === "number" ? debitAmount : 0;
          const formattedCreditAmount =
            typeof creditAmount === "number" ? creditAmount : 0;

          if (debitLedgerId === ledgerId) {
            ledgerMap[ledgerId].totalDebit += formattedDebitAmount;
            ledgerMap[ledgerId].entries.push({
              date: date ? new Date(date).toLocaleDateString() : "",
              description: creditLedgerName,
              debit: formattedDebitAmount,
              credit: 0,
            });
          }

          if (creditLedgerId === ledgerId) {
            ledgerMap[ledgerId].totalCredit += formattedCreditAmount;
            ledgerMap[ledgerId].entries.push({
              date: date ? new Date(date).toLocaleDateString() : "",
              description: debitLedgerName,
              debit: 0,
              credit: formattedCreditAmount,
            });
          }
        });

        ledgerMap[ledgerId].closingBalance =
          ledgerMap[ledgerId].openingBalance +
          ledgerMap[ledgerId].totalDebit -
          ledgerMap[ledgerId].totalCredit;

        setLedger(ledgerMap[ledgerId]);
      }
    }
  }, [ledgerId, transactions, ledgers]);

  if (!ledger) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Ledger Details</h1>
      <div className="bg-white shadow-md rounded-lg w-full max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold p-4 bg-blue-500 text-white">
          {ledger.name}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="bg-gray-50">
                <td colSpan="2" className="px-4 py-2 text-right font-semibold">
                  Opening Balance
                </td>
                <td className="px-4 py-2 text-right font-semibold">
                  {ledger.openingBalance.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right font-semibold">0.00</td>
              </tr>
              {ledger.entries.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    No entries available
                  </td>
                </tr>
              ) : (
                ledger.entries.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {entry.date}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {entry.description}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">
                      {entry.debit.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">
                      {entry.credit.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
              <tr className="bg-gray-50">
                <td colSpan="2" className="px-4 py-2 text-right font-semibold">
                  Total
                </td>
                <td className="px-4 py-2 text-right font-semibold">
                  {ledger.totalDebit.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right font-semibold">
                  {ledger.totalCredit.toFixed(2)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td colSpan="2" className="px-4 py-2 text-right font-semibold">
                  Closing Balance
                </td>
                <td colSpan="2" className="px-4 py-2 text-right font-semibold">
                  {ledger.closingBalance.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LedgerDetails;
