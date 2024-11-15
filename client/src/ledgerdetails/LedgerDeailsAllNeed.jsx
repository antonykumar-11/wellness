import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";

const GroupDetails = () => {
  const { group } = useParams(); // Get the group from the URL params
  console.log("goup", group);
  const { data: { transactions = [], ledgers = [] } = {} } =
    useGetExpensesQuery();
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (transactions.length > 0 && ledgers.length > 0) {
      const ledgerMap = {};
      ledgers.forEach((ledger) => {
        ledgerMap[ledger._id] = {
          name: ledger.name || "",
          group: ledger.group || "",
          openingBalance: ledger.openingBalance || 0,
          totalDebit: 0,
          totalCredit: 0,
          closingBalance: ledger.openingBalance || 0,
          entries: [],
        };
      });

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

        if (ledgerMap[debitLedgerId]) {
          ledgerMap[debitLedgerId].totalDebit += formattedDebitAmount;
          ledgerMap[debitLedgerId].entries.push({
            date: date ? new Date(date).toLocaleDateString() : "",
            description: creditLedgerName,
            debit: formattedDebitAmount,
            credit: 0,
          });
        }

        if (ledgerMap[creditLedgerId]) {
          ledgerMap[creditLedgerId].totalCredit += formattedCreditAmount;
          ledgerMap[creditLedgerId].entries.push({
            date: date ? new Date(date).toLocaleDateString() : "",
            description: debitLedgerName,
            debit: 0,
            credit: formattedCreditAmount,
          });
        }
      });

      Object.keys(ledgerMap).forEach((ledgerId) => {
        const ledger = ledgerMap[ledgerId];
        ledger.closingBalance =
          ledger.openingBalance + ledger.totalDebit - ledger.totalCredit;
      });

      // Filter ledgers for the selected group
      const groupDetails = ledgers
        .filter((ledger) => ledger.group === group)
        .map((ledger) => ({
          ...ledgerMap[ledger._id],
          name: ledger.name,
        }));

      setDetails(groupDetails);
    }
  }, [transactions, ledgers, group]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Group Details: {group}
      </h1>
      <div className="overflow-x-auto">
        {details.length > 0 ? (
          details.map((ledger) => (
            <div
              key={ledger.name}
              className="bg-white shadow-md rounded-lg w-full max-w-xl mb-4"
            >
              <h2 className="text-2xl font-semibold p-4 bg-blue-500 text-white">
                {ledger.name}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Opening Balance
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Debit
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Credit
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Closing Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 text-right font-semibold">
                        {ledger.openingBalance.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {ledger.totalDebit.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {ledger.totalCredit.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {ledger.closingBalance.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">Entries</h3>
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
                      {ledger.entries.map((entry, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-left">{entry.date}</td>
                          <td className="px-4 py-2 text-left">
                            {entry.description}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {entry.debit.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {entry.credit.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No details available for this group.</p>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;
