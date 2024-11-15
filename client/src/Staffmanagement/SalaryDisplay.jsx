// import React, { useState, useEffect } from "react";
// import { useGetExpensesQuery } from "../store/api/SalaryDisplayApi";
// import { useNavigate } from "react-router-dom";

// // Helper function to calculate ledger balance
// const calculateLedgerBalance = (ledgers, transactions, ledgerId) => {
//   const ledger = ledgers.find((ledger) => ledger._id === ledgerId);
//   if (!ledger)
//     return { openingBalance: 0, totalTransactions: 0, closingBalance: 0 };

//   const isAsset = ["Loans & Advances (Asset)"].includes(ledger.group);

//   const openingBalance =
//     ledger.nature === "Credit"
//       ? -(ledger.openingBalance || 0)
//       : ledger.openingBalance || 0;

//   const totalTransactions = transactions.reduce((total, transaction) => {
//     if (transaction.debitLedger === ledgerId)
//       total += transaction.debitAmount || 0;
//     if (transaction.creditLedger === ledgerId)
//       total -= transaction.creditAmount || 0;
//     return total;
//   }, 0);

//   let closingBalance = openingBalance + totalTransactions;
//   if (isAsset && closingBalance < 0) closingBalance = Math.abs(closingBalance);

//   return { openingBalance, totalTransactions, closingBalance };
// };

// // Helper function to calculate group balance
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

// const SalaryDisply = () => {
//   const {
//     data: expenseData = [],
//     isLoading,
//     error,
//     refetch: refeches,
//   } = useGetExpensesQuery();
//   console.log("expenseData", expenseData);
//   const navigate = useNavigate();

//   const [groupTotals, setGroupTotals] = useState({});
//   useEffect(() => {
//     refeches();
//   }, [refeches]);

//   useEffect(() => {
//     if (expenseData && expenseData.transactions && expenseData.ledgers) {
//       const { transactions, ledgers } = expenseData;
//       const groups = ["Current Liabilities", "Loans & Advances (Asset)"];

//       const newGroupTotals = groups.reduce((acc, group) => {
//         acc[group] = getGroupBalance(ledgers, transactions, group);
//         return acc;
//       }, {});

//       setGroupTotals(newGroupTotals);
//     }
//   }, [expenseData]);

//   if (isLoading) return <p className="text-center">Loading...</p>;
//   if (error)
//     return <p className="text-center text-red-500">Error loading data.</p>;

//   const handleItemClick = (group) => {
//     navigate(`/admin/group-detail/${group}`);
//   };

//   return (
//     <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 min-h-screen">
//       <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
//         <h2 className="text-2xl font-bold mb-6">Group Balances</h2>

//         {/* Display for Loans & Advances (Asset) */}
//         <div
//           onClick={() => handleItemClick("Loans & Advances (Asset)")}
//           className="cursor-pointer p-4 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"
//         >
//           <h3 className="text-xl font-semibold">Loans & Advances (Asset)</h3>
//           <p>
//             Closing Balance: ₹
//             {groupTotals["Loans & Advances (Asset)"]?.closingBalance || 0}
//           </p>
//         </div>

//         {/* Display for Current Liabilities */}
//         <div
//           onClick={() => handleItemClick("Current Liabilities")}
//           className="cursor-pointer p-4 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"
//         >
//           <h3 className="text-xl font-semibold">Current Liabilities</h3>
//           <p>
//             Closing Balance: ₹
//             {groupTotals["Current Liabilities"]?.closingBalance || 0}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalaryDisply;
import React, { useState, useEffect } from "react";
import { useGetExpensesQuery } from "../store/api/SalaryDisplayApi";
import { useNavigate } from "react-router-dom";
import StatCard from "../Staffmanagement/StaffStatCard"; // Adjust the path as necessary
// import { Zap } from "react-icons/fa"; // Adjust the icon import as necessary

const calculateLedgerBalance = (ledgers, transactions, ledgerId) => {
  const ledger = ledgers.find((ledger) => ledger._id === ledgerId);
  if (!ledger)
    return { openingBalance: 0, totalTransactions: 0, closingBalance: 0 };

  const isAsset = ["Loans & Advances (Asset)"].includes(ledger.group);

  const openingBalance =
    ledger.nature === "Credit"
      ? -(ledger.openingBalance || 0)
      : ledger.openingBalance || 0;

  const totalTransactions = transactions.reduce((total, transaction) => {
    if (transaction.debitLedger === ledgerId)
      total += transaction.debitAmount || 0;
    if (transaction.creditLedger === ledgerId)
      total -= transaction.creditAmount || 0;
    return total;
  }, 0);

  let closingBalance = openingBalance + totalTransactions;
  if (isAsset && closingBalance < 0) closingBalance = Math.abs(closingBalance);

  return { openingBalance, totalTransactions, closingBalance };
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

const SalaryDisply = () => {
  const {
    data: expenseData = [],
    isLoading,
    error,
    refetch: refeches,
  } = useGetExpensesQuery();

  const navigate = useNavigate();
  const [groupTotals, setGroupTotals] = useState({});

  useEffect(() => {
    refeches();
  }, [refeches]);

  useEffect(() => {
    if (expenseData && expenseData.transactions && expenseData.ledgers) {
      const { transactions, ledgers } = expenseData;
      const groups = [
        "Current Liabilities",
        "Loans & Advances (Asset)",
        "Indirect Expenses",
      ];

      const newGroupTotals = groups.reduce((acc, group) => {
        acc[group] = getGroupBalance(ledgers, transactions, group);
        return acc;
      }, {});

      setGroupTotals(newGroupTotals);
    }
  }, [expenseData]);

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading data.</p>;

  const handleItemClick = (group) => {
    navigate(`/admin/group-detail/${group}`);
  };
  const handleIndirectExpenses = () => {
    const groupName = "Indirect Expenses"; // Group name for indirect expenses
    navigate(`/staff/indirectexpencedetails/${groupName}`); // Navigate to the details page
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
      {" "}
      {/* Added flex and spacing */}
      <StatCard
        name="Advances Buy from Us"
        icon={"s"}
        value={`₹ ${
          groupTotals["Loans & Advances (Asset)"]?.closingBalance || 0
        }`}
        onClick={() => handleItemClick("Loans & Advances (Asset)")}
        color="#6366F1"
      />
      <StatCard
        name="Salary Payable for All"
        icon={"s"}
        value={`₹ ${groupTotals["Current Liabilities"]?.closingBalance || 0}`}
        onClick={() => handleItemClick("Current Liabilities")}
        color="#6366F1"
      />
      <StatCard
        name="Payment for All"
        icon={"s"}
        value={`₹ ${groupTotals["Indirect Expenses"]?.closingBalance || 0}`}
        onClick={handleIndirectExpenses}
        color="#6366F1"
      />
    </div>
  );
};

export default SalaryDisply;
