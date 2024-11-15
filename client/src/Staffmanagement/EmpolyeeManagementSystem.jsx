import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../common/Header";
import StatCard from "../common/StatCard";
import CustomPieChart from "../overview/CategoryDistributionChart";
import SalesChannelChart from "../overview/SalesChannelChart";
import CategoryDistributionChart1 from "../overview/CategoryDistributionChart1";
import CategoryDistributionChart3 from "../overview/CategoryDistributionChart3";
import CategoryDistributionChart31 from "../overview/CategoryDistributionChart31";
import CategoryDistributionChart2 from "../overview/CategoryDistributionChart2";
import CategoryDistributionChart5 from "../overview/CategoryDistributionChart5";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi"; // Move imports to the top
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const groups = [
  "Capital Account",
  "Current Assets",
  "Current Liabilities",
  "Bank Accounts",
  "Cash-in-Hand",
  "Sundry Debtors",
  "Sundry Creditors",
  "Direct Incomes",
  "Indirect Incomes",
  "Direct Expenses",
  "Indirect Expenses",
  "Duties & Taxes",
  "Provisions",
  "Loans & Advances (Asset)",
  "Sales Accounts",
  "Purchase Accounts",
  "Loans (Liability)",
];

const OverviewPage = () => {
  const navigate = useNavigate();
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

      // Calculate group totals
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
  // Handle pie chart and stat card click
  const handlePieClick = (group) => {
    navigate(`/admin/group-detail/${group}`);
  };

  return (
    <div className="flex-1 overflow-auto relative mt-10 z-10">
      <Header title="Overview your business" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Sales Accounts"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Sales Accounts"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Sales Accounts")}
            color="#6366F1"
          />

          <StatCard
            name="Purchase Accounts"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Purchase Accounts"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Purchase Accounts")}
            color="#6366F1"
          />
          <StatCard
            name="Direct Incomes"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Direct Incomes"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Direct Incomes")}
            color="#6366F1"
          />
          <StatCard
            name="Indirect Incomes"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Indirect Incomes"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Indirect Incomes")}
            color="#6366F1"
          />
          <StatCard
            name="Direct Expenses"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Direct Expenses"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Direct Expenses")}
            color="#6366F1"
          />
          <StatCard
            name="Indirect Expenses"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Indirect Expenses"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Indirect Expenses")}
            color="#6366F1"
          />
          <StatCard
            name="Current Assets"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Current Assets"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Current Assets")}
            color="#6366F1"
          />
          <StatCard
            name="Current Liabilities"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Current Liabilities"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Current Liabilities")}
            color="#6366F1"
          />

          <StatCard
            name="Bank Accounts"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Bank Accounts"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Bank Accounts")}
            color="#6366F1"
          />
          <StatCard
            name="Cash-in-Hand"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Cash-in-Hand"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Cash-in-Hand")}
            color="#6366F1"
          />
          <StatCard
            name="Capital Account"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Capital Account"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Capital Account")}
            color="#6366F1"
          />
          <StatCard
            name="Provisions"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Provisions"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Provisions")}
            color="#6366F1"
          />
          <StatCard
            name="Sundry Creditors"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Sundry Creditors"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Sundry Creditors")}
            color="#6366F1"
          />
          <StatCard
            name="Sundry Debtors"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Sundry Debtors"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Sundry Debtors")}
            color="#6366F1"
          />

          <StatCard
            name="Loans & Advances (Asset)"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Loans & Advances (Asset)"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Loans & Advances (Asset)")}
            color="#6366F1"
          />
          <StatCard
            name="Loans (Liability)"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Loans (Liability)"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Loans (Liability)")}
            color="#6366F1"
          />
          <StatCard
            name="Duties & Taxes"
            icon={Zap}
            value={`₹ ${Number(
              groupTotals["Duties & Taxes"]?.closingBalance || 0
            ).toFixed(2)}`}
            onClick={() => handlePieClick("Duties & Taxes")}
            color="#6366F1"
          />
        </motion.div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CustomPieChart />
          <CategoryDistributionChart1 />
          <CategoryDistributionChart2 />
          <CategoryDistributionChart31 />
          <CategoryDistributionChart3 />
          <CategoryDistributionChart5 />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
