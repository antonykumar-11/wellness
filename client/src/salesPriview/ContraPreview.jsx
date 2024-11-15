import { useGetContraVouchersQuery } from "../store/api/ContraVoucherApi";

const ContraVoucherDisplay = () => {
  const {
    data: contraVouchers = [],
    isLoading,
    isError,
  } = useGetContraVouchersQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching contra vouchers</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Contra Vouchers</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Voucher Number</th>
            <th className="px-4 py-2">Debit Ledger</th>
            <th className="px-4 py-2">Debit Amount (₹)</th>
            <th className="px-4 py-2">Credit Ledger</th>
            <th className="px-4 py-2">Credit Amount (₹)</th>
            <th className="px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {contraVouchers.map((voucher) => (
            <tr key={voucher._id} className="hover:bg-gray-100">
              <td className="px-4 py-2">{voucher.date}</td>
              <td className="px-4 py-2">{voucher.voucherNumber}</td>
              <td className="px-4 py-2">{voucher.debitLedgerName}</td>
              <td className="px-4 py-2 text-right">{voucher.debitAmount}</td>
              <td className="px-4 py-2">{voucher.creditLedgerName}</td>
              <td className="px-4 py-2 text-right">{voucher.creditAmount}</td>
              <td className="px-4 py-2">{voucher.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContraVoucherDisplay;
