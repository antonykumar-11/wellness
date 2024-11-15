import React, { useState, useEffect } from "react";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";
import { useGetAllExpenseQuery } from "../store/api/P&L";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts"; // Importing ApexCharts

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
  return groupLedgers.reduce(
    (acc, ledger) => {
      const balance = calculateLedgerBalance(ledgers, transactions, ledger._id);
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
    refetch: refetchExpenses,
  } = useGetExpensesQuery();
  const { data: trading, refetch: refetchTrading } = useGetAllExpenseQuery();
  const navigate = useNavigate();

  const [groupTotals, setGroupTotals] = useState({});

  useEffect(() => {
    refetchExpenses();
    refetchTrading();
  }, [refetchExpenses, refetchTrading]);

  const {
    totalDirectExpense = 0,
    totalDirectIncome = 0,
    totalIndirectExpense = 0,
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
    totalDirectExpense;
  const totalSales =
    totalSalesAmount -
    totalSalesTax -
    (totalSalesReturn - totalSalesReturnTax) +
    totalDirectIncome;

  const grossProfit = totalSales - totalPurchase;
  const netProfit = totalIndirectIncome - totalIndirectExpense + grossProfit;

  useEffect(() => {
    if (expenseData) {
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
        "Duties & Taxes",
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
    "Duties & Taxes",
    "Provisions",
    "Secured Loans",
    "Unsecured Loans",
    "Bank OD Accounts",
  ];

  const totalAssets = assetGroups.reduce(
    (total, group) => total + Math.abs(groupTotals[group]?.closingBalance || 0),
    0
  );

  const totalLiabilities = liabilityGroups.reduce(
    (total, group) => total + Math.abs(groupTotals[group]?.closingBalance || 0),
    0
  );

  const adjustedTotalLiabilities =
    netProfit >= 0
      ? totalLiabilities + netProfit
      : totalLiabilities - Math.abs(netProfit);

  // Prepare data for Pie Chart
  const pieChartData = [
    { name: "Total Assets", value: totalAssets },
    { name: "Total Liabilities", value: adjustedTotalLiabilities },
    { name: "Net Profit", value: netProfit },
  ];

  const handlePieClick = (group) => {
    navigate(`/admin/group-detail/${group}`);
  };

  // Define the chart options for the pie chart
  const chartOptions = {
    chart: {
      type: "pie",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedGroup = pieChartData[config.dataPointIndex].name;
          handlePieClick(selectedGroup);
        },
      },
    },
    labels: pieChartData.map((item) => item.name),
    colors: ["#1E90FF", "#32CD32", "#FFD700"],
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(2)}`,
      },
    },
    legend: {
      show: true,
      position: "bottom",
      formatter: (seriesName, opts) => {
        const legendColor = opts.w.globals.colors[opts.seriesIndex];
        // Add inline style for legend color based on dark or light mode
        const modeClass = document.documentElement.classList.contains("dark")
          ? "text-gray-100"
          : "text-gray-900";
        return `<span class="${modeClass}" style="color: ${legendColor};">${seriesName}</span>`;
      },
    },
  };
  const chartSeries = pieChartData.map((item) => item.value);

  return (
    <div className="bg-[#87CEFA] bg-opacity-70 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 dark:bg-gray-900">
      <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
        Balance Sheet
      </h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading data</p>}
      {!isLoading && !error && (
        <div className="h-80">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="pie"
            height="100%"
          />
        </div>
      )}
    </div>
  );
};

export default BalanceSheet;
