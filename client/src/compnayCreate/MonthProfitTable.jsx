// import React, { useEffect, useState } from "react";
// import { useGetMonthProfitsQuery } from "../store/api/MonthProfitApi";
// import { useNavigate } from "react-router-dom"; // for navigation
// import MonthProfitPdf from "./MonthProfitPdf";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// const MonthProfitTable = () => {
//   const {
//     data: profits = [],
//     error,
//     isLoading,
//     refetch,
//   } = useGetMonthProfitsQuery();
//   const navigate = useNavigate(); // For redirection
//   useEffect(() => {
//     refetch();
//   }, [refetch]);
//   const [searchTerm, setSearchTerm] = useState(""); // State for search term
//   const monthAndYear =
//     profits.length > 0
//       ? `${new Date(profits[0].transactionDate).toLocaleString("default", {
//           month: "long",
//         })} ${new Date(profits[0].transactionDate).getFullYear()}`
//       : "N/A";
//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error loading data</p>;

//   // Filter profits by search term (name or vehicle number)
//   const filteredProfits = profits.filter(
//     (profit) =>
//       profit.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       profit.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const generatePDF = () => {
//     MonthProfitPdf({ groupedProfits, monthAndYear });
//   };
//   const groupedProfits = filteredProfits.reduce((acc, profit) => {
//     const ownerName = profit.owner.name;
//     if (!acc[ownerName]) {
//       acc[ownerName] = [];
//     }
//     acc[ownerName].push(profit);
//     return acc;
//   }, {});

//   let totalExpense = 0;
//   let totalProfit = 0;
//   let totalOwnerAmount = 0;
//   // Function to generate PDF
//   // Function to generate PDF
//   // Function to generate PDF

//   return (
//     <div className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
//       <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-300">
//         Transactions of {monthAndYear}
//       </h2>

//       {/* Search input */}
//       <input
//         type="text"
//         placeholder="Search by owner name or vehicle number..."
//         className="mb-4 p-2 border border-gray-300 rounded-md w-full"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)} // Update search term
//       />

//       <div className="overflow-auto max-h-96">
//         {" "}
//         {/* Scrollable table */}
//         {Object.keys(groupedProfits).map((ownerName) => {
//           const ownerProfits = groupedProfits[ownerName];

//           let totalIncome = 0;
//           let totalGst = 0;
//           let totalTds = 0;
//           let totalEsi = 0;
//           let totalPf = 0;
//           let totalOpeningBalance = 0;
//           let totalClosingBalance = 0;

//           return (
//             <div key={ownerName} className="mb-8">
//               <button
//                 onClick={generatePDF}
//                 className="mb-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//               >
//                 Download PDF
//               </button>

//               <table className="min-w-full table-auto border-collapse">
//                 <thead>
//                   <tr className="bg-gray-200 dark:bg-gray-700">
//                     {/* Sticky header */}
//                     <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
//                       In.No
//                     </th>
//                     <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
//                       Veh.No
//                     </th>
//                     <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
//                       Owner Name
//                     </th>
//                     <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
//                       Amount
//                     </th>
//                     <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
//                       GST (Calculated)
//                     </th>
//                     <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
//                       TDS (Calculated)
//                     </th>
//                     <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
//                       PF
//                     </th>
//                     <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
//                       ESI
//                     </th>
//                     <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
//                       Owner Amount
//                     </th>
//                     <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
//                       Amount with GST
//                     </th>
//                     <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
//                       Profit
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {ownerProfits.map((profit) => {
//                     const gstValue = (profit.amount * profit.gst) / 100;
//                     const tdsValue = (profit.amount * profit.tds) / 100;
//                     const amountWithGst = profit.amount + gstValue;
//                     const profitValue =
//                       profit.amount -
//                       profit.pf -
//                       profit.esi -
//                       profit.ownerAmount;

//                     totalIncome += profit.amount;
//                     totalGst += gstValue;
//                     totalTds += tdsValue;
//                     totalEsi += profit.esi;
//                     totalPf += profit.pf;
//                     totalOpeningBalance += profit.openingBalance;
//                     totalClosingBalance +=
//                       profit.closingBalance ||
//                       profit.openingBalance +
//                         profit.amount +
//                         gstValue -
//                         Number(profit.ownerAmount) -
//                         profit.pf -
//                         profit.esi -
//                         profit.expense;

//                     totalExpense += profit.expense || 0;
//                     totalProfit += profitValue;
//                     totalOwnerAmount += Number(profit.ownerAmount);
//                     console.log("profit.openingBalance", profit.openingBalance);
//                     console.log("totalIncome", totalIncome);
//                     console.log("totalGst", totalGst);
//                     console.log("totalOwnerAmount", totalOwnerAmount);
//                     console.log(" profit.expense", profit.expense);
//                     return (
//                       <tr
//                         key={profit._id}
//                         className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
//                         onClick={() =>
//                           navigate(`/admin/monthprofittableedit/${profit._id}`)
//                         }
//                       >
//                         <td className="border p-2">{profit.invoiceNumber}</td>
//                         <td className="border p-2">{profit.vehicleNumber}</td>
//                         <td className="border p-2">{profit.ownerName}</td>
//                         <td className="border p-2">
//                           {profit.amount.toFixed(2)}
//                         </td>
//                         <td className="border p-2">{gstValue.toFixed(2)}</td>
//                         <td className="border p-2">{tdsValue.toFixed(2)}</td>
//                         <td className="border p-2">
//                           {profit.pf?.toFixed(2) || "0.00"}
//                         </td>
//                         <td className="border p-2">
//                           {profit.esi?.toFixed(2) || "0.00"}
//                         </td>
//                         <td className="border p-2">
//                           {Number(profit.ownerAmount)?.toFixed(2) || "0.00"}
//                         </td>
//                         <td className="border p-2">
//                           {amountWithGst.toFixed(2)}
//                         </td>
//                         <td className="border p-2">{profitValue.toFixed(2)}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>

//               <div className="mt-4">
//                 <h4 className="text-lg font-bold text-gray-800 dark:text-gray-300">
//                   Summary for {ownerName}
//                 </h4>
//                 <p>Total Income This Month: {totalIncome.toFixed(2)}</p>
//                 <p>Total GST Collected: {totalGst.toFixed(2)}</p>
//                 <p>Total TDS Collected: {totalTds.toFixed(2)}</p>
//                 <p>Total ESI: {totalEsi.toFixed(2)}</p>
//                 <p>Total PF: {totalPf.toFixed(2)}</p>
//                 <p>Total Opening Balance: {totalOpeningBalance.toFixed(2)}</p>
//                 <p>Total Closing Balance: {totalClosingBalance.toFixed(2)}</p>
//               </div>
//             </div>
//           );
//         })}
//         <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
//           <h3 className="text-lg font-bold text-gray-800 dark:text-gray-300">
//             Global Summary
//           </h3>
//           <p>Total Expense: {totalExpense.toFixed(2)}</p>
//           <p>Total Profit: {totalProfit.toFixed(2)}</p>
//           <p>Total Owner Amount: {totalOwnerAmount.toFixed(2)}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MonthProfitTable;
import React, { useEffect, useState } from "react";
import { useGetMonthProfitsQuery } from "../store/api/MonthProfitApi";
import { useNavigate } from "react-router-dom"; // for navigation
import MonthProfitPdf from "./MonthProfitPdf";
import jsPDF from "jspdf";
import "jspdf-autotable";
const MonthProfitTable = () => {
  const {
    data: profits = [],
    error,
    isLoading,
    refetch,
  } = useGetMonthProfitsQuery();
  const navigate = useNavigate(); // For redirection
  useEffect(() => {
    refetch();
  }, [refetch]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const monthAndYear =
    profits.length > 0
      ? `${new Date(profits[0].transactionDate).toLocaleString("default", {
          month: "long",
        })} ${new Date(profits[0].transactionDate).getFullYear()}`
      : "N/A";
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  // Filter profits by search term (name or vehicle number)
  const filteredProfits = profits.filter(
    (profit) =>
      profit.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profit.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const generatePDF = () => {
    MonthProfitPdf({ groupedProfits, monthAndYear });
  };
  const groupedProfits = filteredProfits.reduce((acc, profit) => {
    const ownerName = profit.owner.name;
    if (!acc[ownerName]) {
      acc[ownerName] = [];
    }
    acc[ownerName].push(profit);
    return acc;
  }, {});

  let totalExpense = 0;
  let totalProfit = 0;
  let totalOwnerAmount = 0;
  // Function to generate PDF

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-300">
        Transactions of {monthAndYear}
      </h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by owner name or vehicle number..."
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
      />

      <div className="overflow-auto max-h-96">
        {" "}
        {/* Scrollable table */}
        {Object.keys(groupedProfits).map((ownerName) => {
          const ownerProfits = groupedProfits[ownerName];

          let totalIncome = 0;
          let totalGst = 0;
          let totalTds = 0;

          let totalOpeningBalance = 0;
          let totalClosingBalance = 0;

          return (
            <div key={ownerName} className="mb-8">
              <button
                onClick={generatePDF}
                className="mb-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Download PDF
              </button>

              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    {/* Sticky header */}
                    <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
                      In.No
                    </th>
                    <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
                      Veh.No
                    </th>
                    <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
                      Owner Name
                    </th>
                    <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
                      Amount
                    </th>
                    <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
                      GST (Calculated)
                    </th>
                    <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
                      TDS (Calculated)
                    </th>

                    <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
                      Owner Amount
                    </th>
                    <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
                      Amount with GST
                    </th>
                    <th className="border p-2 text-gray-800 dark:text-gray-300 sticky top-0 z-10 bg-gray-200 dark:bg-gray-700">
                      Profit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ownerProfits.map((profit) => {
                    const gstValue = (profit.amount * profit.gst) / 100;
                    const tdsValue = (profit.amount * profit.tds) / 100;
                    const amountWithGst = profit.amount + gstValue;
                    const profitValue =
                      profit.amount - tdsValue - profit.ownerAmount;

                    totalIncome += profit.amount;
                    totalGst += gstValue;
                    totalTds += tdsValue;

                    totalOpeningBalance += profit.openingBalance;
                    totalClosingBalance +=
                      profit.closingBalance ||
                      profit.openingBalance +
                        profit.amount +
                        gstValue -
                        totalTds -
                        Number(profit.ownerAmount) -
                        profit.expense;

                    totalExpense += profit.expense || 0;
                    totalProfit += profitValue;
                    totalOwnerAmount += Number(profit.ownerAmount);
                    console.log("profit.openingBalance", profit.openingBalance);
                    console.log("totalIncome", totalIncome);
                    console.log("totalGst", totalGst);
                    console.log("totalOwnerAmount", totalOwnerAmount);
                    console.log(" profit.expense", profit.expense);
                    return (
                      <tr
                        key={profit._id}
                        className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        onClick={() =>
                          navigate(`/admin/monthprofittableedit/${profit._id}`)
                        }
                      >
                        <td className="border p-2">{profit.invoiceNumber}</td>
                        <td className="border p-2">{profit.vehicleNumber}</td>
                        <td className="border p-2">{profit.ownerName}</td>
                        <td className="border p-2">
                          {profit?.amount?.toFixed(2)}
                        </td>
                        <td className="border p-2">{gstValue.toFixed(2)}</td>
                        <td className="border p-2">{tdsValue.toFixed(2)}</td>

                        <td className="border p-2">
                          {Number(profit.ownerAmount)?.toFixed(2) || "0.00"}
                        </td>
                        <td className="border p-2">
                          {amountWithGst.toFixed(2)}
                        </td>
                        <td className="border p-2">{profitValue.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="mt-4">
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-300">
                  Summary for {ownerName}
                </h4>
                <p>Total Income This Month: {totalIncome.toFixed(2)}</p>
                <p>Total GST Collected: {totalGst.toFixed(2)}</p>
                <p>Total TDS Collected: {totalTds.toFixed(2)}</p>

                <p>Total Opening Balance: {totalOpeningBalance.toFixed(2)}</p>
                <p>Total Closing Balance: {totalClosingBalance.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-300">
            Global Summary
          </h3>
          <p>Total Expense: {totalExpense.toFixed(2)}</p>
          <p>Total Profit: {totalProfit.toFixed(2)}</p>
          <p>Total Owner Amount: {totalOwnerAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default MonthProfitTable;
