import React from "react";
import { useGetAllInvoicesQuery } from "../store/api/InvoicesApi";
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
    textAlign: "left", // Align text to the left
    fontSize: 16, // Adjust font size as needed
    fontWeight: "bold", // Optional bold styling
    lineHeight: 1.5, // Adjust line height for better readability
    fontFamily: "Poppins",

    color: "#2d3748",
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
    lineHeight: 1.4, // Adjust line height for the address text
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
    fontSize: 14,
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
    backgroundColor: "#E5E7EB",
    borderRightWidth: 1,
    borderRightColor: "#D1D5DB",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCellDescriptionHeader: {
    flex: 2,
    padding: 8,
    backgroundColor: "#E5E7EB",
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
  // Convert the date string to a Date object
  const invoiceDate = new Date(data.date);
  const {
    data: invoicesResponse,
    error,
    isLoading,
    refetch,
  } = useGetAllInvoicesQuery();
  const invoiceList = invoicesResponse?.data?.invoices || [];
  console.log("invoiceList", invoiceList);
  // Format the date to a more readable format
  const formattedDate = invoiceDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const subtotal = data.items.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0
  );
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + cgst + sgst;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Invoice Header */}
        <View style={styles.bodyWrapper}>
          <View style={styles.invoiceHeader}>
            <View>
              <Text style={styles.invoiceTitle}>{data.companyName}</Text>
              <View style={styles.invoiceCompanyDetails}>
                {data.companyAddress && (
                  <>
                    <Text style={styles.invoiceCompanyDetailsText}>
                      {data.companyAddress.line1}
                    </Text>
                    <Text style={styles.invoiceCompanyDetailsText}>
                      {data.companyAddress.line2}
                    </Text>
                    <Text style={styles.invoiceCompanyDetailsText}>
                      {data.companyAddress.line3}
                    </Text>
                    <Text style={styles.invoiceCompanyDetailsText}>
                      {data.companyAddress.line4}
                    </Text>
                    <Text style={styles.invoiceCompanyDetailsText}>
                      {data.companyAddress.line5}
                    </Text>
                  </>
                )}
              </View>
            </View>
            <Image src={data.image} style={styles.invoiceLogo} />
          </View>

          <Text style={styles.invoiceTaxTitle}>Tax Invoice</Text>
          <View style={styles.invoiceDetails}>
            <View>
              <Text style={styles.invoiceDetailsText}>
                PAN NO: {data.panNo}
              </Text>
              <Text style={styles.invoiceDetailsText}>
                GST NO: {data.gstNo}
              </Text>
            </View>
            <View>
              <Text style={styles.invoiceDetailsText}>
                INVOICE NO: {data.invoiceNo}
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
                {data.billedTo && (
                  <>
                    <Text style={styles.invoiceDetailsText}>
                      {data.billedTo.line1}
                    </Text>
                    <Text style={styles.invoiceDetailsText}>
                      {data.billedTo.line2}
                    </Text>
                    <Text style={styles.invoiceDetailsText}>
                      {data.billedTo.line3}
                    </Text>
                    <Text style={styles.invoiceDetailsText}>
                      {data.billedTo.line4}
                    </Text>
                    <Text style={styles.invoiceDetailsText}>
                      {data.billedTo.line5}
                    </Text>
                  </>
                )}
              </View>
              <View>
                <Text style={styles.invoiceAddressTitle}>Shipped To:</Text>
                {data.shippedTo && (
                  <>
                    <Text style={styles.invoiceDetailsText}>
                      {data.shippedTo.line1}
                    </Text>
                    <Text style={styles.invoiceDetailsText}>
                      {data.shippedTo.line2}
                    </Text>
                    <Text style={styles.invoiceDetailsText}>
                      {data.shippedTo.line3}
                    </Text>
                    <Text style={styles.invoiceDetailsText}>
                      {data.shippedTo.line4}
                    </Text>
                    <Text style={styles.invoiceDetailsText}>
                      {data.shippedTo.line5}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Invoice Items */}
          <View style={styles.tableContainer}>
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

            {/* Data Rows */}
            {data.items.map((item, index) => (
              <View style={[styles.tableRow, styles.dataRow]} key={index}>
                <Text style={styles.tableCell}>{index + 1}</Text>
                <Text style={styles.tableCellDescription}>
                  {item.description}
                </Text>
                <Text style={styles.tableCell}>{item.hsnCode}</Text>
                <Text style={[styles.tableCell, styles.tableCellNumeric]}>
                  {item.unit}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellNumeric]}>
                  {item.price}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellNumeric]}>
                  {item.qty * item.price}
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
                  {subtotal}
                </Text>
              </View>
            </View>

            {/* CGST Row */}
            <View style={[styles.tableRow, styles.summaryRow]}>
              <View style={styles.leftEmptySpace} />
              <View style={[styles.rightContent, styles.borderRightOnly]}>
                <Text style={[styles.tableCell, styles.summaryCell]}>
                  CGST (9%)
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellNumeric,
                    styles.summaryCellValue,
                  ]}
                >
                  {cgst}
                </Text>
              </View>
            </View>

            {/* SGST Row */}
            <View style={[styles.tableRow, styles.summaryRow]}>
              <View style={styles.leftEmptySpace} />
              <View style={[styles.rightContent, styles.borderRightOnly]}>
                <Text style={[styles.tableCell, styles.summaryCell]}>
                  SGST (9%)
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellNumeric,
                    styles.summaryCellValue,
                  ]}
                >
                  {sgst}
                </Text>
              </View>
            </View>

            {/* Total Row */}
            <View style={[styles.tableRow, styles.summaryRow]}>
              <View style={styles.leftEmptySpace} />
              <View style={[styles.rightContent, styles.borderRightOnly]}>
                <Text style={[styles.tableCell, styles.summaryCell]}>
                  Total
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellNumeric,
                    styles.summaryCellValue,
                  ]}
                >
                  {total}
                </Text>
              </View>
            </View>
          </View>

          {/* Amount in Words */}
          <Text style={styles.invoiceAmountInWords}>
            Amount in Words: {convertNumberToWords(total)} Only
          </Text>

          {/* Bank Details */}
          <View style={styles.invoiceBankDetails}>
            <Text style={styles.invoiceBankDetailsTitle}>Bank Details:</Text>
            <Text style={styles.invoiceBankDetailsText}>
              Account Name: {data.bankDetails.name}
            </Text>
            <Text style={styles.invoiceBankDetailsText}>
              Account Number: {data.bankDetails.accountNumber}
            </Text>
            <Text style={styles.invoiceBankDetailsText}>
              Bank Name: {data.bankDetails.branch}
            </Text>
            <Text style={styles.invoiceBankDetailsText}>
              IFSC Code: {data.bankDetails.ifsc}
            </Text>
          </View>

          {/* Declaration */}
          <Text style={styles.invoiceDeclaration}>{data.declaration}</Text>

          {/* Signature*/}
          <Text style={styles.invoiceSignature}>
            For {data.managingDirector}
            {data.signature}
          </Text>
        </View>

        {/* Page Number */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
};

export default InvoicePDF;
