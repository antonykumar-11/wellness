import React, { useState, useEffect } from "react";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";
import { useGetAllExpenseQuery } from "../store/api/P&L";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// Helper function to calculate ledger balance
const calculateLedgerBalance = (ledgers, transactions, ledgerId) => {
  const ledger = ledgers.find((ledger) => ledger._id === ledgerId);
  if (!ledger)
    return { openingBalance: 0, totalTransactions: 0, closingBalance: 0 };

  const isAsset = [
    "Bank Accounts",
    "Cash-in-Hand",
    "Fixed Assets",
    "Sundry Debtors",
    "Investments",
    "Miscellaneous Expenses (Asset)",
    "Stock-in-Hand",
    "Loans & Advances (Asset)",
    "Deposits (Asset)",
  ].includes(ledger.group);

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

// Helper function to calculate group balance
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
  const {
    data: expenseData,
    isLoading,
    error,
    refetch: refeches,
  } = useGetExpensesQuery();

  const { data: trading, refetch } = useGetAllExpenseQuery();
  const navigate = useNavigate();

  const [groupTotals, setGroupTotals] = useState({});
  useEffect(() => {
    refeches();
    refetch();
  }, [refeches, refetch]);

  const {
    totalDirectExpense = 0,
    totalDirectIncome = 0,
    totalIndirectExpense = 0,
    totalIndirectExpenseTax = 0,
    totalIndirectIncome = 0,
    totalPurchaseAmount = 0,
    totalPurchaseReturn = 0,
    totalPurchaseReturnTax = 0,
    totalPurchaseTax = 0,
    totalSalesAmount = 0,
    totalSalesReturn = 0,
    totalSalesReturnTax = 0,
    totalSalesTax = 0,
  } = trading || {};

  const totalPurchase =
    totalPurchaseAmount -
    totalPurchaseTax -
    (totalPurchaseReturn - totalPurchaseReturnTax) +
    totalDirectExpense -
    totalIndirectExpenseTax;
  const totalSales =
    totalSalesAmount -
    totalSalesTax -
    (totalSalesReturn - totalSalesReturnTax) +
    totalDirectIncome;

  const grossProfit = totalSales - totalPurchase;
  const netProfit = totalIndirectIncome - totalIndirectExpense + grossProfit;

  useEffect(() => {
    if (expenseData && expenseData.transactions && expenseData.ledgers) {
      const { transactions, ledgers } = expenseData;
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
        "Current Assets",
        "Investments",

        "Miscellaneous Expenses (Asset)",
        "Stock-in-Hand",
        "Loans & Advances (Asset)",
        "Deposits (Asset)",

        "Provisions",
        "Secured Loans",
        "Unsecured Loans",
        "Bank OD Accounts",
        "Withdrawals",
      ];

      const newGroupTotals = groups.reduce((acc, group) => {
        acc[group] = getGroupBalance(ledgers, transactions, group);
        return acc;
      }, {});

      setGroupTotals(newGroupTotals);
    }
  }, [expenseData]);

  const assetGroups = [
    "Bank Accounts",
    "Cash-in-Hand",
    "Fixed Assets",
    "Current Assets",
    "Sundry Debtors",
    "Investments",
    "Miscellaneous Expenses (Asset)",
    "Stock-in-Hand",
    "Loans & Advances (Asset)",
    "Deposits (Asset)",
  ];

  const liabilityGroups = [
    "Capital Account",
    "Reserves & Surplus",
    "Sundry Creditors",
    "Loans (Liability)",
    "Current Liabilities",

    "Provisions",
    "Secured Loans",
    "Unsecured Loans",
    "Bank OD Accounts",
  ];
  if (!expenseData || !expenseData.ledgers || !expenseData.transactions) {
    return <div>No data available</div>;
  }

  const { ledgers, transactions } = expenseData;

  // Get all groups where group is "Duties & Taxes"
  const groups = ledgers.filter((group) => group.group === "Duties & Taxes");

  // Extract all _id values
  const groupIds = groups.map((group) => group._id);
  console.log("groupIds", groupIds);
  let creditTaxAmount = 0;
  let debitTaxAmount = 0;

  transactions.forEach((transaction) => {
    console.log("transaction", transaction);
    // Check if the creditLedger is in the groupIds array
    if (groupIds.includes(transaction.creditLedger)) {
      creditTaxAmount += transaction.creditAmount || 0; // Add credit amount if it's a tax
    }

    // Check if the debitLedger is in the groupIds array
    if (groupIds.includes(transaction.debitLedger)) {
      debitTaxAmount += transaction.debitAmount || 0; // Add debit amount if it's a tax
    }
  });
  console.log("creditTaxAmount:", creditTaxAmount);
  console.log(" debitTaxAmount:", debitTaxAmount);
  let inputTax;
  let outputTax;

  if (creditTaxAmount > debitTaxAmount) {
    // Credit is higher
    outputTax = creditTaxAmount - debitTaxAmount; // Calculate output tax
    inputTax = 0; // No input tax
  } else if (debitTaxAmount > creditTaxAmount) {
    // Debit is higher
    inputTax = debitTaxAmount - creditTaxAmount; // Calculate input tax
    outputTax = 0; // No output tax
  } else {
    // Both are equal
    inputTax = 0; // No input tax
    outputTax = 0; // No output tax
  }

  // Output the results

  console.log("Input Tax:", inputTax);
  console.log("Output Tax:", outputTax);

  // Calculate total assets and liabilities
  const totalAssets = assetGroups.reduce(
    (total, group) => total + Math.abs(groupTotals[group]?.closingBalance || 0),
    0
  );
  console.log(" totalAssets", totalAssets);

  const totalLiabilities = liabilityGroups.reduce(
    (total, group) => total + Math.abs(groupTotals[group]?.closingBalance || 0),
    0
  );
  console.log;
  // Display net profit or loss correctly
  const netProfitDisplay = netProfit >= 0 ? netProfit : 0;
  const netLossDisplay = netProfit < 0 ? Math.abs(netProfit) : 0;
  // Calculate the difference and adjust the assets or liabilities
  const veryProfit = totalAssets + netLossDisplay + inputTax;
  const veryLoss = totalLiabilities + netProfitDisplay + outputTax;
  const balanceDifference = veryLoss - veryProfit;

  console.log("veryProfit  ", veryProfit);
  console.log("veryLoss", veryLoss);
  console.log("balanceDifference", balanceDifference);
  const adjustedTotalAssets =
    veryProfit + (balanceDifference > 0 ? balanceDifference : 0); // Add difference to assets if liabilities are greater
  console.log("adjustedTotalAssets", adjustedTotalAssets);
  const adjustedTotalLiabilities =
    veryLoss + (balanceDifference < 0 ? Math.abs(balanceDifference) : 0); // Add difference to liabilities if assets are greater
  console.log("adjustedTotalLiabilities", adjustedTotalLiabilities);

  // Adjusted total liabilities and assets for display
  const finalAdjustedTotalAssets = adjustedTotalAssets; // Add loss to assets
  const finalAdjustedTotalLiabilities = adjustedTotalLiabilities; // Add profit to liabilities

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading data.</p>;

  const handleItemClick = (group) => {
    navigate(`/admin/group-detail/${group}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white border-b pb-2">
          Over View
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Assets
          </h2>
          <ul className="space-y-2">
            {assetGroups.map((group) => (
              <li
                key={group}
                className="flex justify-between py-1 text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleItemClick(group)}
              >
                <span>{group}:</span>
                <span>
                  {groupTotals[group]?.closingBalance?.toFixed(2) || 0}
                </span>
              </li>
            ))}

            {inputTax > 0 ? (
              <li
                className="flex justify-between py-1 text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleItemClick("Duties%20&%20Taxes")}
              >
                <span>Input Tax:</span>
                <span>{inputTax.toFixed(2)}</span>
              </li>
            ) : null}

            {netLossDisplay > 0 ? (
              <Link to="/admin/profitandloss">
                <li className="flex justify-between py-1 font-medium">
                  <span>Net Loss:</span>
                  <span>{netLossDisplay.toFixed(2)}</span>
                </li>
              </Link>
            ) : null}

            {balanceDifference > 0 ? (
              <li className="flex justify-between py-1 font-medium">
                <span>Difference Opening:</span>
                <span className="text-green-500">
                  {Math.abs(balanceDifference).toFixed(2)}
                </span>
              </li>
            ) : null}
          </ul>

          {/* Total Assets Section */}
          <div className="flex justify-between mt-4 mb-4 font-medium text-gray-700 dark:text-gray-300">
            <span>Total Assets:</span>
            <span>
              <span>{finalAdjustedTotalAssets.toFixed(2)}</span>
            </span>
          </div>
        </div>

        {/* Liabilities */}
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Liabilities
          </h2>
          <ul className="space-y-2">
            {liabilityGroups.map((group) => (
              <li
                key={group}
                className="flex justify-between py-1 text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleItemClick(group)}
              >
                <span>{group}:</span>
                <span>
                  {groupTotals[group]?.closingBalance?.toFixed(2) || 0}
                </span>
              </li>
            ))}
            {outputTax > 0 ? (
              <li
                className="flex justify-between py-1 text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleItemClick("Duties%20&%20Taxes")}
              >
                <span>outputTax</span>
                <span>{outputTax.toFixed(2)}</span>
              </li>
            ) : null}
            {netProfitDisplay > 0 ? (
              <Link to="/admin/profitandloss">
                <li className="flex justify-between py-1 font-medium">
                  <span>Net Profit:</span>
                  <span>{netProfitDisplay.toFixed(2)}</span>
                </li>
              </Link>
            ) : null}
            {balanceDifference < 0 ? (
              <li className="flex justify-between py-1 font-medium">
                <span className="text-lg">Difference:</span>
                <span className="font-bold text-red-500">
                  {balanceDifference.toFixed(2)}
                </span>
              </li>
            ) : null}
          </ul>

          {/* Total Liabilities Section */}
          <div className="flex justify-between mt-4 mb-4 font-medium text-gray-700 dark:text-gray-300">
            <span>Total Liabilities:</span>
            <span>{finalAdjustedTotalLiabilities.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
