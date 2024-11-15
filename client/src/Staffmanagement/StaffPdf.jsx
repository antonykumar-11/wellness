import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
    size: "A4", // Set the page size to A4
  },
  section: {
    marginBottom: 15,
  },
  table: {
    display: "table",
    width: "auto",
    marginVertical: 10,
    border: "1px solid #ddd", // Softer border color for the table
    borderCollapse: "collapse", // To visually simulate collapsed borders
  },
  tableRow: {
    flexDirection: "row",
    borderCollapse: "collapse", // Simulate collapsed borders
  },
  tableCell: {
    border: "1px solid #ddd", // Softer border for the cells
    padding: 8,
    fontSize: 8, // Increased font size for better readability
    flexGrow: 1,
    textAlign: "center",
  },
  headerCell: {
    backgroundColor: "#f8f9fa", // Slightly darker background for the header
    fontWeight: "bold",
    fontSize: 10, // Larger font for header
    padding: 10, // Increase padding for better spacing
    border: "1px solid #ccc", // Lighter border for a cleaner look
    textAlign: "center",
    color: "#333", // Darker text color for contrast
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center", // Center-align the title
    color: "#333", // Darker color for the title
  },
  subTitle: {
    fontSize: 12,
    marginBottom: 5,
    color: "#555", // Softer subtitle color
  },
  lastCell: {
    borderRightWidth: 1,
  },
});

// PDF Document Component
const StaffPdf = ({ vehicleRecords, vehicleNumber, ownerName }) => (
  <Document>
    <Page style={styles.page}>
      {/* Header Section */}
      <View style={styles.section}>
        <Text style={styles.title}>Vehicle Rent Details</Text>
        <Text style={styles.subTitle}>Owner: {ownerName}</Text>
        <Text style={styles.subTitle}>Vehicle Number: {vehicleNumber}</Text>
      </View>

      {/* Table Section */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          {[
            "Date",
            "Opening\nTime",
            "Closing\nTime",
            "Hour\nInDay",
            "OverTime",
            "Breakdown\nHours",
            "Opening\nKM",
            "Closing\nKM",
            "Total\nKM",
            "Diesel\nUsed",
            "Remarks",
          ].map((header, index) => (
            <Text key={header} style={styles.headerCell}>
              {header}
            </Text>
          ))}
        </View>

        {/* Table rows can go here */}
      </View>
    </Page>
  </Document>
);

export default StaffPdf;

{
  /* Table Body
        {vehicleRecords.map((vehicle) => (
          <View key={vehicle._id} style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {new Date(vehicle.date).toLocaleDateString()}
            </Text>
            <Text style={styles.tableCell}>{vehicle.openingTime}</Text>
            <Text style={styles.tableCell}>{vehicle.closingTime}</Text>
            <Text style={styles.tableCell}>{vehicle.totalHMR}</Text>
            <Text style={styles.tableCell}>{vehicle.otHours}</Text>
            <Text style={styles.tableCell}>{vehicle.bdHours || "N/A"}</Text>
            <Text style={styles.tableCell}>{vehicle.openingKm}</Text>
            <Text style={styles.tableCell}>{vehicle.closingKm}</Text>
            <Text style={styles.tableCell}>{vehicle.totalKm}</Text>
            <Text style={styles.tableCell}>{vehicle.dieselUsed}</Text>
            <Text style={styles.tableCell}>{vehicle.remarks || "N/A"}</Text>
          </View>
        ))} */
}
