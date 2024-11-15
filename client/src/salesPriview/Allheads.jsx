import React, { useEffect, useState } from "react";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";
import { useNavigate } from "react-router-dom";

const groups = [
  "Branch/Divisions",
  "Capital Account",
  "Reserves & Surplus",
  "Current Assets",
  "Loans (Liability)",
  "Current Liabilities",
  "Fixed Assets",
  "Investments",
  "Miscellaneous Expenses (Asset)",
  "Suspense Account",
  "Sales Accounts",
  "Purchase Accounts",
  "Direct Incomes",
  "Indirect Incomes",
  "Direct Expenses",
  "Indirect Expenses",
  "Sundry Creditors",
  "Sundry Debtors",
  "Cash-in-Hand",
  "Bank Accounts",
  "Bank OD Accounts",
  "Secured Loans",
  "Unsecured Loans",
  "Duties & Taxes",
  "Provisions",
  "Deposits (Asset)",
  "Loans & Advances (Asset)",
  "Stock-in-Hand",
  "Purchase Return",
  "Sales Return",
];

const AllHeads = () => {
  const { data: { transactions = [], ledgers = [] } = {}, refetch } =
    useGetExpensesQuery();
  console.log("transaction", transactions);
  const [ledgerMap, setLedgerMap] = useState({});
  const [groupTotals, setGroupTotals] = useState({});
  const [taxBalances, setTaxBalances] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    refetch();
  }, [refetch]);
  useEffect(() => {
    if (transactions.length > 0 && ledgers.length > 0) {
      const newLedgerMap = {};
      ledgers.forEach((ledger) => {
        const openingBalance = ledger.openingBalance || 0;
        newLedgerMap[ledger._id] = {
          name: ledger.name || "",
          group: ledger.group || "",
          nature: ledger.nature || "",
          openingBalance,
          totalDebit: 0,
          totalCredit: 0,
          closingBalance: openingBalance,
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

        if (!newLedgerMap[debitLedgerId]) {
          newLedgerMap[debitLedgerId] = {
            name: debitLedgerName || "",
            group: "",
            nature: "",
            openingBalance: 0,
            totalDebit: 0,
            totalCredit: 0,
            closingBalance: 0,
            entries: [],
          };
        }

        if (!newLedgerMap[creditLedgerId]) {
          newLedgerMap[creditLedgerId] = {
            name: creditLedgerName || "",
            group: "",
            nature: "",
            openingBalance: 0,
            totalDebit: 0,
            totalCredit: 0,
            closingBalance: 0,
            entries: [],
          };
        }

        if (newLedgerMap[debitLedgerId].nature === "Credit") {
          newLedgerMap[debitLedgerId].closingBalance -= formattedDebitAmount;
        } else {
          newLedgerMap[debitLedgerId].closingBalance += formattedDebitAmount;
        }

        if (newLedgerMap[creditLedgerId].nature === "Credit") {
          newLedgerMap[creditLedgerId].closingBalance += formattedCreditAmount;
        } else {
          newLedgerMap[creditLedgerId].closingBalance -= formattedCreditAmount;
        }

        newLedgerMap[debitLedgerId].totalDebit += formattedDebitAmount;
        newLedgerMap[debitLedgerId].entries.push({
          date: date ? new Date(date).toLocaleDateString() : "",
          description: creditLedgerName,
          debit: formattedDebitAmount,
          credit: 0,
        });

        newLedgerMap[creditLedgerId].totalCredit += formattedCreditAmount;
        newLedgerMap[creditLedgerId].entries.push({
          date: date ? new Date(date).toLocaleDateString() : "",
          description: debitLedgerName,
          debit: 0,
          credit: formattedCreditAmount,
        });
      });

      const newGroupTotals = groups.reduce((acc, group) => {
        const ledgerIds = ledgers
          .filter((ledger) => ledger.group === group)
          .map((ledger) => ledger._id);

        const totalDebit = ledgerIds.reduce(
          (total, ledgerId) =>
            total + (newLedgerMap[ledgerId]?.totalDebit || 0),
          0
        );
        const totalCredit = ledgerIds.reduce(
          (total, ledgerId) =>
            total + (newLedgerMap[ledgerId]?.totalCredit || 0),
          0
        );
        const openingBalance = ledgerIds.reduce(
          (total, ledgerId) =>
            total + (newLedgerMap[ledgerId]?.openingBalance || 0),
          0
        );
        const closingBalance = ledgerIds.reduce(
          (total, ledgerId) =>
            total + (newLedgerMap[ledgerId]?.closingBalance || 0),
          0
        );

        if (totalDebit || totalCredit || openingBalance || closingBalance) {
          acc[group] = {
            totalDebit,
            totalCredit,
            openingBalance,
            closingBalance,
          };
        }

        return acc;
      }, {});

      setLedgerMap(newLedgerMap);
      setGroupTotals(newGroupTotals);

      const dutiesAndTaxesLedgers = ledgers.filter(
        (ledger) => ledger.group === "Duties & Taxes"
      );

      const groupedBalances = dutiesAndTaxesLedgers.reduce((acc, ledger) => {
        const relevantTransactions = transactions.filter(
          (transaction) => transaction.taxId === ledger._id
        );

        const totalTaxAmount = relevantTransactions.reduce(
          (sum, transaction) => sum + (transaction.taxAmount || 0),
          0
        );

        if (!acc[ledger.group]) {
          acc[ledger.group] = {
            groupName: ledger.group,
            ledgers: [],
            totalBalance: 0,
          };
        }

        acc[ledger.group].ledgers.push({
          ledgerName: ledger.name,
          totalTaxAmount,
        });

        acc[ledger.group].totalBalance += totalTaxAmount;

        return acc;
      }, {});

      setTaxBalances(Object.values(groupedBalances));
    }
  }, [transactions, ledgers]);

  const handleRedirect = (groupName) => {
    navigate(`/preview/group-details/${encodeURIComponent(groupName)}`);
  };

  const handleTaxRedirect = (ledgerName) => {
    navigate(`/preview/tax-details/${encodeURIComponent(ledgerName)}`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600">
        Group Totals
      </h1>
      <div className="overflow-x-auto">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {Object.keys(groupTotals).length > 0 ? (
            Object.keys(groupTotals).map((group) => {
              const {
                totalDebit,
                totalCredit,
                openingBalance,
                closingBalance,
              } = groupTotals[group] || {};

              if (
                !totalDebit &&
                !totalCredit &&
                !openingBalance &&
                !closingBalance
              ) {
                return null;
              }

              return (
                <div
                  key={group}
                  className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
                  onClick={() => handleRedirect(group)}
                >
                  <h2 className="text-xl font-semibold p-4 bg-blue-600 text-white cursor-pointer">
                    {group}
                  </h2>
                  <div className="overflow-x-auto p-4">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                            Opening Balance
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                            Total Debit
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                            Total Credit
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                            Closing Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-300">
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {openingBalance.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {totalDebit.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {totalCredit.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {closingBalance.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center col-span-full">
              <p className="text-gray-600">No data available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllHeads;
