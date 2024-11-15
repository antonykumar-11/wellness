// import React from "react";
// import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// // Define PDF styles with A4 page size and proper content alignment
// const styles = StyleSheet.create({
//   page: {
//     padding: 20,
//     backgroundColor: "#f3f4f6",
//     fontSize: 10,
//   },
//   heading: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#374151",
//     textAlign: "center",
//   },
//   text: {
//     fontSize: 12,
//     marginBottom: 15,
//     color: "#6b7280",
//     marginLeft: 10,
//   },
//   table: {
//     display: "table",
//     width: "100%",
//     marginTop: 5,
//   },
//   row: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#d1d5db",
//     minHeight: 20,
//   },
//   cell: {
//     padding: 8,
//     flex: 1,
//     fontSize: 8,
//     color: "#374151",
//     textAlign: "center",
//     borderRightWidth: 1,
//     borderRightColor: "#d1d5db",
//   },
//   header: {
//     backgroundColor: "#e5e7eb",
//     fontWeight: "bold",
//     position: "fixed", // Ensure the header stays at the top
//     top: 0, // Align to top of new page
//   },
//   altRow: {
//     backgroundColor: "#f9fafb",
//   },
//   totalsRow: {
//     backgroundColor: "#d1d5db",
//     fontWeight: "bold",
//   },
//   noBorder: {
//     borderRightWidth: 0,
//   },
// });

// // TableHeader Component: Repeat on every page
// const TableHeader = () => (
//   <View style={[styles.row, styles.header]}>
//     {[
//       "Date",
//       "Opening Time",
//       "Closing Time",
//       "Total HMR",
//       "OT / Hrs",
//       "B/D Hrs",
//       "Opening KM",
//       "Closing KM",
//       "Total KM",
//       "Diesel Used",
//       "Remarks",
//     ].map((header, index) => (
//       <Text
//         style={[styles.cell, index === 10 ? styles.noBorder : null]}
//         key={header}
//       >
//         {header}
//       </Text>
//     ))}
//   </View>
// );

// const InvoicePDF = ({ vehicleRecords, ownerName, vehicleNumber }) => {
//   const renderRows = (records) => {
//     return records.map((vehicle, index) => (
//       <View
//         style={[styles.row, index % 2 ? styles.altRow : null]}
//         key={vehicle._id}
//       >
//         <Text style={styles.cell}>
//           {vehicle.date ? new Date(vehicle.date).toLocaleDateString() : "N/A"}
//         </Text>
//         <Text style={styles.cell}>{vehicle.openingTime || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.closingTime || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.totalHMR || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.otHours || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.bdHours || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.openingKm || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.closingKm || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.totalKm || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.diesel || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.remarks || "N/A"}</Text>
//       </View>
//     ));
//   };

//   const renderTotalRow = (records) => (
//     <View style={[styles.row, styles.totalsRow]}>
//       <Text style={styles.cell}>Totals:</Text>
//       <Text style={styles.cell}></Text>
//       <Text style={styles.cell}></Text>
//       <Text style={styles.cell}>
//         {records.reduce((sum, v) => sum + (v.totalHMR || 0), 0)}
//       </Text>
//       <Text style={styles.cell}>
//         {records.reduce((sum, v) => sum + (v.otHours || 0), 0)}
//       </Text>
//       <Text style={styles.cell}>
//         {records.reduce((sum, v) => sum + (v.bdHours || 0), 0)}
//       </Text>
//       <Text style={styles.cell}></Text>
//       <Text style={styles.cell}></Text>
//       <Text style={styles.cell}>
//         {records.reduce((sum, v) => sum + (v.totalKm || 0), 0)}
//       </Text>
//       <Text style={styles.cell}>
//         {records.reduce((sum, v) => sum + (v.diesel || 0), 0)}
//       </Text>
//       <Text style={styles.cell}></Text>
//     </View>
//   );

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Heading */}
//         <View>
//           <Text style={styles.heading}>
//             Vehicle Rent Details for {vehicleRecords[0]?.vehicleName || "N/A"}{" "}
//             Vehicle No: {vehicleNumber || "N/A"}
//             <Text style={styles.text}>Owner: {ownerName || "N/A"}</Text>
//           </Text>
//         </View>

//         {/* Table with pagination support */}
//         <View style={styles.table}>
//           <TableHeader />
//           {renderRows(vehicleRecords)}
//         </View>

//         {/* Totals displayed at the bottom (on the last page) */}
//         {renderTotalRow(vehicleRecords)}
//       </Page>
//     </Document>
//   );
// };

// export default InvoicePDF;
// import React from "react";
// import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// // Define PDF styles with A4 page size and proper content alignment
// const styles = StyleSheet.create({
//   page: {
//     padding: 20,
//     backgroundColor: "#f3f4f6",
//     fontSize: 10,
//   },
//   heading: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#374151",
//     textAlign: "center",
//   },
//   text: {
//     fontSize: 12,
//     marginBottom: 15,
//     color: "#6b7280",
//     marginLeft: 10,
//   },
//   table: {
//     display: "table",
//     width: "100%",
//     marginTop: 5,
//   },
//   row: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#d1d5db",
//     minHeight: 20,
//     breakInside: "avoid", // Prevent breaking between pages
//     wrap: true, // Ensures rows don't break mid-way
//   },
//   cell: {
//     padding: 8,
//     flex: 1,
//     fontSize: 8,
//     color: "#374151",
//     textAlign: "center",
//     borderRightWidth: 1,
//     borderRightColor: "#d1d5db",
//   },
//   header: {
//     backgroundColor: "#e5e7eb",
//     fontWeight: "bold",
//     position: "sticky",
//     top: 0,
//   },
//   altRow: {
//     backgroundColor: "#f9fafb",
//   },
//   totalsRow: {
//     backgroundColor: "#d1d5db",
//     fontWeight: "bold",
//     // Force totals row to the next page if necessary
//     breakBefore: "always",
//   },
//   noBorder: {
//     borderRightWidth: 0,
//   },
// });

// // TableHeader Component: Repeat on every page
// const TableHeader = () => (
//   <View style={[styles.row, styles.header]}>
//     {[
//       "Date",
//       "Opening Time",
//       "Closing Time",
//       "Total HMR",
//       "OT / Hrs",
//       "B/D Hrs",
//       "Opening KM",
//       "Closing KM",
//       "Total KM",
//       "Diesel Used",
//       "Remarks",
//     ].map((header, index) => (
//       <Text
//         style={[styles.cell, index === 10 ? styles.noBorder : null]}
//         key={header}
//       >
//         {header}
//       </Text>
//     ))}
//   </View>
// );

// const InvoicePDF = ({ vehicleRecords, ownerName, vehicleNumber }) => {
//   const renderRows = (records) => {
//     return records.map((vehicle, index) => (
//       <View
//         style={[styles.row, index % 2 ? styles.altRow : null]}
//         key={vehicle._id}
//       >
//         <Text style={styles.cell}>
//           {vehicle.date ? new Date(vehicle.date).toLocaleDateString() : "N/A"}
//         </Text>
//         <Text style={styles.cell}>{vehicle.openingTime || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.closingTime || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.totalHMR || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.otHours || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.bdHours || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.openingKm || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.closingKm || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.totalKm || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.diesel || "N/A"}</Text>
//         <Text style={styles.cell}>{vehicle.remarks || "N/A"}</Text>
//       </View>
//     ));
//   };

//   const renderTotalRow = (records) => (
//     <View style={[styles.row, styles.totalsRow]}>
//       <Text style={styles.cell}>Totals:</Text>
//       <Text style={styles.cell}></Text>
//       <Text style={styles.cell}></Text>
//       <Text style={styles.cell}>
//         {records.reduce((sum, v) => sum + (v.totalHMR || 0), 0)}
//       </Text>
//       <Text style={styles.cell}>
//         {records.reduce((sum, v) => sum + (v.otHours || 0), 0)}
//       </Text>
//       <Text style={styles.cell}>
//         {records.reduce((sum, v) => sum + (v.bdHours || 0), 0)}
//       </Text>
//       <Text style={styles.cell}></Text>
//       <Text style={styles.cell}></Text>
//       <Text style={styles.cell}>
//         {records.reduce((sum, v) => sum + (v.totalKm || 0), 0)}
//       </Text>
//       <Text style={styles.cell}>
//         {records.reduce((sum, v) => sum + (v.diesel || 0), 0)}
//       </Text>
//       <Text style={styles.cell}></Text>
//     </View>
//   );

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Heading */}
//         <View>
//           <Text style={styles.heading}>
//             Vehicle Rent Details for {vehicleRecords[0]?.vehicleName || "N/A"}{" "}
//             Vehicle No: {vehicleNumber || "N/A"}
//             <Text style={styles.text}>Owner: {ownerName || "N/A"}</Text>
//           </Text>
//         </View>

//         {/* Table with pagination support */}
//         <View style={styles.table}>
//           <TableHeader />
//           {renderRows(vehicleRecords)}
//         </View>

//         {/* Totals displayed at the bottom (on the last page) */}
//         {renderTotalRow(vehicleRecords)}
//       </Page>
//     </Document>
//   );
// };

// export default InvoicePDF;
import jsPDF from "jspdf";
import "jspdf-autotable";

const InvoicePDF = ({ vehicleRecords, ownerName, vehicleNumber }) => {
  const doc = new jsPDF("p", "pt", "a4");

  // Title
  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text(
    `Vehicle Rent Details for ${vehicleRecords[0]?.vehicleName || "N/A"}`,
    40,
    40
  );

  // Add owner and vehicle number
  doc.setFontSize(12);
  doc.text(`Owner: ${ownerName}`, 40, 60);
  doc.text(`Vehicle No: ${vehicleNumber}`, 40, 80);

  // Table Columns
  const tableColumn = [
    { title: "Date", dataKey: "date" },
    { title: "Opening Time", dataKey: "openingTime" },
    { title: "Closing Time", dataKey: "closingTime" },
    { title: "Total HMR", dataKey: "totalHMR" },
    { title: "OT / Hrs", dataKey: "otHours" },
    { title: "B/D Hrs", dataKey: "bdHours" },
    { title: "Opening KM", dataKey: "openingKm" },
    { title: "Closing KM", dataKey: "closingKm" },
    { title: "Total KM", dataKey: "totalKm" },
    { title: "Diesel Used", dataKey: "diesel" },
    { title: "Remarks", dataKey: "remarks" },
  ];

  // Prepare Table Rows
  const tableRows = vehicleRecords.map((vehicle) => ({
    date: vehicle.date ? new Date(vehicle.date).toLocaleDateString() : "N/A",
    openingTime: vehicle.openingTime || "",
    closingTime: vehicle.closingTime || "",
    totalHMR: vehicle.totalHMR || "",
    otHours: vehicle.otHours || "",
    bdHours: vehicle.bdHours || "",
    openingKm: vehicle.openingKm || "",
    closingKm: vehicle.closingKm || "",
    totalKm: vehicle.totalKm || "",
    diesel: vehicle.diesel || "",
    remarks: vehicle.remarks || "",
  }));

  // AutoTable with styles
  doc.autoTable({
    head: [
      tableColumn.map((col) => ({
        content: col.title,
        styles: { halign: "center", fontStyle: "bold" },
      })),
    ],
    body: tableRows.map((row) => [
      { content: row.date, styles: { halign: "center" } },
      { content: row.openingTime, styles: { halign: "center" } },
      { content: row.closingTime, styles: { halign: "center" } },
      { content: row.totalHMR, styles: { halign: "center" } },
      { content: row.otHours, styles: { halign: "center" } },
      { content: row.bdHours, styles: { halign: "center" } },
      { content: row.openingKm, styles: { halign: "center" } },
      { content: row.closingKm, styles: { halign: "center" } },
      { content: row.totalKm, styles: { halign: "center" } },
      { content: row.diesel, styles: { halign: "center" } },
      { content: row.remarks, styles: { halign: "center" } },
    ]),
    startY: 100,
    styles: {
      cellPadding: 3,
      fontSize: 10,
      overflow: "linebreak",
    },
    theme: "grid", // You can also use 'grid' or 'plain'
  });

  // Calculate Totals
  const totalHMR = vehicleRecords.reduce(
    (sum, vehicle) => sum + (vehicle.totalHMR || 0),
    0
  );
  const totalOT = vehicleRecords.reduce(
    (sum, vehicle) => sum + (vehicle.otHours || 0),
    0
  );
  const totalBD = vehicleRecords.reduce(
    (sum, vehicle) => sum + (vehicle.bdHours || 0),
    0
  );
  const totalKM = vehicleRecords.reduce(
    (sum, vehicle) => sum + (vehicle.totalKm || 0),
    0
  );
  const totalDiesel = vehicleRecords.reduce(
    (sum, vehicle) => sum + (vehicle.diesel || 0),
    0
  );

  // Add total row
  const startY = doc.autoTable.previous.finalY + 20;
  doc.setFontSize(12);
  doc.text("Totals:", 165, startY);
  doc.text(totalHMR.toString(), 224, startY);
  doc.text(totalOT.toString(), 265, startY);
  doc.text(totalBD.toString(), 300, startY);
  doc.text(totalKM.toString(), 438, startY);
  doc.text(totalDiesel.toString(), 479, startY);

  // Save the PDF
  doc.save(`${ownerName}_VehicleRentDetails.pdf`);
};

export default InvoicePDF;
