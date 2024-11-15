// import { useParams } from "react-router-dom";
// import { useGetAllJournalVouchersQuery } from "../store/api/journalVoucherApi";

// const JournalByMonth = () => {
//   const { month } = useParams();
//   const {
//     data: journal = [],
//     isLoading,
//     isError,
//   } = useGetAllJournalVouchersQuery();

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error fetching data</div>;

//   // Group journal vouchers by month
//   const journalByMonth = journal.reduce((acc, voucher) => {
//     const monthKey = new Date(voucher.date).toLocaleString("default", {
//       month: "long",
//       year: "numeric",
//     });
//     if (!acc[monthKey]) acc[monthKey] = [];
//     acc[monthKey].push(voucher);
//     return acc;
//   }, {});

//   const vouchers = journalByMonth[month] || [];

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-3xl font-bold mb-6 text-center">
//         Journal Vouchers for {month}
//       </h2>
//       <ul>
//         {vouchers.map((voucher) => (
//           <li key={voucher._id} className="mb-2">
//             {voucher.description}
//           </li>
//         ))}
//       </ul>
//       <button
//         onClick={() => window.history.back()}
//         className="mt-4 text-indigo-600"
//       >
//         Back to All Months
//       </button>
//     </div>
//   );
// };

// export default JournalByMonth;
import { useParams } from "react-router-dom";
import { useGetAllJournalVouchersQuery } from "../store/api/journalVoucherApi";
import { useEffect, useState } from "react";

const JournalEntryDetail = () => {
  const { journalId } = useParams();
  console.log("journalid", journalId);
  const {
    data: journals = [],
    isLoading,
    isError,
  } = useGetAllJournalVouchersQuery();
  console.log("journals", journals);
  const [journal, setJournal] = useState(null);
  console.log("selected journal", journal);

  useEffect(() => {
    if (journals.length > 0) {
      const selectedJournal = journals.find((j) => j._id === journalId);
      setJournal(selectedJournal);
    }
  }, [journals, journalId]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching journal data</div>;
  if (!journal) return <div>No details found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Journal Entry Details
      </h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold">
          Date: {new Date(journal.date).toLocaleDateString()}
        </h3>
        <p className="text-lg">Voucher Number: {journal.voucherNumber}</p>
        <p className="text-lg">Description: {journal.description}</p>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Account</th>
            <th className="px-4 py-2">Amount ($)</th>
            <th className="px-4 py-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {journal.debitAmount > 0 && (
            <tr>
              <td className="px-4 py-2">{journal.debitLedgerName}</td>
              <td className="px-4 py-2 text-right">{journal.debitAmount}</td>
              <td className="px-4 py-2">Debit</td>
            </tr>
          )}
          {journal.creditAmount > 0 && (
            <tr>
              <td className="px-4 py-2">{journal.creditLedgerName}</td>
              <td className="px-4 py-2 text-right">{journal.creditAmount}</td>
              <td className="px-4 py-2">Credit</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JournalEntryDetail;
