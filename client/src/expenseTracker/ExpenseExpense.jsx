// import React, { useState, useEffect } from "react";
// import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";

// // Utility function to calculate balance for a specific ledger
// const calculateLedgerBalance = (ledgers, transactions, ledgerId) => {
//   const ledger = ledgers.find((ledger) => ledger._id === ledgerId);

//   if (!ledger)
//     return { openingBalance: 0, totalTransactions: 0, closingBalance: 0 };

//   const openingBalance =
//     ledger.nature === "Credit"
//       ? Math.abs(ledger.openingBalance || 0)
//       : -(ledger.openingBalance || 0);

//   const totalTransactions = transactions.reduce((total, transaction) => {
//     if (transaction.debitLedger === ledgerId) {
//       total -= transaction.debitAmount || 0;
//     }
//     if (transaction.creditLedger === ledgerId) {
//       total += transaction.creditAmount || 0;
//     }
//     return total;
//   }, 0);

//   const closingBalance = openingBalance + totalTransactions;

//   return {
//     openingBalance: Math.abs(openingBalance),
//     totalTransactions: Math.abs(totalTransactions),
//     closingBalance: Math.abs(closingBalance),
//   };
// };

// // Utility function to calculate balance for a group of ledgers
// const getGroupBalance = (ledgers, transactions, groupName) => {
//   const groupLedgers = ledgers.filter((ledger) => ledger.group === groupName);
//   const groupBalances = groupLedgers.map((ledger) =>
//     calculateLedgerBalance(ledgers, transactions, ledger._id)
//   );

//   return groupBalances.reduce(
//     (acc, balance) => {
//       acc.openingBalance += balance.openingBalance;
//       acc.totalTransactions += balance.totalTransactions;
//       acc.closingBalance += balance.closingBalance;
//       return acc;
//     },
//     { openingBalance: 0, totalTransactions: 0, closingBalance: 0 }
//   );
// };

// const BalanceSheet = () => {
//   const { data, isLoading, error } = useGetExpensesQuery();
//   const [groupTotals, setGroupTotals] = useState({});

//   useEffect(() => {
//     if (data && data.transactions && data.ledgers) {
//       const { transactions, ledgers } = data;

//       // List of ledger groups
//       const groups = [
//         "Bank Accounts",
//         "Cash-in-Hand",
//         "Fixed Assets",
//         "Sundry Debtors",
//         "Capital Account",
//         "Reserves & Surplus",
//         "Sundry Creditors",
//         "Loans (Liability)",
//         "Current Liabilities",
//         "Investments",
//         "Miscellaneous Expenses (Asset)",
//         "Stock-in-Hand",
//         "Loans & Advances (Asset)",
//         "Deposits (Asset)",
//         "Duties & Taxes",
//         "Provisions",
//         "Secured Loans",
//         "Unsecured Loans",
//         "Withdrawals", // Corrected from Withdrawal to Withdrawals
//       ];

//       // Calculate totals for each group
//       const newGroupTotals = groups.reduce((acc, group) => {
//         const groupBalance = getGroupBalance(ledgers, transactions, group);
//         acc[group] = groupBalance;
//         return acc;
//       }, {});

//       setGroupTotals(newGroupTotals);
//     }
//   }, [data]);

//   // Calculate total assets
//   const totalAssets = [
//     "Bank Accounts",
//     "Cash-in-Hand",
//     "Fixed Assets",
//     "Sundry Debtors",
//     "Investments",
//     "Miscellaneous Expenses (Asset)",
//     "Stock-in-Hand",
//     "Loans & Advances (Asset)",
//     "Deposits (Asset)",
//   ].reduce(
//     (total, group) => total + (groupTotals[group]?.closingBalance || 0),
//     0
//   );

//   // Calculate adjusted Capital Account balance by subtracting Withdrawals
//   const capitalAccountBalance =
//     groupTotals["Capital Account"]?.closingBalance || 0;
//   const withdrawalAmount = groupTotals["Withdrawals"]?.closingBalance || 0;
//   const adjustedCapitalAccountBalance =
//     capitalAccountBalance - withdrawalAmount;

//   // Calculate total liabilities
//   const totalLiabilities = [
//     adjustedCapitalAccountBalance,
//     "Reserves & Surplus",
//     "Sundry Creditors",
//     "Loans (Liability)",
//     "Current Liabilities",
//     "Duties & Taxes",
//     "Provisions",
//     "Secured Loans",
//     "Unsecured Loans",
//   ].reduce(
//     (total, group) => total + (groupTotals[group]?.closingBalance || 0),
//     0
//   );

//   // Calculate profit or loss
//   const profitOrLoss = totalAssets - totalLiabilities;

//   if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
//   if (error)
//     return <p className="text-center text-red-500">Error loading data.</p>;

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
//       <h1 className="text-3xl font-semibold mb-6 text-gray-800 border-b pb-2">
//         Balance Sheet
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Assets Section */}
//         <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-700">Assets</h2>
//           <ul className="space-y-2">
//             {[
//               "Bank Accounts",
//               "Cash-in-Hand",
//               "Fixed Assets",
//               "Sundry Debtors",
//               "Investments",
//               "Miscellaneous Expenses (Asset)",
//               "Stock-in-Hand",
//               "Loans & Advances (Asset)",
//               "Deposits (Asset)",
//             ].map((group) => (
//               <li
//                 key={group}
//                 className="flex justify-between py-1 text-gray-600"
//               >
//                 <span className="font-medium">{group}:</span>
//                 <span>
//                   {groupTotals[group]?.closingBalance?.toFixed(2) || 0}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Liabilities Section */}
//         <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-700">
//             Liabilities
//           </h2>
//           <ul className="space-y-2">
//             <li className="flex justify-between py-1 text-gray-600">
//               <span className="font-medium">Capital Account (Adjusted):</span>
//               <span>{adjustedCapitalAccountBalance.toFixed(2)}</span>
//             </li>
//             {[
//               "Reserves & Surplus",
//               "Sundry Creditors",
//               "Loans (Liability)",
//               "Current Liabilities",
//               "Duties & Taxes",
//               "Provisions",
//               "Secured Loans",
//               "Unsecured Loans",
//             ].map((group) => (
//               <li
//                 key={group}
//                 className="flex justify-between py-1 text-gray-600"
//               >
//                 <span className="font-medium">{group}:</span>
//                 <span>
//                   {groupTotals[group]?.closingBalance?.toFixed(2) || 0}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Summary Section */}
//       <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-sm border-t border-gray-200">
//         <h2 className="text-2xl font-semibold mb-4 text-gray-700">Summary</h2>
//         <div className="space-y-2">
//           <div className="flex justify-between py-1 text-gray-600">
//             <span className="font-medium">Total Assets:</span>
//             <span>{totalAssets.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between py-1 text-gray-600">
//             <span className="font-medium">Total Liabilities:</span>
//             <span>{totalLiabilities.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between py-1 text-gray-600">
//             <span className="font-medium">Profit or Loss:</span>
//             <span>{profitOrLoss.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BalanceSheet;

import React, { useState, useEffect } from "react";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";
import { useNavigate } from "react-router-dom";

// Utility functions
const calculateLedgerBalance = (ledgers, transactions, ledgerId) => {
  const ledger = ledgers.find((ledger) => ledger._id === ledgerId);

  if (!ledger)
    return { openingBalance: 0, totalTransactions: 0, closingBalance: 0 };

  const openingBalance =
    ledger.nature === "Credit"
      ? Math.abs(ledger.openingBalance || 0)
      : -(ledger.openingBalance || 0);

  const totalTransactions = transactions.reduce((total, transaction) => {
    if (transaction.debitLedger === ledgerId) {
      total -= transaction.debitAmount || 0;
    }
    if (transaction.creditLedger === ledgerId) {
      total += transaction.creditAmount || 0;
    }
    return total;
  }, 0);

  const closingBalance = openingBalance + totalTransactions;

  return {
    openingBalance: Math.abs(openingBalance),
    totalTransactions: Math.abs(totalTransactions),
    closingBalance: Math.abs(closingBalance),
  };
};

const getGroupBalance = (ledgers, transactions, groupName) => {
  const groupLedgers = ledgers.filter((ledger) => ledger.group === groupName);
  const groupBalances = groupLedgers.map((ledger) =>
    calculateLedgerBalance(ledgers, transactions, ledger._id)
  );

  return groupBalances.reduce(
    (acc, balance) => {
      acc.openingBalance += balance.openingBalance;
      acc.totalTransactions += balance.totalTransactions;
      acc.closingBalance += balance.closingBalance;
      return acc;
    },
    { openingBalance: 0, totalTransactions: 0, closingBalance: 0 }
  );
};

const BalanceSheet = () => {
  const { data, isLoading, error } = useGetExpensesQuery();
  const [groupTotals, setGroupTotals] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.transactions && data.ledgers) {
      const { transactions, ledgers } = data;

      const groups = [
        "Bank Accounts",
        "Cash-in-Hand",
        "Fixed Assets",
        "Sundry Debtors",
        "Capital Account",
        "Reserves & Surplus",
        "Sundry Creditors",
        "Loans (Liability)",
        "Current Liabilities",
        "Investments",
        "Miscellaneous Expenses (Asset)",
        "Stock-in-Hand",
        "Loans & Advances (Asset)",
        "Deposits (Asset)",
        "Duties & Taxes",
        "Provisions",
        "Secured Loans",
        "Unsecured Loans",
        "Withdrawals",
      ];

      const newGroupTotals = groups.reduce((acc, group) => {
        const groupBalance = getGroupBalance(ledgers, transactions, group);
        acc[group] = groupBalance;
        return acc;
      }, {});

      setGroupTotals(newGroupTotals);
    }
  }, [data]);

  const totalAssets = [
    "Bank Accounts",
    "Cash-in-Hand",
    "Fixed Assets",
    "Sundry Debtors",
    "Investments",
    "Miscellaneous Expenses (Asset)",
    "Stock-in-Hand",
    "Loans & Advances (Asset)",
    "Deposits (Asset)",
  ].reduce(
    (total, group) => total + (groupTotals[group]?.closingBalance || 0),
    0
  );

  const capitalAccountBalance =
    groupTotals["Capital Account"]?.closingBalance || 0;
  const withdrawalAmount = groupTotals["Withdrawals"]?.closingBalance || 0;
  const adjustedCapitalAccountBalance =
    capitalAccountBalance - withdrawalAmount;

  const totalLiabilities = [
    adjustedCapitalAccountBalance,
    "Reserves & Surplus",
    "Sundry Creditors",
    "Loans (Liability)",
    "Current Liabilities",
    "Duties & Taxes",
    "Provisions",
    "Secured Loans",
    "Unsecured Loans",
  ].reduce(
    (total, group) => total + (groupTotals[group]?.closingBalance || 0),
    0
  );

  const profitOrLoss = totalAssets - totalLiabilities;

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading data.</p>;

  const handleItemClick = (group) => {
    navigate(`/expense/group-detail/${group}`); // Navigate to detailed view page
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 border-b pb-2">
        Balance Sheet
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assets Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Assets</h2>
          <ul className="space-y-2">
            {[
              "Bank Accounts",
              "Cash-in-Hand",
              "Fixed Assets",
              "Sundry Debtors",
              "Investments",
              "Miscellaneous Expenses (Asset)",
              "Stock-in-Hand",
              "Loans & Advances (Asset)",
              "Deposits (Asset)",
            ].map((group) => (
              <li
                key={group}
                className="flex justify-between py-1 text-gray-600 cursor-pointer hover:bg-gray-200"
                onClick={() => handleItemClick(group)}
              >
                <span className="font-medium">{group}:</span>
                <span>
                  {groupTotals[group]?.closingBalance?.toFixed(2) || 0}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Liabilities Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Liabilities
          </h2>
          <ul className="space-y-2">
            <li
              className="flex justify-between py-1 text-gray-600 cursor-pointer hover:bg-gray-200"
              onClick={() => handleItemClick("Capital Account (Adjusted)")}
            >
              <span className="font-medium">Capital Account (Adjusted):</span>
              <span>{adjustedCapitalAccountBalance.toFixed(2)}</span>
            </li>
            {[
              "Reserves & Surplus",
              "Sundry Creditors",
              "Loans (Liability)",
              "Current Liabilities",
              "Duties & Taxes",
              "Provisions",
              "Secured Loans",
              "Unsecured Loans",
            ].map((group) => (
              <li
                key={group}
                className="flex justify-between py-1 text-gray-600 cursor-pointer hover:bg-gray-200"
                onClick={() => handleItemClick(group)}
              >
                <span className="font-medium">{group}:</span>
                <span>
                  {groupTotals[group]?.closingBalance?.toFixed(2) || 0}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-sm border-t border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between py-1 text-gray-600">
            <span className="font-medium">Total Assets:</span>
            <span>{totalAssets.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-gray-600">
            <span className="font-medium">Total Liabilities:</span>
            <span>{totalLiabilities.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-gray-600">
            <span className="font-medium">Profit or Loss:</span>
            <span>{profitOrLoss.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
