import React, { useEffect, useState } from "react";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";
import Chart from "react-apexcharts"; // Importing ApexCharts
import { useNavigate } from "react-router-dom";

const groups = ["Direct Expenses", "Indirect Expenses", "Purchase Accounts"];

const colors = [
  "#1E90FF",
  "#32CD32",
  "#FFD700",
  "#FF4500",
  "#8A2BE2",
  "#FF69B4",
  "#DC143C",
  "#00FA9A",
  "#FF6347",
  "#7B68EE",
];

const CategoryDistributionChart = ({ groupTotals }) => {
  const navigate = useNavigate();

  // Handle pie chart click
  const handlePieClick = (group) => {
    navigate(`/admin/group-detail/${group}`);
  };

  // Prepare data for the pie chart, ensuring all groups are included
  const pieChartData = groups.map((group) => ({
    name: group,
    value: groupTotals[group]?.closingBalance || 0, // Use closing balance for each group
  }));

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
    colors, // The colors for the pie chart sections
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(2)}`,
      },
    },
    legend: {
      show: true,
      position: "bottom",
      formatter: (seriesName, opts) => {
        const legendColor = colors[opts.seriesIndex];
        // Add inline style for legend color based on dark or light mode
        const modeClass = document.documentElement.classList.contains("dark")
          ? "text-gray-100"
          : "text-gray-900";
        return `<span class="${modeClass}" style="color: ${legendColor};">${seriesName}</span>`;
      },
    },
  };

  const series = pieChartData.map((item) => Math.abs(item.value));

  return (
    <div className="bg-[#87CEFA] bg-opacity-70 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 dark:bg-gray-900">
      <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
        Expenses
      </h2>
      <div className="h-80">
        <Chart
          options={chartOptions}
          series={series}
          type="pie"
          height="100%"
        />
      </div>
    </div>
  );
};

const AllHeads = () => {
  const { data: { transactions = [], ledgers = [] } = {}, refetch } =
    useGetExpensesQuery();
  const [groupTotals, setGroupTotals] = useState({});

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (transactions.length > 0 || ledgers.length > 0) {
      const newLedgerMap = {};

      // Initialize ledgers
      ledgers.forEach((ledger) => {
        const openingBalance =
          ledger.nature === "Credit"
            ? -ledger.openingBalance
            : ledger.openingBalance;
        newLedgerMap[ledger._id] = {
          name: ledger.name || "",
          group: ledger.group || "",
          nature: ledger.nature || "",
          openingBalance,
          totalDebit: 0,
          totalCredit: 0,
          closingBalance: openingBalance,
        };
      });

      // Process transactions
      transactions.forEach((transaction) => {
        const { debitLedger, debitAmount, creditLedger, creditAmount } =
          transaction;
        const formattedDebitAmount =
          typeof debitAmount === "number" ? debitAmount : 0;
        const formattedCreditAmount =
          typeof creditAmount === "number" ? creditAmount : 0;

        // Update closing balance for debit ledger
        if (newLedgerMap[debitLedger]) {
          newLedgerMap[debitLedger].closingBalance +=
            newLedgerMap[debitLedger].nature === "Credit"
              ? -formattedDebitAmount
              : formattedDebitAmount;
          newLedgerMap[debitLedger].totalDebit += formattedDebitAmount;
        }

        // Update closing balance for credit ledger
        if (newLedgerMap[creditLedger]) {
          newLedgerMap[creditLedger].closingBalance +=
            newLedgerMap[creditLedger].nature === "Credit"
              ? formattedCreditAmount
              : -formattedCreditAmount;
          newLedgerMap[creditLedger].totalCredit += formattedCreditAmount;
        }
      });

      // Calculate group totals, ensuring all groups are included
      const newGroupTotals = groups.reduce((acc, group) => {
        const ledgerIds = ledgers
          .filter((ledger) => ledger.group === group)
          .map((ledger) => ledger._id);

        const totalDebit = ledgerIds.reduce(
          (total, ledgerId) =>
            total + (newLedgerMap[ledgerId]?.totalDebit || 0),
          0
        );
        const totalCredit = ledgerIds.reduce(
          (total, ledgerId) =>
            total + (newLedgerMap[ledgerId]?.totalCredit || 0),
          0
        );
        const openingBalance = ledgerIds.reduce(
          (total, ledgerId) =>
            total + (newLedgerMap[ledgerId]?.openingBalance || 0),
          0
        );
        const closingBalance = ledgerIds.reduce(
          (total, ledgerId) =>
            total + (newLedgerMap[ledgerId]?.closingBalance || 0),
          0
        );

        acc[group] = {
          totalDebit,
          totalCredit,
          openingBalance,
          closingBalance,
        };

        return acc;
      }, {});

      setGroupTotals(newGroupTotals);
    }
  }, [transactions, ledgers]);

  return (
    <div className="border-gray-300 dark:border-gray-600 dark:text-white rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800">
      <CategoryDistributionChart groupTotals={groupTotals} />
    </div>
  );
};

export default AllHeads;
