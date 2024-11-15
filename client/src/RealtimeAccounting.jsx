// import React, { useEffect, useState } from "react";
// import { useGetExpensesQuery } from "./store/api/ExpenseExpenseApi";

// const App = () => {
//   const { data: transactions = [] } = useGetExpensesQuery();
//   const [ledgers, setLedgers] = useState({});

//   useEffect(() => {
//     if (transactions.length > 0) {
//       const ledgerMap = {};

//       transactions.forEach((transaction) => {
//         const {
//           date,
//           debitAccount,
//           debitDescription,
//           debitAmount,
//           creditAccount,
//           creditDescription,
//           creditAmount,
//         } = transaction;

//         // Process debit account
//         if (!ledgerMap[debitAccount]) {
//           ledgerMap[debitAccount] = {
//             openingBalance: 0, // Assuming opening balance is zero; adjust as needed
//             totalDebit: 0,
//             totalCredit: 0,
//             closingBalance: 0,
//             entries: [],
//           };
//         }

//         // Process credit account
//         if (!ledgerMap[creditAccount]) {
//           ledgerMap[creditAccount] = {
//             openingBalance: 0, // Assuming opening balance is zero; adjust as needed
//             totalDebit: 0,
//             totalCredit: 0,
//             closingBalance: 0,
//             entries: [],
//           };
//         }

//         // Update debit account
//         ledgerMap[debitAccount].totalDebit += debitAmount;
//         ledgerMap[debitAccount].entries.push({
//           date: new Date(date).toLocaleDateString(),
//           description: debitDescription,
//           debit: debitAmount,
//           credit: 0,
//         });

//         // Update credit account
//         ledgerMap[creditAccount].totalCredit += creditAmount;
//         ledgerMap[creditAccount].entries.push({
//           date: new Date(date).toLocaleDateString(),
//           description: creditDescription,
//           debit: 0,
//           credit: creditAmount,
//         });
//       });

//       // Calculate closing balance for each ledger
//       Object.keys(ledgerMap).forEach((account) => {
//         const ledger = ledgerMap[account];
//         ledger.closingBalance =
//           ledger.openingBalance + ledger.totalDebit - ledger.totalCredit;
//       });

//       setLedgers(ledgerMap);
//     }
//   }, [transactions]);

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-center">Account Ledgers</h1>
//       <div className="overflow-x-auto">
//         <div className="flex space-x-6 min-w-max">
//           {Object.keys(ledgers).map((account) => {
//             const {
//               openingBalance,
//               totalDebit,
//               totalCredit,
//               closingBalance,
//               entries,
//             } = ledgers[account];
//             return (
//               <div
//                 key={account}
//                 className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-xl"
//               >
//                 <h2 className="text-2xl font-semibold p-4 bg-blue-500 text-white">
//                   {account} Ledger
//                 </h2>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Date
//                         </th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Description
//                         </th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Debit
//                         </th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Credit
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {entries.length === 0 ? (
//                         <tr>
//                           <td
//                             colSpan="4"
//                             className="px-4 py-2 text-center text-gray-500"
//                           >
//                             No entries available
//                           </td>
//                         </tr>
//                       ) : (
//                         entries.map((entry, index) => (
//                           <tr key={index}>
//                             <td className="px-4 py-2 whitespace-nowrap">
//                               {entry.date}
//                             </td>
//                             <td className="px-4 py-2 whitespace-nowrap">
//                               {entry.description}
//                             </td>
//                             <td className="px-4 py-2 whitespace-nowrap text-right">
//                               {entry.debit.toFixed(2)}
//                             </td>
//                             <td className="px-4 py-2 whitespace-nowrap text-right">
//                               {entry.credit.toFixed(2)}
//                             </td>
//                           </tr>
//                         ))
//                       )}
//                       <tr className="bg-gray-50">
//                         <td
//                           colSpan="2"
//                           className="px-4 py-2 text-right font-semibold"
//                         >
//                           Total
//                         </td>
//                         <td className="px-4 py-2 text-right font-semibold">
//                           {totalDebit.toFixed(2)}
//                         </td>
//                         <td className="px-4 py-2 text-right font-semibold">
//                           {totalCredit.toFixed(2)}
//                         </td>
//                       </tr>
//                       <tr className="bg-gray-50">
//                         <td
//                           colSpan="2"
//                           className="px-4 py-2 text-right font-semibold"
//                         >
//                           Closing Balance
//                         </td>
//                         <td
//                           colSpan="2"
//                           className="px-4 py-2 text-right font-semibold"
//                         >
//                           {closingBalance.toFixed(2)}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;
import React, { useEffect, useState } from "react";
import { useGetExpensesQuery } from "./store/api/ExpenseExpenseApi";

const App = () => {
  const { data: { transactions = [], ledgers = [] } = {} } =
    useGetExpensesQuery();
  const [ledgerMap, setLedgerMap] = useState({});

  useEffect(() => {
    if (transactions.length > 0 && ledgers.length > 0) {
      const ledgerMap = {};

      // Initialize ledgerMap with ledgers and their opening balances
      ledgers.forEach((ledger) => {
        const openingBalance = ledger.openingBalance || 0;

        ledgerMap[ledger._id] = {
          name: ledger.name || "", // Default value
          openingBalance: openingBalance,
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

        if (!ledgerMap[debitLedgerId]) {
          ledgerMap[debitLedgerId] = {
            name: debitLedgerName || "", // Default value
            openingBalance: 0,
            totalDebit: 0,
            totalCredit: 0,
            closingBalance: 0,
            entries: [],
          };
        }

        if (!ledgerMap[creditLedgerId]) {
          ledgerMap[creditLedgerId] = {
            name: creditLedgerName || "", // Default value
            openingBalance: 0,
            totalDebit: 0,
            totalCredit: 0,
            closingBalance: 0,
            entries: [],
          };
        }

        ledgerMap[debitLedgerId].totalDebit += formattedDebitAmount;
        ledgerMap[debitLedgerId].entries.push({
          date: date ? new Date(date).toLocaleDateString() : "",
          description: debitLedgerName,
          debit: formattedDebitAmount,
          credit: 0,
        });

        ledgerMap[creditLedgerId].totalCredit += formattedCreditAmount;
        ledgerMap[creditLedgerId].entries.push({
          date: date ? new Date(date).toLocaleDateString() : "",
          description: creditLedgerName,
          debit: 0,
          credit: formattedCreditAmount,
        });
      });

      // Calculate closing balance for each ledger
      Object.keys(ledgerMap).forEach((ledgerId) => {
        const ledger = ledgerMap[ledgerId];
        ledger.closingBalance =
          ledger.openingBalance + ledger.totalDebit - ledger.totalCredit;
      });

      setLedgerMap(ledgerMap);
    }
  }, [transactions, ledgers]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Account Ledgers</h1>
      <div className="overflow-x-auto">
        <div className="flex flex-col space-y-6 min-w-max">
          {Object.keys(ledgerMap).map((ledgerId) => {
            const {
              name,
              openingBalance,
              totalDebit,
              totalCredit,
              closingBalance,
              entries,
            } = ledgerMap[ledgerId];
            return (
              <div
                key={ledgerId}
                className="bg-white shadow-md rounded-lg w-full max-w-xl"
              >
                <h2 className="text-2xl font-semibold p-4 bg-blue-500 text-white">
                  {name}
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
                        <td
                          colSpan="2"
                          className="px-4 py-2 text-right font-semibold"
                        >
                          Opening Balance
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {openingBalance.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          0.00
                        </td>
                      </tr>
                      {entries.length === 0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-2 text-center text-gray-500"
                          >
                            No entries available
                          </td>
                        </tr>
                      ) : (
                        entries.map((entry, index) => (
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
                        <td
                          colSpan="2"
                          className="px-4 py-2 text-right font-semibold"
                        >
                          Total
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {totalDebit.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {totalCredit.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td
                          colSpan="2"
                          className="px-4 py-2 text-right font-semibold"
                        >
                          Closing Balance
                        </td>
                        <td
                          colSpan="2"
                          className="px-4 py-2 text-right font-semibold"
                        >
                          {closingBalance.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
