import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetPurchasesQuery } from "../store/api/PurchaseApi"; // Adjust the import path as needed

const MonthDetails = () => {
  const { month } = useParams();
  const { data, error, isLoading } = useGetPurchasesQuery();
  const navigate = useNavigate();

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  const formattedMonth = month.replace(/-/g, " ");
  const purchases = data.filter((purchase) => {
    const purchaseMonth = new Date(purchase.purchaseDate).toLocaleString(
      "default",
      {
        month: "long",
        year: "numeric",
      }
    );
    return purchaseMonth === formattedMonth;
  });

  if (!purchases.length)
    return (
      <p className="text-center text-gray-500">No purchases for this month.</p>
    );

  // Calculate subtotal for the month
  const subtotal = purchases.reduce(
    (acc, purchase) => acc + purchase.creditAmount,
    0
  );

  const handleRowClick = (id) => {
    console.log("id", id);
    navigate(`/vouchers/day/${id}`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Purchases for {formattedMonth}
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Credit Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases.map((purchase) => (
              <tr
                key={purchase._id}
                onClick={() => handleRowClick(purchase._id)}
                className="cursor-pointer hover:bg-blue-50 transition duration-300"
              >
                <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                  {new Date(purchase.purchaseDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                  {purchase.description}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                  {purchase.creditAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                colSpan="2"
              >
                <strong>Subtotal</strong>
              </td>
              <td className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">
                <strong>{subtotal.toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default MonthDetails;
