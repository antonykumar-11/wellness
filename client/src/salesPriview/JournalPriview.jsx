import React, { useMemo } from "react";
import { useGetAllJournalVouchersQuery } from "../store/api/journalVoucherApi";
import { useNavigate } from "react-router-dom";

const JournalVoucher = () => {
  const {
    data: journals = [],
    isLoading,
    isError,
  } = useGetAllJournalVouchersQuery();
  const navigate = useNavigate();

  const summary = useMemo(() => {
    return journals.reduce((acc, journal) => {
      const { creditLedgerName, debitLedgerName, creditAmount, debitAmount } =
        journal;

      // Aggregate credits
      if (creditLedgerName) {
        if (!acc[creditLedgerName]) {
          acc[creditLedgerName] = { credit: 0, debit: 0 };
        }
        acc[creditLedgerName].credit += creditAmount || 0;
      }

      // Aggregate debits
      if (debitLedgerName) {
        if (!acc[debitLedgerName]) {
          acc[debitLedgerName] = { credit: 0, debit: 0 };
        }
        acc[debitLedgerName].debit += debitAmount || 0;
      }

      return acc;
    }, {});
  }, [journals]);

  const handleAccountClick = (accountName) => {
    navigate(`/vouchers/journals/${accountName}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching journal data</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Journal Entries</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Particulars</th>
            <th className="px-4 py-2">Voucher Number</th>
            <th className="px-4 py-2">Debit (₹)</th>
            <th className="px-4 py-2">Credit (₹)</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(summary).map((accountName) => (
            <tr
              key={accountName}
              onClick={() => handleAccountClick(accountName)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">{accountName}</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2 text-right">
                {summary[accountName].debit || 0}
              </td>
              <td className="px-4 py-2 text-right">
                {summary[accountName].credit || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JournalVoucher;
