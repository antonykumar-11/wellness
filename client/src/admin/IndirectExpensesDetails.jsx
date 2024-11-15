import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAllPaymasterIndirectExpensesQuery } from "../store/api/PayMasterApi";

const calculateLedgerBalance = (ledgers, transactions, ledgerId) => {
  const ledger = ledgers.find((ledger) => ledger._id === ledgerId);
  if (!ledger) {
    return { openingBalance: 0, totalTransactions: 0, closingBalance: 0 };
  }

  const openingBalance = ledger.openingBalance || 0;

  const totalDebitTransactions =
    transactions.reduce((total, transaction) => {
      if (transaction.debitLedger === ledgerId) {
        total += transaction.debitAmount || 0;
      }
      return total;
    }, 0) + openingBalance;

  const totalCreditTransactions = transactions.reduce((total, transaction) => {
    if (transaction.creditLedger === ledgerId) {
      total += transaction.creditAmount || 0;
    }
    return total;
  }, 0);

  const closingBalance = totalDebitTransactions - totalCreditTransactions;

  return {
    openingBalance,
    totalTransactions: totalDebitTransactions + totalCreditTransactions,
    closingBalance,
  };
};

const IndirectExpensesDetails = () => {
  const { group } = useParams();
  console.log(" group ", group);
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAllPaymasterIndirectExpensesQuery();
  const [groupDetails, setGroupDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (data && data.transactions && data.ledgers) {
      const { transactions, ledgers } = data;

      if (group === "Withdrawals") {
        const withdrawalsBalance = getWithdrawalsBalance(transactions);
        withdrawalsBalance.closingBalance =
          withdrawalsBalance.openingBalance -
          withdrawalsBalance.totalTransactions;

        setGroupDetails({
          balance: withdrawalsBalance,
          transactions: transactions.filter(
            (transaction) => transaction.group === "Withdrawals"
          ),
        });
      } else {
        const groupLedgers = ledgers.filter((ledger) => ledger.group === group);
        const groupBalance = getGroupBalance(ledgers, transactions, group);

        setGroupDetails({
          ledgers: groupLedgers,
          balance: groupBalance,
          transactions: transactions.filter((transaction) =>
            groupLedgers.some(
              (ledger) =>
                ledger._id === transaction.debitLedger ||
                ledger._id === transaction.creditLedger
            )
          ),
        });
      }
    }
  }, [data, group]);

  const getGroupBalance = (ledgers, transactions, groupName) => {
    const groupLedgers = ledgers.filter((ledger) => ledger.group === groupName);
    const groupBalances = groupLedgers.map((ledger) =>
      calculateLedgerBalance(ledgers, transactions, ledger._id)
    );

    return groupBalances.reduce(
      (acc, balance) => {
        acc.openingBalance += balance.openingBalance;
        acc.closingBalance += balance.closingBalance;
        return acc;
      },
      { openingBalance: 0, totalTransactions: 0, closingBalance: 0 }
    );
  };

  const getWithdrawalsBalance = (transactions) => {
    const withdrawalTransactions = transactions.filter(
      (transaction) => transaction.group === "Withdrawals"
    );

    const totalWithdrawals = withdrawalTransactions.reduce(
      (total, transaction) => total + (transaction.debitAmount || 0),
      0
    );

    return {
      openingBalance: totalWithdrawals,
      closingBalance: 0,
      totalTransactions: totalWithdrawals,
    };
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading data.</p>;
  if (!groupDetails)
    return <p className="text-center text-gray-600">Group not found.</p>;

  const { ledgers, balance, transactions } = groupDetails;

  const filteredTransactions = transactions.filter((transaction) =>
    (transaction.debitLedgerName || transaction.creditLedgerName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalDebit = filteredTransactions.reduce(
    (acc, transaction) => acc + (transaction.debitAmount || 0),
    0
  );
  const totalCredit = filteredTransactions.reduce(
    (acc, transaction) => acc + (transaction.creditAmount || 0),
    0
  );

  const handleRowClick = (ledgerId, transactionId, voucherType) => {
    navigate(
      `/previewAll/${voucherType
        .toLowerCase()
        .replace(/ /g, "-")}/${ledgerId}/transaction/${transactionId}`,
      { state: { preserveData: true } }
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white text-gray-800 dark:bg-gray-800 dark:text-white">
      <h1 className="text-3xl font-semibold mb-6 border-b pb-2 text-gray-800 dark:text-gray-300">
        {group} Details
      </h1>

      <div className="mb-4 dark:bg-gray-800 dark:text-white">
        <input
          type="text"
          placeholder="Search by Ledger Name"
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow-sm mb-6 dark:bg-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-300">
          Group Balance
        </h2>
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm mb-6 dark:bg-gray-600">
          <div className="flex justify-between py-1">
            <span className="font-medium text-gray-800 dark:text-gray-300">
              Opening Balance:
            </span>
            <span className="text-gray-800 dark:text-gray-300">
              {balance.openingBalance.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-medium text-gray-800 dark:text-gray-300">
              Total Debit:
            </span>
            <span className="text-gray-800 dark:text-gray-300">
              {totalDebit.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-medium text-gray-800 dark:text-gray-300">
              Total Credit:
            </span>
            <span className="text-gray-800 dark:text-gray-300">
              {totalCredit.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-medium text-gray-800 dark:text-gray-300">
              Closing Balance:
            </span>
            <span className="text-gray-800 dark:text-gray-300">
              {balance.closingBalance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction._id}
            className="p-4 mb-4 rounded-lg shadow text-gray-800 dark:bg-gray-700 dark:text-white"
          >
            <h3 className="font-semibold text-gray-800 dark:text-gray-300">
              {new Date(transaction.date).toLocaleDateString("en-GB")}
            </h3>
            <div className="flex justify-between">
              <strong className="font-medium dark:text-gray-300">
                Ledger Name:
              </strong>
              <span className="font-medium dark:text-gray-300">
                {transaction.debitLedgerName || transaction.creditLedgerName}
              </span>
            </div>
            <div className="flex justify-between">
              <strong className="font-medium dark:text-gray-300">
                Description:
              </strong>
              <span className="font-medium dark:text-gray-300">
                {transaction.description}
              </span>
            </div>
            <div className="flex justify-between">
              <strong className="font-medium dark:text-gray-300">V/N:</strong>
              <span className="font-medium dark:text-gray-300">
                {transaction.voucherNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <strong className="font-medium dark:text-gray-300">
                Voucher Type:
              </strong>
              <span className="font-medium dark:text-gray-300">
                {transaction.voucherType}
              </span>
            </div>
            <div className="flex justify-between">
              <strong className="font-medium dark:text-gray-300">
                Debit Amount:
              </strong>
              <span className="font-medium dark:text-gray-300">
                {transaction.debitAmount || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <strong className="font-medium dark:text-gray-300">
                Credit Amount:
              </strong>
              <span className="font-medium dark:text-gray-300">
                {transaction.creditAmount || 0}
              </span>
            </div>
            <div>
              <button
                className="mt-4 text-blue-500 underline"
                onClick={() =>
                  handleRowClick(
                    transaction.ledgerId,
                    transaction._id,
                    transaction.voucherType
                  )
                }
              >
                View Transaction
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead className="bg-white dark:bg-gray-800">
            <tr>
              <th className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                Date
              </th>
              <th className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                Ledger Name
              </th>
              <th className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                Description
              </th>
              <th className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                V/N
              </th>
              <th className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                Voucher Type
              </th>
              <th className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                Debit Amount
              </th>
              <th className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                Credit Amount
              </th>
              <th className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr
                key={transaction._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center"
              >
                <td className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                  {new Date(transaction.date).toLocaleDateString("en-GB")}
                </td>
                <td className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                  {transaction.debitLedgerName || transaction.creditLedgerName}
                </td>
                <td className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                  {transaction.description}
                </td>
                <td className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                  {transaction.voucherNumber}
                </td>
                <td className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                  {transaction.voucherType}
                </td>
                <td className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                  {transaction.debitAmount || 0}
                </td>
                <td className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                  {transaction.creditAmount || 0}
                </td>
                <td className="text-center py-2 px-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                  <button
                    className="text-center text-blue-500 dark:text-blue-300 underline"
                    onClick={() =>
                      handleRowClick(
                        transaction.ledgerId,
                        transaction._id,
                        transaction.voucherType
                      )
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndirectExpensesDetails;
