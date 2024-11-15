import React from "react";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";
import { Link } from "react-router-dom";

const IndirectExpenses = () => {
  const {
    data = { transactions: [], ledgers: [] },
    isLoading,
    isError,
  } = useGetExpensesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching expenses</div>;
  }

  const indirectExpenseLedgerIds = data.ledgers
    .filter((ledger) => ledger.group === "Indirect Expenses")
    .map((ledger) => ledger._id);

  const filteredTransactions = data.transactions.filter(
    (transaction) =>
      indirectExpenseLedgerIds.includes(transaction.debitLedger) ||
      indirectExpenseLedgerIds.includes(transaction.creditLedger)
  );

  const totalIndirectExpenses = filteredTransactions.reduce(
    (total, transaction) =>
      total + (transaction.debitAmount || transaction.creditAmount || 0),
    0
  );

  console.log("Total Indirect Expenses:", totalIndirectExpenses);
  console.log("Filtered Transactions:", filteredTransactions);

  return (
    <div>
      <h1>
        <Link
          to={{
            pathname: "/preview/indirectexpensesdetails",
            state: { transactions: filteredTransactions },
          }}
        >
          Total Indirect Expenses: {totalIndirectExpenses}
        </Link>
      </h1>
    </div>
  );
};

export default IndirectExpenses;
