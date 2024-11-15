import React, { useState, useEffect } from "react";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";

// Utility function to calculate balance for a specific ledger
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

// Utility function to calculate balance for a group of ledgers
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

  useEffect(() => {
    if (data && data.transactions && data.ledgers) {
      const { transactions, ledgers } = data;

      // List of ledger groups
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
        "Withdrawal", // Add Withdrawal group
      ];

      // Calculate totals for each group
      const newGroupTotals = groups.reduce((acc, group) => {
        const groupBalance = getGroupBalance(ledgers, transactions, group);
        acc[group] = groupBalance;
        return acc;
      }, {});

      setGroupTotals(newGroupTotals);
    }
  }, [data]);

  // Calculate total assets
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

  // Calculate adjusted Capital Account balance by subtracting Withdrawals
  const capitalAccountBalance =
    groupTotals["Capital Account"]?.closingBalance || 0;
  const withdrawalAmount = groupTotals["Withdrawals"]?.debitAmount || 1800;
  const adjustedCapitalAccountBalance =
    capitalAccountBalance - withdrawalAmount;

  // Calculate total liabilities
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

  // Calculate profit or loss
  const profitOrLoss = totalAssets - totalLiabilities;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data.</p>;

  return (
    <div>
      <h1>Balance Sheet</h1>
      <h2>Assets</h2>
      <ul>
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
          <li key={group}>
            {group}: {groupTotals[group]?.closingBalance || 0}
          </li>
        ))}
      </ul>
      <h2>Liabilities</h2>
      <ul>
        {[
          `Capital Account (Adjusted): ${adjustedCapitalAccountBalance}`,
          "Reserves & Surplus",
          "Sundry Creditors",
          "Loans (Liability)",
          "Current Liabilities",
          "Duties & Taxes",
          "Provisions",
          "Secured Loans",
          "Unsecured Loans",
        ].map((group) => (
          <li key={group}>
            {group}: {groupTotals[group]?.closingBalance || 0}
          </li>
        ))}
      </ul>
      <h2>Total Assets: {totalAssets}</h2>
      <h2>Total Liabilities: {totalLiabilities}</h2>
      <h2>Profit or Loss: {profitOrLoss}</h2>
    </div>
  );
};

export default BalanceSheet;

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
//         "Withdrawal", // Add Withdrawal group
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
//   const withdrawalAmount = groupTotals["Withdrawal"]?.closingBalance || 0;
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
//     <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
//       <h1 className="text-2xl font-semibold mb-4">Balance Sheet</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-gray-100 p-4 rounded-lg">
//           <h2 className="text-xl font-semibold mb-2">Assets</h2>
//           <ul className="list-disc list-inside">
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
//               <li key={group} className="py-1">
//                 <span className="font-medium">{group}:</span>{" "}
//                 {groupTotals[group]?.closingBalance || 0}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="bg-gray-100 p-4 rounded-lg">
//           <h2 className="text-xl font-semibold mb-2">Liabilities</h2>
//           <ul className="list-disc list-inside">
//             {[
//               `Capital Account (Adjusted): ${adjustedCapitalAccountBalance}`,
//               "Reserves & Surplus",
//               "Sundry Creditors",
//               "Loans (Liability)",
//               "Current Liabilities",
//               "Duties & Taxes",
//               "Provisions",
//               "Secured Loans",
//               "Unsecured Loans",
//             ].map((group) => (
//               <li key={group} className="py-1">
//                 <span className="font-medium">{group}:</span>{" "}
//                 {groupTotals[group]?.closingBalance || 0}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <div className="mt-4 bg-gray-100 p-4 rounded-lg">
//         <h2 className="text-xl font-semibold mb-2">Summary</h2>
//         <div className="flex justify-between py-1">
//           <span className="font-medium">Total Assets:</span>
//           <span>{totalAssets}</span>
//         </div>
//         <div className="flex justify-between py-1">
//           <span className="font-medium">Total Liabilities:</span>
//           <span>{totalLiabilities}</span>
//         </div>
//         <div className="flex justify-between py-1">
//           <span className="font-medium">Profit or Loss:</span>
//           <span>{profitOrLoss}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BalanceSheet;
