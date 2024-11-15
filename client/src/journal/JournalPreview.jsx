// import { useState } from "react";
// import { useGetJournalQuery } from "../store/api/journalVoucherApi";
// import LedgerMiddleWares2 from "../middlewares/LedgerMiddleWares2";
// import LedgerMiddleWares from "../middlewares/LedgerMiddleWares";
// import { useGetLedgerQuery } from "../store/api/LedgerApi";

// const JournalPreview = () => {
//   // State for form data
//   const [voucherData, setVoucherData] = useState({
//     voucherNumber: "",
//     date: "",
//     debitLedger: "",
//     debitLedgerName: "",
//     debitAmount: "",
//     creditLedger: "",
//     creditLedgerName: "",
//     creditAmount: "",
//   });

//   // State for selected month and day
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [selectedDay, setSelectedDay] = useState(null);

//   const {
//     data: ledgers = [],
//     isLoading: isLedgerLoading,
//     isError: isLedgerError,
//   } = useGetLedgerQuery();
//   const {
//     data: journal = [],
//     isLoading: isJournalLoading,
//     isError: isJournalError,
//   } = useGetJournalQuery();

//   const handleLedgerChange = (ledger) => {
//     setVoucherData((prevData) => ({
//       ...prevData,
//       debitLedger: ledger._id,
//       debitLedgerName: ledger.name,
//     }));
//   };

//   const handleCreditLedgerChange = (ledger) => {
//     setVoucherData((prevData) => ({
//       ...prevData,
//       creditLedger: ledger._id,
//       creditLedgerName: ledger.name,
//     }));
//   };

//   const handleChange = (e) => {
//     setVoucherData({
//       ...voucherData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await createJournalVoucher(voucherData);
//   };

//   const handleMonthClick = (month) => {
//     setSelectedMonth(month);
//     setSelectedDay(null);
//   };

//   const handleDayClick = (day) => {
//     setSelectedDay(day);
//   };

//   if (isLedgerLoading || isJournalLoading) return <div>Loading...</div>;
//   if (isLedgerError || isJournalError) return <div>Error fetching data</div>;

//   // Group journal vouchers by month and day
//   const journalByMonth = journal.reduce((acc, voucher) => {
//     const month = new Date(voucher.date).toLocaleString("default", {
//       month: "long",
//       year: "numeric",
//     });
//     if (!acc[month]) acc[month] = [];
//     acc[month].push(voucher);
//     return acc;
//   }, {});

//   const journalByDay = selectedMonth
//     ? journalByMonth[selectedMonth].reduce((acc, voucher) => {
//         const day = new Date(voucher.date).toLocaleString("default", {
//           day: "numeric",
//         });
//         if (!acc[day]) acc[day] = [];
//         acc[day].push(voucher);
//         return acc;
//       }, {})
//     : {};

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       {selectedMonth ? (
//         <div>
//           <h2 className="text-3xl font-bold mb-6 text-center">
//             Journal Vouchers for {selectedMonth}
//           </h2>
//           {selectedDay ? (
//             <div>
//               <button
//                 onClick={() => setSelectedDay(null)}
//                 className="mb-4 text-indigo-600"
//               >
//                 Back to Month View
//               </button>
//               <h3 className="text-2xl font-bold mb-4">
//                 Vouchers for {selectedDay}
//               </h3>
//               <ul>
//                 {journalByDay[selectedDay].map((voucher) => (
//                   <li key={voucher._id}>{voucher.description}</li>
//                 ))}
//               </ul>
//             </div>
//           ) : (
//             <div>
//               <button
//                 onClick={() => setSelectedMonth(null)}
//                 className="mb-4 text-indigo-600"
//               >
//                 Back to All Months
//               </button>
//               <ul>
//                 {Object.keys(journalByDay).map((day) => (
//                   <li key={day}>
//                     <button
//                       onClick={() => handleDayClick(day)}
//                       className="text-indigo-600"
//                     >
//                       {day}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div>
//           <h2 className="text-3xl font-bold mb-6 text-center">
//             All Journal Vouchers by Month
//           </h2>
//           <ul>
//             {Object.keys(journalByMonth).map((month) => (
//               <li key={month}>
//                 <button
//                   onClick={() => handleMonthClick(month)}
//                   className="text-indigo-600"
//                 >
//                   {month}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <h2 className="text-3xl font-bold mt-6 mb-6 text-center">
//         Create Journal Voucher
//       </h2>
//       <form
//         className="grid grid-cols-1 md:grid-cols-2 gap-6"
//         onSubmit={handleSubmit}
//       >
//         <div className="col-span-1">
//           <label className="block text-sm font-medium text-gray-700">
//             Voucher Number
//           </label>
//           <input
//             type="text"
//             name="voucherNumber"
//             value={voucherData.voucherNumber}
//             onChange={handleChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div className="col-span-1">
//           <label className="block text-sm font-medium text-gray-700">
//             Date
//           </label>
//           <input
//             type="date"
//             name="date"
//             value={voucherData.date}
//             onChange={handleChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           />
//         </div>

//         <div>
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700">
//               Debit Ledger Name
//             </label>
//             <LedgerMiddleWares
//               options={ledgers}
//               value={voucherData.debitLedgerName}
//               onChange={handleLedgerChange}
//               selectedLedger={ledgers.find(
//                 (l) => l._id === voucherData.debitLedger
//               )}
//             />
//           </div>
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700">
//               Debit Amount
//             </label>
//             <input
//               type="number"
//               name="debitAmount"
//               value={voucherData.debitAmount}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>
//         </div>
//         <div>
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700">
//               Credit Ledger Name
//             </label>
//             <LedgerMiddleWares2
//               options={ledgers}
//               value={voucherData.creditLedgerName}
//               onChange={handleCreditLedgerChange}
//               selectedLedger={ledgers.find(
//                 (l) => l._id === voucherData.creditLedger
//               )}
//             />
//           </div>
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700">
//               Credit Amount
//             </label>
//             <input
//               type="number"
//               name="creditAmount"
//               value={voucherData.creditAmount}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>
//         </div>
//         <div className="col-span-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Description
//           </label>
//           <textarea
//             name="description"
//             value={voucherData.description}
//             onChange={handleChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           />
//         </div>
//         <div className="col-span-2">
//           <button
//             type="submit"
//             className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Create Voucher
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default JournalPreview;
// import { useState } from "react";
// import { useGetAllJournalVouchersQuery } from "../store/api/journalVoucherApi";
// import { useNavigate } from "react-router-dom";

// const JournalVoucher = () => {
//   const navigate = useNavigate();
//   const {
//     data: journal = [],
//     isLoading,
//     isError,
//   } = useGetAllJournalVouchersQuery();
//   console.log("journal", journal);
//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error fetching data</div>;

//   // Group journal vouchers by month
//   const journalByMonth = journal.reduce((acc, voucher) => {
//     const month = new Date(voucher.date).toLocaleString("default", {
//       month: "long",
//       year: "numeric",
//     });
//     if (!acc[month]) acc[month] = [];
//     acc[month].push(voucher);
//     return acc;
//   }, {});

//   const handleMonthClick = (month) => {
//     navigate(`/vouchers/journals/${month}`);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-3xl font-bold mb-6 text-center">
//         All Journal Vouchers by Month
//       </h2>
//       <ul>
//         {Object.keys(journalByMonth).map((month) => (
//           <li key={month} className="mb-4">
//             <button
//               onClick={() => handleMonthClick(month)}
//               className="text-indigo-600"
//             >
//               {month} - {journalByMonth[month].length} ledgers
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default JournalVoucher;
import { useGetAllJournalVouchersQuery } from "../store/api/journalVoucherApi";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const JournalVoucher = () => {
  const {
    data: journals = [],
    isLoading,
    isError,
  } = useGetAllJournalVouchersQuery();
  const navigate = useNavigate();
  console.log("data", journals);
  // Ensure hooks are called at the top level
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching journal data</div>;

  // Calculate summary data
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

// import React from 'react';
// import { useParams } from 'react-router-dom';

// const LedgerDetails = ({ ledgers }) => {
//   const { ledgerName } = useParams();
//   const ledger = ledgers[ledgerName];

//   if (!ledger) return <div>Ledger not found</div>;

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-3xl font-bold mb-6 text-center">Transactions for {ledgerName}</h2>
//       <table className="min-w-full bg-white">
//         <thead>
//           <tr>
//             <th className="px-4 py-2">Date</th>
//             <th className="px-4 py-2">Particulars</th>
//             <th className="px-4 py-2">Debit ($)</th>
//             <th className="px-4 py-2">Credit ($)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {ledger.transactions.map((transaction, index) => (
//             <tr key={index}>
//               <td className="border px-4 py-2">{new Date(transaction.date).toLocaleDateString()}</td>
//               <td className="border px-4 py-2">{transaction.description}</td>
//               <td className="border px-4 py-2">{transaction.debitAmount || ''}</td>
//               <td className="border px-4 py-2">{transaction.creditAmount || ''}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LedgerDetails;

// import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import JournalVoucher from './components/JournalVoucher';
// import LedgerDetails from './components/LedgerDetails';

// const App = () => {
//   const { data: journals = [] } = useGetJournalQuery(); // Assuming this hook fetches all journals

//   const ledgerBalances = journals.reduce((acc, journal) => {
//     const { account, debitAmount, creditAmount } = journal;
//     if (!acc[account]) {
//       acc[account] = { balance: 0, transactions: [] };
//     }
//     acc[account].balance += (creditAmount || 0) - (debitAmount || 0);
//     acc[account].transactions.push(journal);
//     return acc;
//   }, {});

//   return (
//     <Router>
//       <Switch>
//         <Route exact path="/journals" component={JournalVoucher} />
//         <Route path="/journals/:ledgerName" render={() => <LedgerDetails ledgers={ledgerBalances} />} />
//       </Switch>
//     </Router>
//   );
// };

// export default App;
