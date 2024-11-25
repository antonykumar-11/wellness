// invoice model 1
import React from "react";

import {
  StyleSheet,
  Document,
  Page,
  Text,
  Font,
  View,
  Image,
} from "@react-pdf/renderer";
import convertNumberToWords from "./convertNumberToWords";
import Logo from "../assets/file.png"; // Ensure the image is imported correctly
// Register custom fonts
Font.register({
  family: "Poppins",
  fonts: [
    { src: "/fonts/Poppins-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Poppins-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Poppins-Italic.ttf", fontStyle: "italic" },
    {
      src: "/fonts/Poppins-BoldItalic.ttf",
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
});
const colors = {
  primary: "#0000ff", // Blue color for the primary variable
  secondary: "#3d3d3d",
  white: "#fff",
};
const styles = StyleSheet.create({
  global: {
    margin: 0,
    padding: 0,
    boxSizing: "border-box", // This applies to borders within the PDF elements
    fontFamily: "Lato",
  },
  body: {
    backgroundColor: colors.white, // Apply white background
    padding: 30, // Apply 30px padding on all sides
  },

  page: {
    flexDirection: "column",
    backgroundColor: colors.white,
    padding: 35, // Padding for the entire page
  },
  invoiceHeader: {
    flexDirection: "row", // Align items horizontally
    justifyContent: "space-between", // Space between the text and the logo
    alignItems: "center", // Center items vertically
  },
  invoiceTitle: {
    textAlign: "center", // Align text to the center
    fontSize: 20, // Adjust font size as needed
    fontWeight: "bold", // Optional bold styling
    lineHeight: 1.5, // Adjust line height for better readability
    fontFamily: "Poppins",
    color: "#00FF00", // Solid green color
    marginBottom: 10, // Add bottom margin of 10 pixels
  },

  invoiceCompanyDetails: {
    marginTop: 5, // Add some space between the title and the details
  },
  invoiceCompanyDetailsText: {
    fontSize: 10, // Adjust font size for address details
    textAlign: "left", // Align text to the left
    lineHeight: 1.4, // Adjust line height for the address text
  },
  invoiceLogo: {
    width: 100, // Ensure this matches the height for a square image
    height: 100, // Ensure this matches the width for a square image
    objectFit: "cover", // Use cover to fill the square without stretching
    borderRadius: "50%", // Use 50% for a perfect circle
    position: "absolute", // Keep it positioned as desired
    right: 0, // Align to the right side
    bottom: 0.5,
  },

  invoiceTaxTitle: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "bold",
    color: "#2d3748",
  },

  invoiceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  invoiceDetailsText: {
    fontSize: 10, // Adjust font size for address details
    textAlign: "left", // Align text to the left
    lineHeight: 1.4, // Adjust line height for better readability
  },

  invoiceAddresses: {
    marginBottom: 32,
  },
  invoiceAddressesFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  invoiceAddress: {
    marginBottom: 24,
  },
  invoiceAddressTitle: {
    fontSize: 10,
    fontWeight: "bold",

    marginBottom: 4,
    textAlign: "center",

    fontFamily: "Poppins",

    color: "#2d3748",
  },
  invoiceItems: {
    marginBottom: 20,
  },
  tableContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderStyle: "solid",
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCellHeader: {
    flex: 1,
    padding: 8,
    backgroundColor: "red",
    borderRightWidth: 1,
    borderRightColor: "#D1D5DB",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCellDescriptionHeader: {
    flex: 2,
    padding: 8,
    backgroundColor: "red",
    borderRightWidth: 1,
    borderRightColor: "#D1D5DB",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#D1D5DB",
    fontSize: 10,
    textAlign: "center",
  },
  tableCellDescription: {
    flex: 2,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#D1D5DB",
    fontSize: 10,
    textAlign: "center",
  },
  rightContent: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#D1D5DB",
    borderStyle: "solid",
  },
  borderRightOnly: {
    borderRightWidth: 1,
    borderRightColor: "#D1D5DB",
    borderStyle: "solid",
  },
  tableCellNumeric: {
    textAlign: "center",
  },
  leftEmptySpace: {
    flex: 5,
  },
  lastTableCell: {
    padding: 8,
    fontSize: 12,
    textAlign: "center",
  },
  headerRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  dataRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  summaryRow: {
    backgroundColor: "#F3F4F6",
    borderTopWidth: 2,
    borderTopColor: "#D1D5DB",
  },
  summaryCell: {
    fontWeight: "bold",
    padding: 8,
  },
  summaryCellValue: {
    textAlign: "center",
    padding: 8,
  },

  invoiceAmountInWords: {
    marginTop: 16,
    fontSize: 10,
    fontWeight: "bold",

    textAlign: "right",

    fontFamily: "Poppins",

    color: "#2d3748",
  },

  invoiceBankDetailsTitle: {
    fontSize: 14,
    fontWeight: "bold",

    marginBottom: 4,
    textAlign: "left",

    fontFamily: "Poppins",

    color: "#2d3748",
  },
  invoiceBankDetailsText: {
    fontSize: 10, // Adjust font size for address details
    textAlign: "left", // Align text to the left
    lineHeight: 1.4,
  },
  invoiceDeclaration: {
    marginTop: 6,
    fontSize: 10, // Adjust font size for address details
    textAlign: "left", // Align text to the left
    lineHeight: 1.4,
  },
  invoiceSignature: {
    marginTop: 32,
    textAlign: "right",
    fontSize: 12,
    color: "#4a5568",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

const InvoicePDF = ({ data, invoiceList }) => {
  console.log("data", data.saleInvoiceNumber);
  console.log("invoiceList", invoiceList);
  // Convert the date string to a Date object
  const invoiceDate = new Date(data.transactionDate);
  if (invoiceList.length === 0) return <Text>No invoices found.</Text>;

  // Destructure the first invoice object from the invoiceList
  const {
    accountNumber,
    address1,
    address2,
    address3,
    address4,
    avatar,
    bankName,
    branch,
    companyName,
    description,
    email,
    gstNumber,
    ifsc,
    invoiceType,
    mobileNumber,
    pancardnumber,
  } = invoiceList;
  console.log("invoiceList", invoiceList);
  console.log("data", data);
  // Format the date to a more readable format
  const formattedDate = invoiceDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const calculateTotal = (itemGroups) => {
    let totalSubtotal = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let taxRate = 0; // Initialize tax rate

    itemGroups.forEach((group, index) => {
      console.log("Processing Group:", group);

      if (!Array.isArray(group)) {
        console.error("Invalid group structure:", group);
        return;
      }

      if (index === 0 && group.length > 0) {
        // Extract tax rate from the first item in the first group
        taxRate = group[0]?.taxRate ? Number(group[0].taxRate) : 0;
        console.log("Tax Rate:", taxRate);
      }

      // Calculate subtotal
      const subtotal = group.reduce(
        (acc, item) => acc + Number(item.rate || 0) * (item.quantity || 1),
        0
      );
      console.log("Subtotal for Group:", subtotal);

      // Calculate CGST and SGST
      const cgst = (subtotal * (taxRate / 2)) / 100;
      const sgst = (subtotal * (taxRate / 2)) / 100;

      console.log("CGST:", cgst, "SGST:", sgst);

      // Accumulate totals
      totalSubtotal += subtotal;
      totalCGST += cgst;
      totalSGST += sgst;
    });

    const overallTotal = totalSubtotal + totalCGST + totalSGST;

    console.log("Final Totals:", {
      totalSubtotal,
      totalCGST,
      totalSGST,
      overallTotal,
      taxRate,
    });

    return { totalSubtotal, totalCGST, totalSGST, overallTotal, taxRate };
  };

  const { totalSubtotal, totalCGST, totalSGST, overallTotal, taxRate } =
    calculateTotal([data.items]);
  console.log(" totalSubtota", totalSubtotal);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Invoice Header */}
        <Text style={styles.invoiceTitle}>{companyName}</Text>
        <View style={styles.bodyWrapper}>
          <View style={styles.invoiceHeader}>
            <View style={styles.invoiceTitleContainer}>
              <View style={styles.invoiceCompanyDetails}>
                <>
                  <Text style={styles.invoiceCompanyDetailsText}>
                    {address1}
                  </Text>
                  <Text style={styles.invoiceCompanyDetailsText}>
                    {address2}
                  </Text>
                  <Text style={styles.invoiceCompanyDetailsText}>
                    {address3}
                  </Text>
                  <Text style={styles.invoiceCompanyDetailsText}>
                    {address4}
                  </Text>
                  <Text style={styles.invoiceCompanyDetailsText}>
                    EMAIL : {email}
                  </Text>
                  <Text style={styles.invoiceCompanyDetailsText}>
                    GST N0 : {gstNumber}
                  </Text>
                  <Text style={styles.invoiceCompanyDetailsText}>
                    MOB : {mobileNumber}
                  </Text>
                </>
              </View>
            </View>
            <Image src={avatar} style={styles.invoiceLogo} />
          </View>

          <Text style={styles.invoiceTaxTitle}>{invoiceType}</Text>
          <View style={styles.invoiceDetails}>
            <View>
              <Text style={styles.invoiceDetailsText}>
                PAN NO: {pancardnumber}
              </Text>
              <Text style={styles.invoiceDetailsText}>GST NO: {gstNumber}</Text>
            </View>
            <View>
              <Text style={styles.invoiceDetailsText}>
                INVOICE NO: {data.saleInvoiceNumber}
              </Text>
              <Text style={styles.invoiceDetailsText}>
                DATE: {formattedDate}
              </Text>
            </View>
          </View>

          {/* Billed and Shipped To Addresses */}
          <View style={styles.invoiceAddresses}>
            <View style={styles.invoiceAddressesFlex}>
              <View>
                <Text style={styles.invoiceAddressTitle}>Billed To:</Text>

                <>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedBy.street}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedBy.MainArea}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedBy.postOffice}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedBy.ZIPCode}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedBy.City}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedBy.State}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedBy.Country}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    PAN NO : {data.purchasedBy.companyPanNumber}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    GST NO :{data.purchasedBy.gstNumber}
                  </Text>
                </>
              </View>
              <View>
                <Text style={styles.invoiceAddressTitle}>Shipped To:</Text>

                <>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedTo.street}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedTo.MainArea}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedTo.postOffice}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedTo.ZIPCode}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedTo.City}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedTo.State}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    {data.purchasedTo.Country}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    PAN NO : {data.purchasedTo.companyPanNumber}
                  </Text>
                  <Text style={styles.invoiceDetailsText}>
                    GST NO : {data.purchasedTo.gstNumber}
                  </Text>
                </>
              </View>
            </View>
          </View>

          {/* Invoice Items */}
          <View style={[styles.tableContainer, styles.borderLeft]}>
            {/* Header Row */}
            <View style={[styles.tableRow, styles.headerRow]}>
              <Text style={styles.tableCellHeader}>Sl No.</Text>
              <Text style={styles.tableCellDescriptionHeader}>
                Item of description
              </Text>
              <Text style={styles.tableCellHeader}>HSN Code</Text>
              <Text style={styles.tableCellHeader}>Unit</Text>
              <Text style={styles.tableCellHeader}>Rate</Text>
              <Text style={styles.tableCellHeader}>Amount</Text>
            </View>
          </View>

          {/* Data Rows */}
          {data.items.map((item, index) => (
            <View style={[styles.tableRow, styles.dataRow]} key={index}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.tableCellDescription}>{item.stockName}</Text>
              <Text style={styles.tableCell}>{item.hsnCode}</Text>
              <Text style={[styles.tableCell, styles.tableCellNumeric]}>
                {item.unit}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellNumeric]}>
                {item.actualrate}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellNumeric]}>
                {item.amount}
              </Text>
            </View>
          ))}
          {/* Subtotal Row */}
          <View style={[styles.tableRow, styles.summaryRow]}>
            <View style={styles.leftEmptySpace} />
            <View style={[styles.rightContent, styles.borderRightOnly]}>
              <Text style={[styles.tableCell, styles.summaryCell]}>
                Subtotal
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableCellNumeric,
                  styles.summaryCellValue,
                ]}
              >
                {totalSubtotal}
              </Text>
            </View>
          </View>
          {/* CGST Row */}
          <View style={[styles.tableRow, styles.summaryRow]}>
            <View style={styles.leftEmptySpace} />
            <View style={[styles.rightContent, styles.borderRightOnly]}>
              <Text style={[styles.tableCell, styles.summaryCell]}>
                Add CGST {taxRate / 2} {""} %
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableCellNumeric,
                  styles.summaryCellValue,
                ]}
              >
                {totalCGST.toFixed(2)}
              </Text>
            </View>
          </View>
          {/* SGST Row */}
          <View style={[styles.tableRow, styles.summaryRow]}>
            <View style={styles.leftEmptySpace} />
            <View style={[styles.rightContent, styles.borderRightOnly]}>
              <Text style={[styles.tableCell, styles.summaryCell]}>
                Add SGST {taxRate / 2}
                {""} %
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableCellNumeric,
                  styles.summaryCellValue,
                ]}
              >
                {totalSGST.toFixed(2)}
              </Text>
            </View>
          </View>
          {/* Total Row */}
          {/* Total Row */}
          <View style={[styles.tableRow, styles.summaryRow]}>
            <View style={styles.leftEmptySpace} />
            <View style={[styles.rightContent, styles.borderRightOnly]}>
              <Text style={[styles.tableCell, styles.summaryCell]}>
                Grand Total
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableCellNumeric,
                  styles.summaryCellValue,
                ]}
              >
                {Number(overallTotal).toFixed(2)}{" "}
                {/* Format to two decimal places */}
              </Text>
            </View>
          </View>
        </View>
        {/* Amount in Words */}
        <Text style={styles.invoiceAmountInWords}>
          Amount in Words: {convertNumberToWords(overallTotal)} Only
        </Text>
        {/* Bank Details */}
        <View style={styles.invoiceBankDetails}>
          <Text style={styles.invoiceBankDetailsTitle}>Bank Details:</Text>
          <Text style={styles.invoiceBankDetailsText}>
            Account Name: {companyName}
          </Text>
          <Text style={styles.invoiceBankDetailsText}>
            Account Number: {accountNumber}
          </Text>
          <Text style={styles.invoiceBankDetailsText}>
            Bank Name: {bankName}
          </Text>
          <Text style={styles.invoiceBankDetailsText}>IFSC Code: {ifsc}</Text>
          <Text style={styles.invoiceBankDetailsText}>
            Branch Name: {branch}
          </Text>
        </View>
        {/* Declaration */}
        <Text style={styles.invoiceDeclaration}>{description}</Text>
        {/* Page Number */}
        {/* <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        /> */}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
