import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Define styles for PDF layout
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    backgroundColor: "#ffffff",
  },
  section: {
    marginBottom: 10,
    padding: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
  },
  value: {
    fontSize: 10,
  },
});

// Define the InvoicePDF component
const MonthInvoicePdf = ({ data }) => {
  // Check if data is valid
  if (!data || data.length === 0) {
    return null; // Return null if data is missing
  }

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.heading}>Month Profit Transactions Report</Text>

        {data.map((profit) => (
          <View key={profit._id} style={styles.section}>
            <Text style={styles.heading}>Owner: {profit.owner.name}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Invoice Number:</Text>
              <Text style={styles.value}>{profit.invoiceNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Vehicle Number:</Text>
              <Text style={styles.value}>{profit.vehicleNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>{profit.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>GST:</Text>
              <Text style={styles.value}>
                {((profit.amount * profit.gst) / 100).toFixed(2)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>TDS:</Text>
              <Text style={styles.value}>
                {((profit.amount * profit.tds) / 100).toFixed(2)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Owner Amount:</Text>
              <Text style={styles.value}>{profit.ownerAmount.toFixed(2)}</Text>
            </View>
          </View>
        ))}

        {/* Add a total summary at the end */}
        <View style={styles.section}>
          <Text style={styles.heading}>Global Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total Profits:</Text>
            <Text style={styles.value}>
              {data.reduce((sum, profit) => sum + profit.amount, 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MonthInvoicePdf;
