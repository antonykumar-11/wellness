import React, { useEffect, useState } from "react";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";

const DutiesAndTaxesBalances = () => {
  const { data: { transactions = [], ledgers = [] } = {} } =
    useGetExpensesQuery();
  const [taxBalances, setTaxBalances] = useState([]);

  useEffect(() => {
    if (transactions.length > 0 && ledgers.length > 0) {
      // Filter ledgers belonging to the "Duties & Taxes" group
      const dutiesAndTaxesLedgers = ledgers.filter(
        (ledger) => ledger.group === "Duties & Taxes"
      );

      // Collect relevant details for each tax ledger grouped by group name
      const groupedBalances = dutiesAndTaxesLedgers.reduce((acc, ledger) => {
        const relevantTransactions = transactions.filter(
          (transaction) => transaction.taxId === ledger._id
        );

        const dailyBalances = relevantTransactions.map((transaction) => ({
          date: new Date(transaction.transactionDate).toLocaleDateString(),
          taxRate: transaction.taxRate,
          taxName: transaction.taxName || ledger.name,
          taxAmount: transaction.taxAmount,
        }));

        const totalTaxAmount = relevantTransactions.reduce(
          (sum, transaction) => sum + transaction.taxAmount,
          0
        );

        // Group by group name
        if (!acc[ledger.group]) {
          acc[ledger.group] = {
            groupName: ledger.group,
            ledgers: [],
            totalBalance: 0,
          };
        }

        acc[ledger.group].ledgers.push({
          ledgerName: ledger.name,
          dailyBalances,
          totalTaxAmount,
        });

        acc[ledger.group].totalBalance += totalTaxAmount;

        return acc;
      }, {});

      setTaxBalances(Object.values(groupedBalances));
    }
  }, [transactions, ledgers]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600">
        Duties & Taxes Balances
      </h1>
      <div className="overflow-x-auto">
        {taxBalances.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {taxBalances.map((balance, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
              >
                <h2 className="text-xl font-semibold p-4 bg-blue-600 text-white">
                  {balance.groupName}
                </h2>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Total Balance: {balance.totalBalance.toFixed(2)}
                  </h3>
                  {balance.ledgers.map((ledger, i) => (
                    <div key={i} className="mb-4">
                      <h4 className="text-lg font-medium text-gray-700 mb-2">
                        Ledger: {ledger.ledgerName}
                      </h4>
                      {ledger.dailyBalances.map((dailyBalance, j) => (
                        <div key={j}>
                          <h5 className="text-md font-medium text-gray-700">
                            Date: {dailyBalance.date}
                          </h5>
                          <table className="min-w-full divide-y divide-gray-300 mb-4">
                            <thead className="bg-gray-200">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                  Tax Rate (%)
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                  Tax Name
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                  Tax Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-2 text-right text-sm font-semibold">
                                  {dailyBalance.taxRate}
                                </td>
                                <td className="px-4 py-2 text-right text-sm font-semibold">
                                  {dailyBalance.taxName}
                                </td>
                                <td className="px-4 py-2 text-right text-sm font-semibold">
                                  {dailyBalance.taxAmount.toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default DutiesAndTaxesBalances;
