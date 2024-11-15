// // src/components/LedgerAccount.js
// import React from "react";

// const LedgerAccount = ({ accountName, entries }) => {
//   let balance = 0;

//   return (
//     <div className="p-4 mb-8 bg-gray-50 shadow rounded">
//       <h2 className="text-xl font-bold mb-4">{accountName}</h2>
//       <table className="min-w-full bg-white border border-gray-200">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border-b bg-gray-100">Date</th>
//             <th className="py-2 px-4 border-b bg-gray-100">Particulars</th>
//             <th className="py-2 px-4 border-b bg-gray-100">Debit</th>
//             <th className="py-2 px-4 border-b bg-gray-100">Credit</th>
//             <th className="py-2 px-4 border-b bg-gray-100">Balance</th>
//           </tr>
//         </thead>
//         <tbody>
//           {entries.map((entry, index) => {
//             balance += entry.debit !== null ? entry.debit : 0;
//             balance -= entry.credit !== null ? entry.credit : 0;
//             return (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="py-2 px-4 border-b">{entry.date}</td>
//                 <td className="py-2 px-4 border-b">{entry.particulars}</td>
//                 <td className="py-2 px-4 border-b">
//                   {entry.debit !== null ? entry.debit : ""}
//                 </td>
//                 <td className="py-2 px-4 border-b">
//                   {entry.credit !== null ? entry.credit : ""}
//                 </td>
//                 <td className="py-2 px-4 border-b">{balance.toFixed(2)}</td>
//               </tr>
//             );
//           })}
//           {/* Display final balance at the end */}
//           <tr className="bg-gray-100 font-bold">
//             <td className="py-2 px-4 border-b" colSpan="4">
//               Total Balance
//             </td>
//             <td className="py-2 px-4 border-b">{balance.toFixed(2)}</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LedgerAccount;
// src/LedgerComponent.jsx

// src/calculateLedgerBalances.js

import { processJournalEntries } from "./processJournalEntries";

const calculateLedgerBalances = (journalEntries, initialBalances) => {
  const ledgerAccounts = processJournalEntries(journalEntries);
  const ledgerBalances = {};

  Object.keys(initialBalances).forEach((ledgerId) => {
    const ledger = initialBalances[ledgerId];
    const transactions = ledgerAccounts[ledgerId] || [];

    let balance =
      ledger.nature === "Credit"
        ? ledger.openingBalance
        : -ledger.openingBalance;

    transactions.forEach((transaction) => {
      if (transaction.debit !== null) {
        balance += transaction.debit;
      }
      if (transaction.credit !== null) {
        balance -= transaction.credit;
      }
      transaction.balance = Math.abs(balance);
    });

    ledgerBalances[ledger.name] = {
      transactions,
      balance: Math.abs(balance),
      nature:
        balance >= 0
          ? ledger.nature === "Credit"
            ? "Cr"
            : "Dr"
          : ledger.nature === "Credit"
          ? "Dr"
          : "Cr",
    };
  });

  return ledgerBalances;
};

export default calculateLedgerBalances;
