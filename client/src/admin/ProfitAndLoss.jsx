import React from "react";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";

const ProfitAndLoss = () => {
  const { data: { transactions = [], ledgers = [] } = {} } =
    useGetExpensesQuery();

  // Initialize ledger map
  const ledgerMap = {};
  ledgers.forEach((ledger) => {
    ledgerMap[ledger._id] = {
      name: ledger.name || "",
      group: ledger.group || "",
      openingBalance: ledger.openingBalance || 0,
      totalDebit: ledger.totalDebit || 0,
      totalCredit: ledger.totalCredit || 0,
    };
  });

  // Process transactions
  transactions.forEach((transaction) => {
    const {
      debitLedger: debitLedgerId,
      creditLedger: creditLedgerId,
      debitAmount = 0,
      creditAmount = 0,
    } = transaction;

    if (ledgerMap[debitLedgerId]) {
      ledgerMap[debitLedgerId].totalDebit += debitAmount;
    }

    if (ledgerMap[creditLedgerId]) {
      ledgerMap[creditLedgerId].totalCredit += creditAmount;
    }
  });

  // Initialize variables for amounts
  let totalPurchase = 0;
  let totalPurchaseReturn = 0;
  let totalDirectExpenses = 0;
  let totalSales = 0;
  let totalSalesReturn = 0;
  let totalDirectIncome = 0;
  let totalIndirectExpenses = 0;
  let totalIndirectIncome = 0;

  // Calculate amounts
  Object.values(ledgerMap).forEach((ledger) => {
    const { group, totalDebit, totalCredit } = ledger;

    if (group === "Purchase Accounts") {
      totalPurchase += totalDebit;
    } else if (group === "Purchase Return") {
      totalPurchaseReturn += totalCredit;
    } else if (group === "Indirect Expenses") {
      totalIndirectExpenses += totalDebit;
    } else if (group === "Sales Accounts") {
      totalSales += totalCredit;
    } else if (group === "Sales Return") {
      totalSalesReturn += totalDebit;
    } else if (group === "Direct Income") {
      totalDirectIncome += totalCredit;
    } else if (group === "Direct Expenses") {
      totalDirectExpenses += totalDebit;
    } else if (group === "Indirect Incomes") {
      totalIndirectIncome += totalCredit;
    }
  });

  // Calculate Gross Profit and Net Profit
  const totalDebit =
    totalPurchase -
    totalPurchaseReturn +
    totalDirectExpenses +
    totalSalesReturn;
  const totalCredit = totalSales + totalDirectIncome;
  const grossProfit = totalCredit - totalDebit;
  const netProfit = grossProfit + totalIndirectIncome - totalIndirectExpenses;

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
              <li className="flex justify-between">
                <span>Purchase Accounts</span>
                <span className="font-semibold">
                  {totalPurchase.toFixed(2)}
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
                  {totalDirectExpenses.toFixed(2)}
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
                  {totalDirectIncome.toFixed(2)}
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
                  {totalIndirectExpenses.toFixed(2)}
                </span>
              </li>
              <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
                <span>Total Debit</span>
                <span>{totalIndirectExpenses.toFixed(2)}</span>
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
                  {totalIndirectIncome.toFixed(2)}
                </span>
              </li>
              <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
                <span>Total Credit</span>
                <span>{totalIndirectIncome.toFixed(2)}</span>
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
