import { useParams, useNavigate } from "react-router-dom";
import { useGetPurchaseByIdQuery } from "../store/api/PurchaseApi";

const PurchaseDetailsPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Use the query hook to fetch data
  const { data, error, isLoading } = useGetPurchaseByIdQuery(id);
  console.log("Data:", data);

  // Handle loading state
  if (isLoading) return <p>Loading...</p>;

  // Handle error state
  if (error) return <p>Error: {error.message}</p>;

  // Handle case where no purchase data is available
  if (!data || data.length === 0) return <p>No purchase data available.</p>;

  // Extract the first purchase object
  const purchase = data;
  console.log("purchase", purchase);
  const stockItems = purchase?.items || []; // Updated to match the items key in your data

  const transactionLedger = {
    debitLedgerName: purchase?.debitLedgerName || "N/A",
    debitAmount: purchase?.debitAmount || 0,
    creditLedgerName: purchase?.creditLedgerName || "N/A",
    creditAmount: purchase?.creditAmount || 0,
  };

  const tax = {
    taxId: purchase?.taxId || "N/A",
    taxRate: purchase?.taxRate || 0,
    taxAmount: purchase?.taxAmount || 0,
  };

  // Handle update button click
  const handleUpdateClick = () => {
    console.log(
      "Update button clicked, navigating to:",
      `/vouchers/purchase/${id}`
    );
    navigate(`/vouchers/purchase/${id}`);
  };
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* Purchase Details */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Purchase Details</h2>
          <button
            onClick={handleUpdateClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Update
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Purchase Info
              </h3>
              <p>
                <strong>Voucher Number:</strong>{" "}
                {purchase?.purchaseBy?.voucherNumber || "N/A"}
              </p>
              <p>
                <strong>Purchase Date:</strong>{" "}
                {purchase?.purchaseDate
                  ? new Date(purchase.purchaseDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Amount Paid:</strong>{" "}
                {purchase?.amountPaid?.toFixed(2) || "0.00"}
              </p>
              <p>
                <strong>Purpose of Payment:</strong>{" "}
                {purchase?.purposeOfPayment || "N/A"}
              </p>
              <p>
                <strong>Authorized By:</strong>{" "}
                {purchase?.authorizedBy?.name || "N/A"} (
                {purchase?.authorizedBy?.designation || "N/A"})
              </p>
              <p>
                <strong>Remarks:</strong> {purchase?.remarks || "N/A"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Supplier Info
              </h3>
              <p>
                <strong>Company Name:</strong>{" "}
                {purchase?.purchaseTo?.companyName || "N/A"}
              </p>
              <p>
                <strong>GST Number:</strong>{" "}
                {purchase?.purchaseTo?.gstNumber || "N/A"}
              </p>
              <p>
                <strong>State:</strong> {purchase?.purchaseTo?.state || "N/A"}
              </p>
              <p>
                <strong>Bank Name:</strong>{" "}
                {purchase?.purchaseTo?.bankName || "N/A"}
              </p>
              <p>
                <strong>Account Number:</strong>{" "}
                {purchase?.purchaseTo?.accountNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Stock Items */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Stock Items</h2>
          <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial Number
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HSN Code
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {item.serialNumber || "N/A"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {item.description || "N/A"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {item.price?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {item.unit || "N/A"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {item.hsnCode || "N/A"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {item.rate?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {item.quantity || 0}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {item.amount?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"></td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"></td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"></td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"></td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"></td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"></td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"></td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm  text-white">
                    100
                  </td>
                </tr>
              </tbody>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    Total
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"></td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"></td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"></td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"></td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"></td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"></td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    100
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Ledger */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Transaction Ledger
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p>
              <strong>Debit Ledger Name:</strong>{" "}
              {transactionLedger.debitLedgerName}
            </p>
            <p>
              <strong>Debit Amount:</strong>{" "}
              {transactionLedger.debitAmount.toFixed(2)}
            </p>
            <p>
              <strong>Credit Ledger Name:</strong>{" "}
              {transactionLedger.creditLedgerName}
            </p>
            <p>
              <strong>Credit Amount:</strong>{" "}
              {transactionLedger.creditAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Tax Details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Tax Details</h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p>
              <strong>Tax ID:</strong> {tax.taxId}
            </p>
            <p>
              <strong>Tax Rate:</strong> {tax.taxRate.toFixed(2)}%
            </p>
            <p>
              <strong>Tax Amount:</strong> {tax.taxAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetailsPreview;
