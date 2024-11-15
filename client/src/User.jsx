// import React, { useRef } from "react";

// const UserPrint = ({ transactions }) => {
//   const printRef = useRef();

//   const handlePrint = () => {
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write("<html><head><title>Print</title>");
//     printWindow.document.write(
//       '<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">'
//     );
//     printWindow.document.write("</head><body>");
//     printWindow.document.write(printRef.current.innerHTML);
//     printWindow.document.write("</body></html>");
//     printWindow.document.close();
//     printWindow.print();
//   };

//   return (
//     <div>
//       <button
//         onClick={handlePrint}
//         className="mb-4 p-2 bg-blue-500 text-white rounded"
//       >
//         Print
//       </button>
//       <div ref={printRef}>
//         <table className="min-w-full border border-gray-300">
//           <thead>
//             <tr>
//               <th className="border border-gray-300 p-2 text-center">Date</th>
//               <th className="border border-gray-300 p-2 text-center">
//                 Voucher Number
//               </th>
//               <th className="border border-gray-300 p-2 text-center">
//                 Voucher Type
//               </th>
//               <th className="border border-gray-300 p-2 text-center">
//                 Description
//               </th>
//               <th className="border border-gray-300 p-2 text-center">
//                 Debit Ledger
//               </th>
//               <th className="border border-gray-300 p-2 text-center">
//                 Debit Amount
//               </th>
//               <th className="border border-gray-300 p-2 text-center">
//                 Credit Ledger
//               </th>
//               <th className="border border-gray-300 p-2 text-center">
//                 Credit Amount
//               </th>
//               <th className="border border-gray-300 p-2 text-center">
//                 Total Debit
//               </th>
//               <th className="border border-gray-300 p-2 text-center">
//                 Total Credit
//               </th>
//               <th className="border border-gray-300 p-2 text-center">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.map((transaction) => {
//               const totalDebit = transaction.debitLedgers
//                 .reduce((acc, ledger) => acc + (ledger.amount || 0), 0)
//                 .toFixed(2);
//               const totalCredit = transaction.creditLedgers
//                 .reduce((acc, ledger) => acc + (ledger.amount || 0), 0)
//                 .toFixed(2);

//               return (
//                 <tr
//                   key={transaction._id}
//                   className="bg-white border border-gray-400"
//                 >
//                   <td className="border border-gray-300 p-2 text-center">
//                     {new Date(transaction.date).toLocaleDateString()}
//                   </td>
//                   <td className="border border-gray-300 p-2 text-center">
//                     {transaction.voucherNumber || "N/A"}
//                   </td>
//                   <td className="border border-gray-300 p-2 text-center">
//                     {transaction.voucherType}
//                   </td>
//                   <td className="border border-gray-300 p-2 text-center">
//                     {transaction.description || "N/A"}
//                   </td>
//                   <td className="border border-gray-300 p-2 text-center">
//                     {transaction.debitLedgers
//                       .map((ledger) => ledger.ledgerName)
//                       .join(", ") || "N/A"}
//                   </td>
//                   <td className="border border-gray-300 p-2 text-center">
//                     {transaction.debitLedgers
//                       .map((ledger) => ledger.amount)
//                       .join(", ") || "N/A"}
//                   </td>
//                   <td className="border border-gray-300 p-2 text-center">
//                     {transaction.creditLedgers
//                       .map((ledger) => ledger.ledgerName)
//                       .join(", ") || "N/A"}
//                   </td>
//                   <td className="border border-gray-300 p-2 text-center">
//                     {transaction.creditLedgers
//                       .map((ledger) => ledger.amount)
//                       .join(", ") || "N/A"}
//                   </td>
//                   <td className="border border-gray-300 p-2 text-center">
//                     {totalDebit}
//                   </td>
//                   <td className="border border-gray-300 p-2 text-center">
//                     {totalCredit}
//                   </td>
//                   <td className="border border-gray-300 p-2 text-center">
//                     <button className="text-blue-600">Detail</button>
//                     <button className="text-red-600">Voucher</button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UserPrint;
import React from "react";

const UserPrint = ({ transactions }) => {
  return (
    <div className="printable">
      <h2 className="text-xl font-semibold mb-4">Print Preview</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th>Date</th>
            <th>Voucher Number</th>
            <th>Voucher Type</th>
            <th>Description</th>
            <th>Debit Ledger</th>
            <th>Debit Amount</th>
            <th>Credit Ledger</th>
            <th>Credit Amount</th>
            <th>Total Debit</th>
            <th>Total Credit</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const totalDebit = transaction.debitLedgers
              .reduce((acc, ledger) => acc + (ledger.amount || 0), 0)
              .toFixed(2);
            const totalCredit = transaction.creditLedgers
              .reduce((acc, ledger) => acc + (ledger.amount || 0), 0)
              .toFixed(2);

            return (
              <tr key={transaction._id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.voucherNumber || "N/A"}</td>
                <td>{transaction.voucherType}</td>
                <td>{transaction.description || "N/A"}</td>
                <td>
                  {transaction.debitLedgers
                    .map((ledger) => ledger.ledgerName)
                    .join(", ") || "N/A"}
                </td>
                <td>
                  {transaction.debitLedgers
                    .map((ledger) => ledger.amount)
                    .join(", ") || "N/A"}
                </td>
                <td>
                  {transaction.creditLedgers
                    .map((ledger) => ledger.ledgerName)
                    .join(", ") || "N/A"}
                </td>
                <td>
                  {transaction.creditLedgers
                    .map((ledger) => ledger.amount)
                    .join(", ") || "N/A"}
                </td>
                <td>{totalDebit}</td>
                <td>{totalCredit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserPrint;
