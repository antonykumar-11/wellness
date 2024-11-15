import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";
import React from "react";

// Utility function to calculate balance for a specific ledger
const calculateLedgerBalance = (ledgers, transactions, ledgerId) => {
  const ledger = ledgers.find((ledger) => ledger._id === ledgerId);

  if (!ledger)
    return { openingBalance: 0, totalTransactions: 0, closingBalance: 0 };

  const openingBalance =
    ledger.nature === "Credit"
      ? Math.abs(ledger.openingBalance || 0)
      : -(ledger.openingBalance || 0);

  const totalTransactions = transactions.reduce((total, transaction) => {
    if (transaction.debitLedger === ledgerId) {
      total -= transaction.debitAmount || 0;
    }
    if (transaction.creditLedger === ledgerId) {
      total += transaction.creditAmount || 0;
    }
    return total;
  }, 0);

  const closingBalance = openingBalance + totalTransactions;

  return {
    openingBalance: Math.abs(openingBalance),
    totalTransactions: Math.abs(totalTransactions),
    closingBalance: Math.abs(closingBalance),
  };
};

// Utility function to calculate balance for a group of ledgers
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

const CombinedAccountBalancesComponent = () => {
  const { data, isLoading, error } = useGetExpensesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  const { ledgers, transactions } = data;

  const capitalBalance = getGroupBalance(
    ledgers,
    transactions,
    "Capital Account"
  );
  const withdrawalBalance = getGroupBalance(ledgers, transactions, "Withdraw");
  const sundryCreditorsBalance = getGroupBalance(
    ledgers,
    transactions,
    "Sundry Creditors"
  );

  return (
    <div>
      <h2>Capital Account Balances</h2>
      <p>Opening Balance: {capitalBalance.openingBalance.toFixed(2)}</p>
      <p>Total Transactions: {capitalBalance.totalTransactions.toFixed(2)}</p>
      <p>Closing Balance: {capitalBalance.closingBalance.toFixed(2)}</p>

      <h2>Withdrawal Balances</h2>
      <p>Opening Balance: {withdrawalBalance.openingBalance.toFixed(2)}</p>
      <p>
        Total Transactions: {withdrawalBalance.totalTransactions.toFixed(2)}
      </p>
      <p>Closing Balance: {withdrawalBalance.closingBalance.toFixed(2)}</p>

      <h2>Sundry Creditors Balance</h2>
      <p>Opening Balance: {sundryCreditorsBalance.openingBalance.toFixed(2)}</p>
      <p>
        Total Transactions:{" "}
        {sundryCreditorsBalance.totalTransactions.toFixed(2)}
      </p>
      <p>Closing Balance: {sundryCreditorsBalance.closingBalance.toFixed(2)}</p>
    </div>
  );
};

export default CombinedAccountBalancesComponent;
