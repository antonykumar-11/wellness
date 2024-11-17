// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";
// import { ClipLoader } from "react-spinners";

// const App = () => {
//   const location = useLocation();
//   const { data, isLoading, isError, refetch } = useGetExpensesQuery();
//   const [ledgerMap, setLedgerMap] = useState({});
//   const [printLedgerId, setPrintLedgerId] = useState(null);
//   console.log("printLedgerId", printLedgerId);
//   const navigate = useNavigate();

//   useEffect(() => {
//     refetch(); // Refetch data when the component mounts
//   }, [refetch]);

//   useEffect(() => {
//     if (data && !location.state?.preserveData) {
//       const { transactions = [], ledgers = [] } = data || {};
//       console.log("ledgers");
//       const ledgerMap = {};

//       ledgers.forEach(({ _id, name, openingBalance = 0 }) => {
//         ledgerMap[_id] = {
//           name: name || "Unnamed Ledger",
//           openingBalance: openingBalance ?? 0,
//           totalDebit: 0,
//           totalCredit: 0,
//           closingBalance: openingBalance ?? 0,
//           entries: [],
//         };
//       });

//       transactions.forEach((transaction) => {
//         console.log("transaction", transaction);
//         const {
//           debitLedger,
//           description,
//           date: transactionDate,
//           debitAmount = 0,
//           creditLedger,
//           creditAmount = 0,
//           _id,
//           voucherType,
//           voucherNumber,
//         } = transaction;

//         const formattedDate = transactionDate
//           ? new Date(transactionDate).toLocaleDateString()
//           : "N/A";

//         if (debitLedger && ledgerMap[debitLedger]) {
//           ledgerMap[debitLedger].totalDebit += debitAmount ?? 0;
//           ledgerMap[debitLedger].entries.push({
//             date: formattedDate,
//             description: description || "No Description",
//             debit: debitAmount ?? 0,
//             credit: 0,
//             transactionId: _id,
//             voucherType,
//             voucherNumber,
//           });
//         } else {
//           console.warn("Debit Ledger is null or not found:", transaction);
//         }

//         if (creditLedger && ledgerMap[creditLedger]) {
//           ledgerMap[creditLedger].totalCredit += creditAmount ?? 0;
//           ledgerMap[creditLedger].entries.push({
//             date: formattedDate,
//             description: description || "No Description",
//             debit: 0,
//             credit: creditAmount ?? 0,
//             transactionId: _id,
//             voucherType,
//             voucherNumber,
//           });
//         } else {
//           console.warn("Credit Ledger is null or not found:", transaction);
//         }
//       });

//       Object.values(ledgerMap).forEach((ledger) => {
//         ledger.closingBalance =
//           (ledger.openingBalance ?? 0) +
//           (ledger.totalDebit ?? 0) -
//           (ledger.totalCredit ?? 0);
//       });

//       setLedgerMap(ledgerMap);
//     }
//   }, [data, location.state]);

//   const handleRowClick = (ledgerId, transactionId, voucherType) => {
//     navigate(
//       `/previewAll/${voucherType
//         .toLowerCase()
//         .replace(/ /g, "-")}/${ledgerId}/transaction/${transactionId}`,
//       { state: { preserveData: true } }
//     );
//   };

//   const handlePrint = (ledgerId) => {
//     console.log("ledgerId", ledgerId);
//     setPrintLedgerId(ledgerId);
//     setTimeout(() => {
//       window.print();
//       setPrintLedgerId(null);
//     }, 500); // Small delay to ensure print dialog opens properly
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <ClipLoader size={50} color="#4A90E2" />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-red-500 text-lg">
//           Failed to load data. Please try again later.
//         </p>
//       </div>
//     );
//   }

//   if (Object.keys(ledgerMap).length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-gray-500 text-lg">No ledger data available.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900 dark:text-gray-200">
//       <h1 className="text-3xl font-bold text-center mb-8">Account Ledgers</h1>
//       <div className="space-y-8">
//         {Object.entries(ledgerMap).map(
//           (
//             [
//               ledgerId,
//               {
//                 name,
//                 openingBalance,
//                 totalDebit,
//                 totalCredit,
//                 closingBalance,
//                 entries,
//               },
//             ],
//             index
//           ) =>
//             entries.length > 0 && ( // Conditional Rendering: Only render if there are entries
//               <div
//                 key={index}
//                 className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800"
//               >
//                 <div className="bg-blue-600 text-white px-6 py-4">
//                   <button
//                     onClick={() => handlePrint(ledgerId)}
//                     className="bg-green-300 text-white px-4 py-2 rounded mt-2"
//                   >
//                     {name}
//                   </button>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full text-sm">
//                     <thead className="bg-gray-50 dark:bg-gray-700">
//                       <tr>
//                         <th className="px-4 py-2 text-left font-medium">
//                           Date
//                         </th>
//                         <th className="px-4 py-2 text-left font-medium">
//                           Description
//                         </th>
//                         <th className="px-4 py-2 text-left font-medium">
//                           Voucher Number
//                         </th>
//                         <th className="px-4 py-2 text-left font-medium">
//                           Voucher Type
//                         </th>
//                         <th className="px-4 py-2 text-right font-medium">
//                           Debit
//                         </th>
//                         <th className="px-4 py-2 text-right font-medium">
//                           Credit
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
//                       <tr className="bg-gray-100 dark:bg-gray-900">
//                         <td colSpan="4" className="px-4 py-2 font-semibold">
//                           Opening Balance
//                         </td>
//                         <td className="px-4 py-2 text-right font-semibold">
//                           {openingBalance !== undefined
//                             ? openingBalance.toFixed(2)
//                             : "0.00"}
//                         </td>
//                         <td className="px-4 py-2 text-right font-semibold">
//                           -
//                         </td>
//                       </tr>
//                       {entries.map((entry, idx) => (
//                         <tr
//                           key={idx}
//                           className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
//                           onClick={() =>
//                             handleRowClick(
//                               ledgerId,
//                               entry.transactionId,
//                               entry.voucherType
//                             )
//                           }
//                         >
//                           <td className="px-4 py-2">{entry.date}</td>
//                           <td className="px-4 py-2">{entry.description}</td>
//                           <td className="px-4 py-2">{entry.voucherNumber}</td>
//                           <td className="px-4 py-2">{entry.voucherType}</td>
//                           <td className="px-4 py-2 text-right">
//                             {entry.debit ? entry.debit.toFixed(2) : "-"}
//                           </td>
//                           <td className="px-4 py-2 text-right">
//                             {entry.credit ? entry.credit.toFixed(2) : "-"}
//                           </td>
//                         </tr>
//                       ))}
//                       <tr className="bg-gray-100 dark:bg-gray-900">
//                         <td colSpan="4" className="px-4 py-2 font-semibold">
//                           Total
//                         </td>
//                         <td className="px-4 py-2 text-right font-semibold">
//                           {totalDebit !== undefined
//                             ? totalDebit.toFixed(2)
//                             : "0.00"}
//                         </td>
//                         <td className="px-4 py-2 text-right font-semibold">
//                           {totalCredit !== undefined
//                             ? totalCredit.toFixed(2)
//                             : "0.00"}
//                         </td>
//                       </tr>
//                       <tr className="bg-gray-200 dark:bg-gray-800">
//                         <td colSpan="4" className="px-4 py-2 font-semibold">
//                           Closing Balance
//                         </td>
//                         <td className="px-4 py-2 text-right font-semibold">
//                           {closingBalance !== undefined
//                             ? closingBalance.toFixed(2)
//                             : "0.00"}
//                         </td>
//                         <td className="px-4 py-2 text-right font-semibold">
//                           -
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )
//         )}
//       </div>

//       {/* Print View */}
//       {printLedgerId && (
//         <div className="print-only dark:bg-gray-800 dark:text-gray-200">
//           {Object.entries(ledgerMap)
//             .filter(([id]) => id === printLedgerId)
//             .map(
//               (
//                 [
//                   ledgerId,
//                   {
//                     name,
//                     openingBalance,
//                     totalDebit,
//                     totalCredit,
//                     closingBalance,
//                     entries,
//                   },
//                 ],
//                 index
//               ) => (
//                 <div
//                   key={index}
//                   className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800"
//                 >
//                   <div className="bg-blue-600 text-white px-6 py-4">
//                     <h2 className="text-2xl font-semibold">{name}</h2>
//                   </div>
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full text-sm">
//                       <thead className="bg-gray-50 dark:bg-gray-700">
//                         <tr>
//                           <th className="px-4 py-2 text-left font-medium">
//                             Date
//                           </th>
//                           <th className="px-4 py-2 text-left font-medium">
//                             Description
//                           </th>
//                           <th className="px-4 py-2 text-left font-medium">
//                             Voucher Number
//                           </th>
//                           <th className="px-4 py-2 text-left font-medium">
//                             Voucher Type
//                           </th>
//                           <th className="px-4 py-2 text-right font-medium">
//                             Debit
//                           </th>
//                           <th className="px-4 py-2 text-right font-medium">
//                             Credit
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
//                         <tr className="bg-gray-100 dark:bg-gray-900">
//                           <td colSpan="4" className="px-4 py-2 font-semibold">
//                             Opening Balance
//                           </td>
//                           <td className="px-4 py-2 text-right font-semibold">
//                             {openingBalance !== undefined
//                               ? openingBalance.toFixed(2)
//                               : "0.00"}
//                           </td>
//                           <td className="px-4 py-2 text-right font-semibold">
//                             -
//                           </td>
//                         </tr>
//                         {entries.map((entry, idx) => (
//                           <tr key={idx}>
//                             <td className="px-4 py-2">{entry.date}</td>
//                             <td className="px-4 py-2">{entry.description}</td>
//                             <td className="px-4 py-2">{entry.voucherNumber}</td>
//                             <td className="px-4 py-2">{entry.voucherType}</td>
//                             <td className="px-4 py-2 text-right">
//                               {entry.debit ? entry.debit.toFixed(2) : "-"}
//                             </td>
//                             <td className="px-4 py-2 text-right">
//                               {entry.credit ? entry.credit.toFixed(2) : "-"}
//                             </td>
//                           </tr>
//                         ))}
//                         <tr className="bg-gray-100 dark:bg-gray-900">
//                           <td colSpan="4" className="px-4 py-2 font-semibold">
//                             Total
//                           </td>
//                           <td className="px-4 py-2 text-right font-semibold">
//                             {totalDebit !== undefined
//                               ? totalDebit.toFixed(2)
//                               : "0.00"}
//                           </td>
//                           <td className="px-4 py-2 text-right font-semibold">
//                             {totalCredit !== undefined
//                               ? totalCredit.toFixed(2)
//                               : "0.00"}
//                           </td>
//                         </tr>
//                         <tr className="bg-gray-200 dark:bg-gray-800">
//                           <td colSpan="4" className="px-4 py-2 font-semibold">
//                             Closing Balance
//                           </td>
//                           <td className="px-4 py-2 text-right font-semibold">
//                             {closingBalance !== undefined
//                               ? closingBalance.toFixed(2)
//                               : "0.00"}
//                           </td>
//                           <td className="px-4 py-2 text-right font-semibold">
//                             -
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )
//             )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";
import { ClipLoader } from "react-spinners";

const App = () => {
  const location = useLocation();
  const { data, isLoading, isError, refetch } = useGetExpensesQuery();
  const [ledgerMap, setLedgerMap] = useState({});
  const [printLedgerId, setPrintLedgerId] = useState(null);
  console.log("printLedgerId", printLedgerId);
  const navigate = useNavigate();

  useEffect(() => {
    refetch(); // Refetch data when the component mounts
  }, [refetch]);

  useEffect(() => {
    if (data && !location.state?.preserveData) {
      const { transactions = [], ledgers = [] } = data || {};
      console.log("ledgers");
      const ledgerMap = {};

      ledgers.forEach(({ _id, name, openingBalance = 0 }) => {
        ledgerMap[_id] = {
          name: name || "Unnamed Ledger",
          openingBalance: openingBalance ?? 0,
          totalDebit: 0,
          totalCredit: 0,
          closingBalance: openingBalance ?? 0,
          entries: [],
        };
      });

      transactions.forEach((transaction) => {
        console.log("transaction", transaction);
        const {
          debitLedger,
          description,
          date: transactionDate,
          debitAmount = 0,
          creditLedger,
          creditAmount = 0,
          _id,
          voucherType,
          voucherNumber,
        } = transaction;

        const formattedDate = transactionDate
          ? new Date(transactionDate).toLocaleDateString()
          : "N/A";

        if (debitLedger && ledgerMap[debitLedger]) {
          ledgerMap[debitLedger].totalDebit += debitAmount ?? 0;
          ledgerMap[debitLedger].entries.push({
            date: formattedDate,
            description: description || "No Description",
            debit: debitAmount ?? 0,
            credit: 0,
            transactionId: _id,
            voucherType,
            voucherNumber,
          });
        } else {
          console.warn("Debit Ledger is null or not found:", transaction);
        }

        if (creditLedger && ledgerMap[creditLedger]) {
          ledgerMap[creditLedger].totalCredit += creditAmount ?? 0;
          ledgerMap[creditLedger].entries.push({
            date: formattedDate,
            description: description || "No Description",
            debit: 0,
            credit: creditAmount ?? 0,
            transactionId: _id,
            voucherType,
            voucherNumber,
          });
        } else {
          console.warn("Credit Ledger is null or not found:", transaction);
        }
      });

      Object.values(ledgerMap).forEach((ledger) => {
        ledger.closingBalance =
          (ledger.openingBalance ?? 0) +
          (ledger.totalDebit ?? 0) -
          (ledger.totalCredit ?? 0);
      });

      setLedgerMap(ledgerMap);
    }
  }, [data, location.state]);

  const handleRowClick = (ledgerId, transactionId, voucherType) => {
    navigate(
      `/previewAll/${voucherType
        .toLowerCase()
        .replace(/ /g, "-")}/${ledgerId}/transaction/${transactionId}`,
      { state: { preserveData: true } }
    );
  };

  const handlePrint = (ledgerId) => {
    console.log("ledgerId", ledgerId);
    setPrintLedgerId(ledgerId);
    setTimeout(() => {
      window.print();
      setPrintLedgerId(null);
    }, 500); // Small delay to ensure print dialog opens properly
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader size={50} color="#4A90E2" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">
          Failed to load data. Please try again later.
        </p>
      </div>
    );
  }

  if (Object.keys(ledgerMap).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">No ledger data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900 dark:text-gray-200">
      <h1 className="text-3xl font-bold text-center mb-8">Account Ledgers</h1>
      <div className="space-y-8">
        {Object.entries(ledgerMap).map(
          (
            [
              ledgerId,
              {
                name,
                openingBalance,
                totalDebit,
                totalCredit,
                closingBalance,
                entries,
              },
            ],
            index
          ) =>
            entries.length > 0 && ( // Conditional Rendering: Only render if there are entries
              <div
                key={index}
                className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800"
              >
                <div className="bg-blue-600 text-white px-6 py-4">
                  <button
                    onClick={() => handlePrint(ledgerId)}
                    className="bg-green-300 text-white px-4 py-2 rounded mt-2"
                  >
                    {name}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Description
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Voucher Number
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Voucher Type
                        </th>
                        <th className="px-4 py-2 text-right font-medium">
                          Debit
                        </th>
                        <th className="px-4 py-2 text-right font-medium">
                          Credit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                      <tr className="bg-gray-100 dark:bg-gray-900">
                        <td colSpan="4" className="px-4 py-2 font-semibold">
                          Opening Balance
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {openingBalance !== undefined
                            ? openingBalance.toFixed(2)
                            : "0.00"}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          -
                        </td>
                      </tr>
                      {entries.map((entry, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() =>
                            handleRowClick(
                              ledgerId,
                              entry.transactionId,
                              entry.voucherType
                            )
                          }
                        >
                          <td className="px-4 py-2">{entry.date}</td>
                          <td className="px-4 py-2">{entry.description}</td>
                          <td className="px-4 py-2">{entry.voucherNumber}</td>
                          <td className="px-4 py-2">{entry.voucherType}</td>
                          <td className="px-4 py-2 text-right">
                            {entry.debit ? entry.debit.toFixed(2) : "-"}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {entry.credit ? entry.credit.toFixed(2) : "-"}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 dark:bg-gray-900">
                        <td colSpan="4" className="px-4 py-2 font-semibold">
                          Total
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {totalDebit !== undefined
                            ? totalDebit.toFixed(2)
                            : "0.00"}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {totalCredit !== undefined
                            ? totalCredit.toFixed(2)
                            : "0.00"}
                        </td>
                      </tr>
                      <tr className="bg-gray-200 dark:bg-gray-800">
                        <td colSpan="4" className="px-4 py-2 font-semibold">
                          Closing Balance
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          {closingBalance !== undefined
                            ? closingBalance.toFixed(2)
                            : "0.00"}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold">
                          -
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )
        )}
      </div>

      {/* Print View */}
      {printLedgerId && (
        <div className="print-only dark:bg-gray-800 dark:text-gray-200">
          {Object.entries(ledgerMap)
            .filter(([id]) => id === printLedgerId)
            .map(
              (
                [
                  ledgerId,
                  {
                    name,
                    openingBalance,
                    totalDebit,
                    totalCredit,
                    closingBalance,
                    entries,
                  },
                ],
                index
              ) => (
                <div
                  key={index}
                  className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800"
                >
                  <div className="bg-blue-600 text-white px-6 py-4">
                    <h2 className="text-2xl font-semibold">{name}</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">
                            Date
                          </th>
                          <th className="px-4 py-2 text-left font-medium">
                            Description
                          </th>
                          <th className="px-4 py-2 text-left font-medium">
                            Voucher Number
                          </th>
                          <th className="px-4 py-2 text-left font-medium">
                            Voucher Type
                          </th>
                          <th className="px-4 py-2 text-right font-medium">
                            Debit
                          </th>
                          <th className="px-4 py-2 text-right font-medium">
                            Credit
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        <tr className="bg-gray-100 dark:bg-gray-900">
                          <td colSpan="4" className="px-4 py-2 font-semibold">
                            Opening Balance
                          </td>
                          <td className="px-4 py-2 text-right font-semibold">
                            {openingBalance !== undefined
                              ? openingBalance.toFixed(2)
                              : "0.00"}
                          </td>
                          <td className="px-4 py-2 text-right font-semibold">
                            -
                          </td>
                        </tr>
                        {entries.map((entry, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2">{entry.date}</td>
                            <td className="px-4 py-2">{entry.description}</td>
                            <td className="px-4 py-2">{entry.voucherNumber}</td>
                            <td className="px-4 py-2">{entry.voucherType}</td>
                            <td className="px-4 py-2 text-right">
                              {entry.debit ? entry.debit.toFixed(2) : "-"}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {entry.credit ? entry.credit.toFixed(2) : "-"}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 dark:bg-gray-900">
                          <td colSpan="4" className="px-4 py-2 font-semibold">
                            Total
                          </td>
                          <td className="px-4 py-2 text-right font-semibold">
                            {totalDebit !== undefined
                              ? totalDebit.toFixed(2)
                              : "0.00"}
                          </td>
                          <td className="px-4 py-2 text-right font-semibold">
                            {totalCredit !== undefined
                              ? totalCredit.toFixed(2)
                              : "0.00"}
                          </td>
                        </tr>
                        <tr className="bg-gray-200 dark:bg-gray-800">
                          <td colSpan="4" className="px-4 py-2 font-semibold">
                            Closing Balance
                          </td>
                          <td className="px-4 py-2 text-right font-semibold">
                            {closingBalance !== undefined
                              ? closingBalance.toFixed(2)
                              : "0.00"}
                          </td>
                          <td className="px-4 py-2 text-right font-semibold">
                            -
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
        </div>
      )}
    </div>
  );
};

export default App;
