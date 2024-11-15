// import React from "react";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// function MonthProfitPdf({ groupedProfits, monthAndYear }) {
//   // Check if groupedProfits exists and is not empty before proceeding
//   if (!groupedProfits || Object.keys(groupedProfits).length === 0) {
//     return null; // Do not proceed if there's no data
//   }
//   const doc = new jsPDF();

//   // Set the title and customize the font style
//   doc.setFontSize(10);
//   doc.setFont("Helvetica", "normal");
//   doc.text(`Transactions for ${monthAndYear}`, 14, 15);

//   let currentY = 20;

//   // Iterate through the grouped profits to create sections for each owner
//   Object.keys(groupedProfits).forEach((ownerName) => {
//     const ownerProfits = groupedProfits[ownerName];
//     let totalIncome = 0,
//       totalGst = 0,
//       totalTds = 0,
//       totalPf = 0,
//       totalEsi = 0;
//     let totalOpeningBalance = 0,
//       totalClosingBalance = 0,
//       totalOwnerAmount = 0,
//       totalProfit = 0,
//       totalExpense = 0;

//     const tableData = ownerProfits.map((profit) => {
//       const gstValue = (profit.amount * profit.gst) / 100;
//       const tdsValue = (profit.amount * profit.tds) / 100;
//       const profitValue =
//         profit.amount - profit.pf - profit.esi - profit.ownerAmount;

//       totalIncome += profit.amount;
//       totalGst += gstValue;
//       totalTds += tdsValue;
//       totalPf += profit.pf;
//       totalEsi += profit.esi;
//       totalOpeningBalance += profit.openingBalance || 0;
//       totalClosingBalance +=
//         profit.closingBalance ||
//         profit.openingBalance +
//           profit.amount +
//           gstValue -
//           profit.pf -
//           profit.esi -
//           profit.ownerAmount -
//           profit.expense;
//       totalOwnerAmount += Number(profit.ownerAmount);
//       totalProfit += profitValue;
//       totalExpense += profit.expense || 0;

//       return [
//         profit.invoiceNumber,
//         profit.vehicleNumber,
//         profit.ownerName,
//         profit.amount.toFixed(2),
//         gstValue.toFixed(2),
//         tdsValue.toFixed(2),
//         profit.pf?.toFixed(2) || "0.00",
//         profit.esi?.toFixed(2) || "0.00",
//         profit.ownerAmount,
//         (profit.amount + gstValue).toFixed(2),
//         profitValue.toFixed(2),
//       ];
//     });

//     // Section title for each owner
//     doc.setFontSize(12);
//     doc.text(ownerName, 14, currentY + 15);

//     // Auto-table customization for grid-like theme
//     doc.autoTable({
//       head: [
//         [
//           "In.No",
//           "Veh.No",
//           "Owner Name",
//           "Amount",
//           "GST",
//           "TDS",
//           "PF",
//           "ESI",
//           "Owner Amount",
//           "Amount with GST",
//           "Profit",
//         ],
//       ],
//       body: tableData,
//       startY: currentY + 5,
//       theme: "grid",
//       styles: {
//         fontSize: 8, // Font size for the table
//         cellPadding: 2,
//         valign: "middle",
//         halign: "center",
//       },
//       headStyles: {
//         fillColor: [22, 160, 133],
//         textColor: [255, 255, 255],
//         fontStyle: "bold",
//       },
//     });

//     currentY = doc.lastAutoTable.finalY + 5;

//     // Owner Summary Data
//     const ownerSummaryData = [
//       `Total Income This Month: ${totalIncome.toFixed(2)}`,
//       `Total GST Collected: ${totalGst.toFixed(2)}`,
//       `Total TDS Collected: ${totalTds.toFixed(2)}`,
//       `Total ESI: ${totalEsi.toFixed(2)}`,
//       `Total PF: ${totalPf.toFixed(2)}`,
//       `Total Opening Balance: ${totalOpeningBalance.toFixed(2)}`,
//       `Total Closing Balance: ${totalClosingBalance.toFixed(2)}`,
//       `Total Expense: ${totalExpense.toFixed(2)}`,
//       `Total Owner Amount: ${totalOwnerAmount.toFixed(2)}`,
//       `Total Profit: ${totalProfit.toFixed(2)}`,
//     ];

//     const boxX = 10; // X position of the box
//     const lineHeight = 6; // Height for each line of text
//     const boxPadding = 8; // Padding inside the box
//     const boxWidth = 190; // Width of the box

//     // Calculate the box height dynamically based on the number of summary lines
//     const boxHeight = ownerSummaryData.length * lineHeight + boxPadding;

//     const boxY = currentY + 10; // Adjust to position it just below the table

//     // Remove the outer box (border around the whole summary section)
//     // doc.rect(boxX, boxY, boxWidth, boxHeight); // x, y, width, height

//     doc.setFontSize(8); // Use the same font size as the table
//     ownerSummaryData.forEach((text, index) => {
//       const lineY = boxY + boxPadding + index * lineHeight;
//       doc.text(text, boxX + 5, lineY); // Print the summary text inside the box
//     });

//     // Update the Y position for the next section
//     currentY += boxHeight + 20; // Adjust based on content and box height
//   });

//   // Save the PDF
//   doc.save("month_profit_report.pdf");
// }

// export default MonthProfitPdf;
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function MonthProfitPdf({ groupedProfits, monthAndYear }) {
  // Check if groupedProfits exists and is not empty before proceeding
  if (!groupedProfits || Object.keys(groupedProfits).length === 0) {
    return null; // Do not proceed if there's no data
  }

  const doc = new jsPDF();

  // Set the title and customize the font style
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.text(`Transactions for ${monthAndYear}`, 14, 15);

  let currentY = 20;

  // Iterate through the grouped profits to create sections for each owner
  Object.keys(groupedProfits).forEach((ownerName) => {
    const ownerProfits = groupedProfits[ownerName];
    let totalIncome = 0,
      totalGst = 0,
      totalTds = 0;
    let totalOpeningBalance = 0,
      totalClosingBalance = 0,
      totalOwnerAmount = 0,
      totalProfit = 0,
      totalExpense = 0;

    const tableData = ownerProfits.map((profit) => {
      const gstValue = (profit.amount * profit.gst) / 100;
      const tdsValue = (profit.amount * profit.tds) / 100;
      const profitValue = profit.amount - tdsValue - profit.ownerAmount;

      totalIncome += profit.amount;
      totalGst += gstValue;
      totalTds += tdsValue;
      totalOpeningBalance += profit.openingBalance || 0;
      totalClosingBalance +=
        profit.closingBalance ||
        profit.openingBalance +
          profit.amount +
          gstValue -
          totalTds -
          profit.ownerAmount -
          profit.expense;
      totalOwnerAmount += Number(profit.ownerAmount);
      totalProfit += profitValue;
      totalExpense += profit.expense || 0;

      return [
        profit.invoiceNumber,
        profit.vehicleNumber,
        profit.ownerName,
        profit.amount.toFixed(2),
        gstValue.toFixed(2),
        tdsValue.toFixed(2),
        profit.ownerAmount,
        (profit.amount + gstValue).toFixed(2),
        profitValue.toFixed(2),
      ];
    });

    // Section title for each owner
    doc.setFontSize(12);
    doc.text(ownerName, 14, currentY + 15);

    // Auto-table customization for grid-like theme
    doc.autoTable({
      head: [
        [
          "In.No",
          "Veh.No",
          "Owner Name",
          "Amount",
          "GST",
          "TDS",
          "Owner Amount",
          "Amount with GST",
          "Profit",
        ],
      ],
      body: tableData,
      startY: currentY + 5,
      theme: "grid",
      styles: {
        fontSize: 8, // Font size for the table
        cellPadding: 2,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    currentY = doc.lastAutoTable.finalY + 5;

    // Owner Summary Data
    const ownerSummaryData = [
      `Total Income This Month: ${totalIncome.toFixed(2)}`,
      `Total GST Collected: ${totalGst.toFixed(2)}`,
      `Total TDS Collected: ${totalTds.toFixed(2)}`,
      `Total Opening Balance: ${totalOpeningBalance.toFixed(2)}`,
      `Total Closing Balance: ${totalClosingBalance.toFixed(2)}`,
      `Total Expense: ${totalExpense.toFixed(2)}`,
      `Total Owner Amount: ${totalOwnerAmount.toFixed(2)}`,
      `Total Profit: ${totalProfit.toFixed(2)}`,
    ];

    const boxX = 10; // X position of the box
    const lineHeight = 6; // Height for each line of text
    const boxPadding = 8; // Padding inside the box
    const boxWidth = 190; // Width of the box

    // Calculate the box height dynamically based on the number of summary lines
    const boxHeight = ownerSummaryData.length * lineHeight + boxPadding;

    const boxY = currentY + 10; // Adjust to position it just below the table

    doc.setFontSize(8); // Use the same font size as the table
    ownerSummaryData.forEach((text, index) => {
      const lineY = boxY + boxPadding + index * lineHeight;
      doc.text(text, boxX + 5, lineY); // Print the summary text inside the box
    });

    // Update the Y position for the next section
    currentY += boxHeight + 20; // Adjust based on content and box height
  });

  // Save the PDF
  doc.save("month_profit_report.pdf");
}

export default MonthProfitPdf;
