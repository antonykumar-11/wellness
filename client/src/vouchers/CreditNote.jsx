import React from "react";
import { useGetPurchasesQuery } from "../store/api/PurchaseApi"; // Adjust the import path as needed
import { useNavigate } from "react-router-dom";

const PurchaseDetails = () => {
  // Use the query hook to fetch data
  const { data, error, isLoading } = useGetPurchasesQuery();
  const navigate = useNavigate();

  // Handle loading state
  if (isLoading) return <p>Loading...</p>;

  // Handle error state
  if (error) return <p>Error: {error.message}</p>;

  // Handle case where no purchase data is available
  if (!data || data.length === 0) return <p>No purchase data available.</p>;

  // Process data
  const purchases = data;

  // Group by month and calculate totals
  const purchaseDetails = purchases.reduce((acc, purchase) => {
    const month = new Date(purchase.purchaseDate).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) {
      acc[month] = { totalDebit: 0, closingBalance: 0 };
    }
    acc[month].totalDebit += purchase.debitAmount;
    return acc;
  }, {});

  // Calculate the running closing balance
  let previousClosingBalance = 0;
  Object.keys(purchaseDetails).forEach((month) => {
    purchaseDetails[month].closingBalance =
      previousClosingBalance + purchaseDetails[month].totalDebit;
    previousClosingBalance = purchaseDetails[month].closingBalance;
  });

  // Handle row click to navigate
  const handleRowClick = (month) => {
    const formattedMonth = month.replace(/ /g, "-");
    navigate(`/vouchers/month/${formattedMonth}`);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Purchase Details</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Month
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Total Debit Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Closing Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(purchaseDetails).map(
              ([month, { totalDebit, closingBalance }]) => (
                <tr
                  key={month}
                  onClick={() => handleRowClick(month)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{month}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {totalDebit.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {closingBalance.toFixed(2)}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseDetails;
