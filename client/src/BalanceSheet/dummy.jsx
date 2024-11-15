// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";
// import { useProfitLoss } from "../BalanceSheet/ProfitAndLossProvider";

// const ProfitAndLoss = () => {
//   const navigate = useNavigate();
//   const { data: { transactions = [], ledgers = [] } = {} } =
//     useGetExpensesQuery();
//   console.log("transactions", transactions);
//   console.log("ledgers", ledgers);
//   const { setProfitOrLoss } = useProfitLoss();

//   // Initialize ledger map
//   const ledgerMap = {};
//   ledgers.forEach((ledger) => {
//     ledgerMap[ledger._id] = {
//       name: ledger.name || "",
//       group: ledger.group || "",
//       openingBalance: ledger.openingBalance || 0,
//       totalDebit: ledger.totalDebit || 0,
//       totalCredit: ledger.totalCredit || 0,
//     };
//   });

//   // Initialize variables
//   let totalTax = 0;

//   // Process transactions
//   transactions.forEach((transaction) => {
//     const {
//       debitLedger: debitLedgerId,
//       creditLedger: creditLedgerId,
//       debitAmount = 0,
//       creditAmount = 0,
//     } = transaction;

//     if (ledgerMap[debitLedgerId]) {
//       ledgerMap[debitLedgerId].totalDebit += debitAmount;
//     }

//     if (ledgerMap[creditLedgerId]) {
//       ledgerMap[creditLedgerId].totalCredit += creditAmount;
//     }

//     // Update tax calculation
//     if (
//       ledgerMap[debitLedgerId] &&
//       ledgerMap[debitLedgerId].group === "Duties & Taxes"
//     ) {
//       totalTax += debitAmount;
//     }

//     if (
//       ledgerMap[creditLedgerId] &&
//       ledgerMap[creditLedgerId].group === "Duties & Taxes"
//     ) {
//       totalTax -= creditAmount;
//     }
//   });

//   // Initialize amounts
//   let totalPurchase = 0;
//   let totalPurchaseReturn = 0;
//   let totalDirectExpenses = 0;
//   let totalSales = 0;
//   let totalSalesReturn = 0;
//   let totalDirectIncome = 0;
//   let totalIndirectExpenses = 0;
//   let totalIndirectIncome = 0;

//   // Calculate amounts
//   Object.values(ledgerMap).forEach((ledger) => {
//     const { group, totalDebit, totalCredit } = ledger;

//     if (group === "Purchase Accounts") {
//       totalPurchase += totalDebit;
//     } else if (group === "Purchase Return") {
//       totalPurchaseReturn += totalCredit;
//     } else if (group === "Indirect Expenses") {
//       totalIndirectExpenses += totalDebit;
//     } else if (group === "Sales Accounts") {
//       totalSales += totalCredit;
//     } else if (group === "Sales Return") {
//       totalSalesReturn += totalDebit;
//     } else if (group === "Direct Income") {
//       totalDirectIncome += totalCredit;
//     } else if (group === "Direct Expenses") {
//       totalDirectExpenses += totalDebit;
//     } else if (group === "Indirect Incomes") {
//       totalIndirectIncome += totalCredit;
//     }
//   });

//   // Adjust total purchase by subtracting tax
//   const adjustedTotalPurchase = totalPurchase - totalTax;

//   // Calculate Gross Profit and Net Profit
//   const totalDebit =
//     adjustedTotalPurchase - totalPurchaseReturn + totalDirectExpenses;
//   const totalCredit = totalSales + totalDirectIncome;
//   const grossProfit = totalCredit - totalDebit;
//   const netProfit = grossProfit + totalIndirectIncome - totalIndirectExpenses;

//   useEffect(() => {
//     setProfitOrLoss(netProfit);
//   }, [netProfit, setProfitOrLoss]);

//   // Click handler to redirect
//   const handlePurchaseClick = () => {
//     navigate(`/preview/group-detailsed/purchase-accounts`);
//   };

//   return (
//     <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
//         Profit and Loss Account
//       </h1>
//       <div className="flex flex-col md:flex-row">
//         {/* Debit Side */}
//         <div className="flex-1 mb-4 md:mb-0">
//           <h2 className="text-xl font-semibold text-blue-600 mb-2">
//             Debit Side
//           </h2>
//           <div className="bg-white shadow-md rounded-lg p-4">
//             <ul className="space-y-2">
//               <li
//                 className="flex justify-between cursor-pointer"
//                 onClick={handlePurchaseClick}
//               >
//                 <span>Purchase Accounts</span>
//                 <span className="font-semibold">
//                   {adjustedTotalPurchase.toFixed(2)}
//                 </span>
//               </li>
//               <li className="flex justify-between">
//                 <span>Purchase Return</span>
//                 <span className="font-semibold">
//                   {totalPurchaseReturn.toFixed(2)}
//                 </span>
//               </li>
//               <li className="flex justify-between">
//                 <span>Direct Expenses</span>
//                 <span className="font-semibold">
//                   {totalDirectExpenses.toFixed(2)}
//                 </span>
//               </li>

//               <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
//                 <span>Total Debit</span>
//                 <span>{totalDebit.toFixed(2)}</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Credit Side */}
//         <div className="flex-1">
//           <h2 className="text-xl font-semibold text-blue-600 mb-2">
//             Credit Side
//           </h2>
//           <div className="bg-white shadow-md rounded-lg p-4">
//             <ul className="space-y-2">
//               <li className="flex justify-between">
//                 <span>Sales Accounts</span>
//                 <span className="font-semibold">{totalSales.toFixed(2)}</span>
//               </li>
//               <li className="flex justify-between">
//                 <span>Sales Return</span>
//                 <span className="font-semibold">
//                   {totalSalesReturn.toFixed(2)}
//                 </span>
//               </li>
//               <li className="flex justify-between">
//                 <span>Direct Income</span>
//                 <span className="font-semibold">
//                   {totalDirectIncome.toFixed(2)}
//                 </span>
//               </li>

//               <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
//                 <span>Total Credit</span>
//                 <span>{totalCredit.toFixed(2)}</span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Gross Profit / Loss */}
//       <div className="mt-6">
//         <div className="bg-white shadow-md rounded-lg p-4">
//           <div className="flex justify-between font-semibold">
//             <span>Gross Profit / Loss</span>
//             <span
//               className={grossProfit >= 0 ? "text-green-600" : "text-red-600"}
//             >
//               {grossProfit.toFixed(2)}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Indirect Expenses and Income */}
//       <div className="flex flex-col md:flex-row mt-6">
//         {/* Indirect Expenses */}
//         <div className="flex-1 mb-4 md:mb-0">
//           <h2 className="text-xl font-semibold text-blue-600 mb-2">
//             Indirect Expenses
//           </h2>
//           <div className="bg-white shadow-md rounded-lg p-4">
//             <ul className="space-y-2">
//               <li className="flex justify-between">
//                 <span>Indirect Expenses</span>
//                 <span className="font-semibold">
//                   {totalIndirectExpenses.toFixed(2)}
//                 </span>
//               </li>
//               <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
//                 <span>Total Debit</span>
//                 <span>{totalIndirectExpenses.toFixed(2)}</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Indirect Income */}
//         <div className="flex-1">
//           <h2 className="text-xl font-semibold text-blue-600 mb-2">
//             Indirect Income
//           </h2>
//           <div className="bg-white shadow-md rounded-lg p-4">
//             <ul className="space-y-2">
//               <li className="flex justify-between">
//                 <span>Indirect Income</span>
//                 <span className="font-semibold">
//                   {totalIndirectIncome.toFixed(2)}
//                 </span>
//               </li>
//               <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
//                 <span>Total Credit</span>
//                 <span>{totalIndirectIncome.toFixed(2)}</span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Net Profit / Loss */}
//       <div className="mt-6">
//         <div className="bg-white shadow-md rounded-lg p-4">
//           <div className="flex justify-between font-semibold">
//             <span>Net Profit / Loss</span>
//             <span
//               className={netProfit >= 0 ? "text-green-600" : "text-red-600"}
//             >
//               {netProfit.toFixed(2)}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfitAndLoss;
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProfitAndLossQuery } from "../store/api/P&L";
import { useProfitLoss } from "../BalanceSheet/ProfitAndLossProvider";

const ProfitAndLoss = () => {
  const navigate = useNavigate();

  const { setProfitOrLoss } = useProfitLoss();

  const { data: { transactions = [], ledgers = [] } = {} } =
    useGetProfitAndLossQuery();
  console.log("transactions", transactions);
  // Initialize variables for totals
  let totalIndirectIncome = 0;
  let totalIndirectIncomeTax = 0;
  let totalDirectIncome = 0;
  let totalDirectIncomeTax = 0;
  let totalDirectExpenses = 0;
  let totalDirectExpensesTax = 0;
  let totalIndirectExpenses = 0;
  let totalIndirectExpensesTax = 0;
  let totalSalesAmount = 0;
  let totalSalesTax = 0;
  let totalPurchaseAmount = 0;
  let totalPurchaseTax = 0;
  let totalSalesReturnAmount = 0;
  let totalSalesReturnTax = 0;
  let totalPurchaseReturnAmount = 0;
  let totalPurchaseReturnTax = 0;

  // Initialize ledger map
  const ledgerMap = {};

  // Initialize sets for different group IDs
  const taxGroupIds = new Set();
  const indirectIncomeGroupIds = new Set();
  const directIncomeGroupIds = new Set();
  const directExpenseGroupIds = new Set();
  const indirectExpenseGroupIds = new Set();
  const salesAccountGroupIds = new Set(); // Define for Sales Account
  const purchaseGroupIds = new Set(); // Define for Purchase Account
  const salesReturnGroupIds = new Set(); // Define for Sales Return
  const purchaseReturnGroupIds = new Set(); // Define for Purchase Return

  // Map through ledgers to populate the group ID sets
  ledgers.forEach((ledger) => {
    ledgerMap[ledger._id] = {
      name: ledger.name || "",
      group: ledger.group || "",
      openingBalance: ledger.openingBalance || 0,
      totalDebit: ledger.totalDebit || 0,
      totalCredit: ledger.totalCredit || 0,
    };

    // Add group IDs based on ledger group
    switch (ledger.group) {
      case "Indirect Incomes":
        indirectIncomeGroupIds.add(ledger._id);
        break;
      case "Direct Incomes":
        directIncomeGroupIds.add(ledger._id);
        break;
      case "Direct Expenses":
        directExpenseGroupIds.add(ledger._id);
        break;
      case "Indirect Expenses":
        indirectExpenseGroupIds.add(ledger._id);
        break;
      case "Duties & Taxes":
        taxGroupIds.add(ledger._id);
        break;
      case "Sales Accounts": // Example case for Sales Accounts
        salesAccountGroupIds.add(ledger._id);
        break;
      case "Purchase Accounts": // Example case for Purchase Accounts
        purchaseGroupIds.add(ledger._id);
        break;
      case "Sales Return": // Example case for Sales Returns
        salesReturnGroupIds.add(ledger._id);
        break;
      case "Purchase Return": // Example case for Purchase Returns
        purchaseReturnGroupIds.add(ledger._id);
        break;
      default:
        break;
    }
  });

  // Process transactions
  transactions.forEach((transaction) => {
    const { debitLedgers = [], creditLedgers = [], voucherType } = transaction;

    // Process for Receipt Voucher (Indirect Income)
    if (voucherType === "Receipt Voucher") {
      let hasRelevantCredit = false;

      // Process credit ledgers for Indirect Income
      creditLedgers.forEach(({ ledgerId, amount }) => {
        const ledger = ledgerMap[ledgerId];

        if (ledger && indirectIncomeGroupIds.has(ledgerId)) {
          totalIndirectIncome += amount || 0;
          hasRelevantCredit = true;
        }
      });

      // If there was any relevant credit, process taxes
      if (hasRelevantCredit) {
        creditLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalIndirectIncomeTax += amount || 0;
          }
        });

        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalIndirectIncomeTax += amount || 0;
          }
        });
      }
    }

    // Process for Sales Voucher
    // Process for Sales Voucher
    if (voucherType === "Sales Voucher") {
      let hasSalesAccountCredit = false;
      let hasDirectIncomeCredit = false;

      // Process credit ledgers for Sales Account
      creditLedgers.forEach(({ ledgerId, amount }) => {
        const ledger = ledgerMap[ledgerId];
        if (ledger && salesAccountGroupIds.has(ledgerId)) {
          totalSalesAmount += amount || 0;
          hasSalesAccountCredit = true;
        }

        // Process credit ledgers for Direct Income
        if (ledger && directIncomeGroupIds.has(ledgerId)) {
          totalDirectIncome += amount || 0;
          hasDirectIncomeCredit = true;
        }
      });

      // Process taxes if there were any sales account credits or direct income credits
      if (hasSalesAccountCredit || hasDirectIncomeCredit) {
        creditLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            if (hasSalesAccountCredit) {
              totalSalesTax += amount || 0;
            }
            if (hasDirectIncomeCredit) {
              totalDirectIncomeTax += amount || 0;
            }
          }
        });

        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            if (hasSalesAccountCredit) {
              totalSalesTax += amount || 0;
            }
            if (hasDirectIncomeCredit) {
              totalDirectIncomeTax += amount || 0;
            }
          }
        });
      }
    }

    // Process for Sales Return
    if (voucherType === "CreditNote") {
      let hasSalesReturnCredit = false;

      debitLedgers.forEach(({ ledgerId, amount }) => {
        const ledger = ledgerMap[ledgerId];

        if (ledger && salesReturnGroupIds.has(ledgerId)) {
          totalSalesReturnAmount += amount || 0;
          hasSalesReturnCredit = true;
        }
      });

      if (hasSalesReturnCredit) {
        creditLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalSalesReturnTax += amount || 0;
          }
        });

        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalSalesReturnTax += amount || 0;
          }
        });
      }
    }

    // Process for Purchase Voucher
    if (voucherType === "Purchase Voucher") {
      let hasPurchaseAccountDebit = false;
      let hasDirectExpenseDebit = false;

      debitLedgers.forEach(({ ledgerId, amount }) => {
        const ledger = ledgerMap[ledgerId];

        if (ledger && purchaseGroupIds.has(ledgerId)) {
          totalPurchaseAmount += amount || 0;
          hasPurchaseAccountDebit = true;
        }

        if (ledger && directExpenseGroupIds.has(ledgerId)) {
          totalDirectExpenses += amount || 0;
          hasDirectExpenseDebit = true;
        }
      });

      if (hasPurchaseAccountDebit || hasDirectExpenseDebit) {
        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalPurchaseTax += amount || 0;
          }
        });

        creditLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalPurchaseTax += amount || 0;
          }
        });
      }

      if (hasDirectExpenseDebit) {
        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalDirectExpensesTax += amount || 0;
          }
        });

        creditLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalDirectExpensesTax += amount || 0;
          }
        });
      }
    }

    // Process for Purchase Return
    if (voucherType === "DebitNote") {
      let hasPurchaseReturnDebit = false;

      creditLedgers.forEach(({ ledgerId, amount }) => {
        const ledger = ledgerMap[ledgerId];

        if (ledger && purchaseReturnGroupIds.has(ledgerId)) {
          totalPurchaseReturnAmount += amount || 0;
          hasPurchaseReturnDebit = true;
        }
      });

      if (hasPurchaseReturnDebit) {
        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];

          if (ledger && taxGroupIds.has(ledgerId)) {
            totalPurchaseReturnTax += amount || 0;
          }
        });

        creditLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalPurchaseReturnTax += amount || 0;
          }
        });
      }
    }

    // Process for Payment Voucher
    if (voucherType === "Payment Voucher") {
      let hasIndirectExpenseDebit = false;

      debitLedgers.forEach(({ ledgerId, amount }) => {
        const ledger = ledgerMap[ledgerId];
        if (ledger && indirectExpenseGroupIds.has(ledgerId)) {
          totalIndirectExpenses += amount || 0;
          hasIndirectExpenseDebit = true;
        }
      });

      if (hasIndirectExpenseDebit) {
        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalIndirectExpensesTax += amount || 0;
          }
        });
      }
    }
  });

  useEffect(() => {
    setProfitOrLoss({
      indirectIncome: totalIndirectIncome,
      indirectIncomeTax: totalIndirectIncomeTax,
      directIncome: totalDirectIncome,
      directIncomeTax: totalDirectIncomeTax,
      directExpenses: totalDirectExpenses,
      directExpensesTax: totalDirectExpensesTax,
      indirectExpenses: totalIndirectExpenses,
      indirectExpensesTax: totalIndirectExpensesTax,
      salesAmount: totalSalesAmount,
      salesTax: totalSalesTax,
      purchaseAmount: totalPurchaseAmount,
      purchaseTax: totalPurchaseTax,
      salesReturnAmount: totalSalesReturnAmount,
      salesReturnTax: totalSalesReturnTax,
      purchaseReturnAmount: totalPurchaseReturnAmount,
      purchaseReturnTax: totalPurchaseReturnTax,
    });
  }, [
    totalIndirectIncome,
    totalIndirectIncomeTax,
    totalDirectIncome,
    totalDirectIncomeTax,
    totalDirectExpenses,
    totalDirectExpensesTax,
    totalIndirectExpenses,
    totalIndirectExpensesTax,
    totalSalesAmount,
    totalSalesTax,
    totalPurchaseAmount,
    totalPurchaseTax,
    totalSalesReturnAmount,
    totalSalesReturnTax,
    totalPurchaseReturnAmount,
    totalPurchaseReturnTax,
    setProfitOrLoss,
  ]);

  let adjustedTotalPurchase = totalPurchaseAmount - totalPurchaseTax;
  let totalPurchaseReturn = totalPurchaseReturnAmount - totalPurchaseReturnTax;
  let totalDirectExpensess = totalDirectExpenses - totalDirectExpensesTax;
  let totalDebit =
    adjustedTotalPurchase - totalPurchaseReturn + totalDirectExpensess;
  let totalSales = totalSalesAmount - totalSalesTax;
  let totalSalesReturn = totalSalesReturnAmount - totalSalesReturnTax;
  let totalDirectIncomes = totalDirectIncome - totalIndirectIncomeTax;
  let totalCredit = totalSales - totalSalesReturn + totalDirectIncomes;
  let grossProfit = totalCredit - totalDebit;
  let totalIndirectExpensess = totalDirectExpenses - totalDirectExpensesTax;
  let totalIndirectIncomes = totalIndirectIncome - totalIndirectIncomeTax;
  let netProfit = grossProfit + totalIndirectIncomes - totalIndirectExpensess;
  // Click handler to redirect
  const handlePurchaseClick = () => {
    navigate(`/preview/group-detailsed/purchase-accounts`);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
        Profit and Loss Account
      </h1>
      <div className="flex flex-col md:flex-row">
        {/* Debit Side */}
        <div className="flex-1 mb-4 md:mb-0">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Debit Side
          </h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <ul className="space-y-2">
              <li
                className="flex justify-between cursor-pointer"
                onClick={handlePurchaseClick}
              >
                <span>Purchase Accounts</span>
                <span className="font-semibold">
                  {adjustedTotalPurchase.toFixed(2)}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Purchase Return</span>
                <span className="font-semibold">
                  {totalPurchaseReturn.toFixed(2)}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Direct Expenses</span>
                <span className="font-semibold">
                  {totalDirectExpensess.toFixed(2)}
                </span>
              </li>

              <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
                <span>Total Debit</span>
                <span>{totalDebit.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Credit Side */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Credit Side
          </h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Sales Accounts</span>
                <span className="font-semibold">{totalSales.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Sales Return</span>
                <span className="font-semibold">
                  {totalSalesReturn.toFixed(2)}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Direct Income</span>
                <span className="font-semibold">
                  {totalDirectIncomes.toFixed(2)}
                </span>
              </li>

              <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
                <span>Total Credit</span>
                <span>{totalCredit.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gross Profit / Loss */}
      <div className="mt-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between font-semibold">
            <span>Gross Profit / Loss</span>
            <span
              className={grossProfit >= 0 ? "text-green-600" : "text-red-600"}
            >
              {grossProfit.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Indirect Expenses and Income */}
      <div className="flex flex-col md:flex-row mt-6">
        {/* Indirect Expenses */}
        <div className="flex-1 mb-4 md:mb-0">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Indirect Expenses
          </h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Indirect Expenses</span>
                <span className="font-semibold">
                  {totalIndirectExpensess.toFixed(2)}
                </span>
              </li>
              <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
                <span>Total Debit</span>
                <span>{totalIndirectExpensess.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Indirect Income */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Indirect Income
          </h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Indirect Income</span>
                <span className="font-semibold">
                  {totalIndirectIncomes.toFixed(2)}
                </span>
              </li>
              <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
                <span>Total Credit</span>
                <span>{totalIndirectIncomes.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Net Profit / Loss */}
      <div className="mt-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between font-semibold">
            <span>Net Profit / Loss</span>
            <span
              className={netProfit >= 0 ? "text-green-600" : "text-red-600"}
            >
              {netProfit.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitAndLoss;
