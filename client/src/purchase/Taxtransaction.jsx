import React from "react";
import { useParams } from "react-router-dom";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";

const TaxTransactions = () => {
  const { group } = useParams();
  const { data: { transactions = [] } = {} } = useGetExpensesQuery();

  const taxTransactions = transactions.filter(
    (transaction) => transaction.taxCredit && transaction.taxCredit.creditLedger
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600">
        {group} Transactions
      </h1>
      <div className="overflow-x-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto p-4">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {taxTransactions.length > 0 ? (
                  taxTransactions.map((transaction) => {
                    const { date, taxCredit } = transaction;
                    return (
                      <tr key={transaction._id}>
                        <td className="px-4 py-2 text-right text-sm">
                          {date ? new Date(date).toLocaleDateString() : ""}
                        </td>
                        <td className="px-4 py-2 text-left text-sm">
                          {taxCredit ? taxCredit.creditLedgerName : "N/A"}
                        </td>
                        <td className="px-4 py-2 text-right text-sm">
                          {taxCredit
                            ? taxCredit.creditAmount.toFixed(2)
                            : "0.00"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-2 text-center text-sm text-gray-600"
                    >
                      No tax transactions available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxTransactions;
