import React from "react";
import { useGetReceiptVouchersQuery } from "../store/api/RecieptVoucher";
import { useNavigate } from "react-router-dom";

const ReceiptPreview = () => {
  const { data, error, isLoading } = useGetReceiptVouchersQuery();
  const navigate = useNavigate();
  console.log("data", data);

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  if (!data || data.length === 0)
    return (
      <p className="text-center text-gray-500">No Receipt data available.</p>
    );

  // Process filtered data
  const yearlySubtotal = data.reduce((total, receipt) => {
    return total + (receipt.creditAmount || 0);
  }, 0);

  const handleRowClick = () => {
    navigate(`/receipt/year`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Yearly Receipt Details
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Receipt Account
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr
              onClick={handleRowClick}
              className="cursor-pointer hover:bg-blue-50 transition duration-300"
            >
              <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                Total Receipts
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                {yearlySubtotal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptPreview;
