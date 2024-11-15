import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";

const LedgerGroupsPage = () => {
  const { data, error, isLoading } = useGetExpensesQuery();
  const [groupTotals, setGroupTotals] = useState({});

  useEffect(() => {
    if (data) {
      const { ledgers, transactions } = data;
      const groupBalances = {};

      // Calculate balances for each group
      ledgers.forEach((ledger) => {
        if (!groupBalances[ledger.group]) {
          groupBalances[ledger.group] = 0;
        }
        groupBalances[ledger.group] +=
          ledger.nature === "Credit"
            ? -ledger.openingBalance
            : ledger.openingBalance;
      });

      transactions.forEach((transaction) => {
        const creditLedger = ledgers.find(
          (ledger) => ledger._id === transaction.creditLedger
        );
        const debitLedger = ledgers.find(
          (ledger) => ledger._id === transaction.debitLedger
        );

        if (creditLedger) {
          groupBalances[creditLedger.group] -= transaction.creditAmount;
        }
        if (debitLedger) {
          groupBalances[debitLedger.group] += transaction.debitAmount;
        }
      });

      setGroupTotals(groupBalances);
    }
  }, [data]);

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (error)
    return (
      <p className="p-6 text-red-500">Error fetching data: {error.message}</p>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Ledger Groups</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.keys(groupTotals).length > 0 ? (
          Object.keys(groupTotals).map((group) => (
            <div
              key={group}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-md"
            >
              <h2 className="text-lg font-semibold mb-2">
                <Link
                  to={`/manu/ledgerdetails/${encodeURIComponent(group)}`}
                  className="text-blue-500 hover:text-blue-700 no-underline"
                >
                  {group}
                </Link>
              </h2>
              <p className="text-lg font-semibold">
                Total Closing Balance: {groupTotals[group].toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md col-span-full">
            <p className="text-center">No groups available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LedgerGroupsPage;
