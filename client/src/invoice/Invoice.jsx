import React, { useRef } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePdf";
import { useNavigate } from "react-router-dom";
import { useDeleteInvoiceMutation } from "../store/api/InvoicesApi"; // Adjust the path as needed
import convertNumberToWords from "./convertNumberToWords";
import Image from "../assets/logo.png";
import { useGetAllInvoicesQuery } from "../store/api/InvoicesApi";
const Invoice = ({ data }) => {
  const componentRef = useRef();
  const { data: invoicesResponse, isLoading } = useGetAllInvoicesQuery();
  console.log("invoicesResponse", invoicesResponse);
  const invoiceList = invoicesResponse?.data?.invoices || [];
  const calculateTotal = (itemGroups) => {
    let totalSubtotal = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    const taxRate = itemGroups[0]?.[0]?.taxRate || 0;

    itemGroups.forEach((items) => {
      const subtotal = items.reduce(
        (acc, item) => acc + Number(item.rate) * (item.quantity || 1),
        0
      );
      const cgst = (subtotal * (taxRate / 2)) / 100;
      const sgst = (subtotal * (taxRate / 2)) / 100;

      totalSubtotal += subtotal;
      totalCGST += cgst;
      totalSGST += sgst;
    });

    const overallTotal = totalSubtotal + totalCGST + totalSGST;
    return { totalSubtotal, totalCGST, totalSGST, overallTotal, taxRate };
  };
  const { totalSubtotal, totalCGST, totalSGST, overallTotal, taxRate } =
    calculateTotal([data.items]);
  const [deleteInvoice] = useDeleteInvoiceMutation(); // RTK Query hook for deleting invoice

  const handleEdit = () => {
    navigate(`/invoice/invoice/edit/${data._id}`); // Navigate to the edit page
  };

  const handleDelete = async () => {
    try {
      await deleteInvoice(data._id).unwrap(); // Delete invoice and wait for completion
      navigate("/invoice/invoice-preview"); // Redirect after successful delete
    } catch (error) {
      console.error("Failed to delete invoice: ", error);
      // Optionally handle the error, e.g., show a message to the user
    }
  };
  console.log("invoiceList", invoiceList.companyName);
  return (
    <div className="p-6">
      <div
        ref={componentRef}
        className="max-w-4xl mx-auto bg-white p-10 shadow-md rounded-lg"
      >
        {invoiceList &&
        (Array.isArray(invoiceList)
          ? invoiceList.length
          : Object.keys(invoiceList).length) ? (
          (Array.isArray(invoiceList) ? invoiceList : [invoiceList]).map(
            (invoice, index) => (
              <div key={index}>
                {/* Invoice Header */}
                <div className="relative mb-8 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 uppercase">
                      {invoice.companyName}
                    </h1>
                  </div>
                  <img
                    src={invoice.avatar}
                    alt="Company Logo"
                    className="absolute right-12 top-6 transform -translate-y-1/2 w-28 h-28  rounded-full  "
                    style={{ marginTop: "4rem" }}
                  />
                </div>

                {/* Company and Invoice Details */}
                <div className="text-left mb-4">
                  <>
                    <p className="text-sm text-gray-600">{invoice.address1}</p>
                    <p className="text-sm text-gray-600">{invoice.address2}</p>
                    <p className="text-sm text-gray-600">{invoice.address3}</p>
                    <p className="text-sm text-gray-600">{invoice.address4}</p>
                    <p className="text-sm text-gray-600">
                      Email : {invoice.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      GST No : {invoice.gstNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Mobile No : {invoice.mobileNumber}
                    </p>
                  </>
                </div>

                <h2 className="text-center  text-xl font-semibold">
                  Tax Invoice
                </h2>

                <div className="flex justify-between mb-10">
                  <div>
                    <p className="text-sm text-gray-600">
                      PAN NO: {invoice.pancardnumber || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      GST NO: {invoice.gstNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      INVOICE NO: {data.saleInvoiceNumber || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      DATE:{" "}
                      {data.transactionDate
                        ? new Date(data.transactionDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <p className="text-gray-600">No invoices available.</p>
        )}

        {/* Billed and Shipped To Addresses */}
        <div className="mb-10">
          <div className="flex justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-600">
                Billed To:
              </h2>
              <div className="text-sm text-gray-600">
                <p>{data.purchasedBy.companyName}</p>
                <p>{data.purchasedBy.street}</p>
                <p>{data.purchasedBy.MainArea}</p>
                <p>{data.purchasedBy.postOffice}</p>
                <p>{data.purchasedBy.City}</p>
                <p>{data.purchasedBy.State}</p>
                <p>{data.purchasedBy.Country}</p>
                <p>{data.purchasedBy.ZIPCode}</p>
                <p>{data.purchasedBy.companyPanNumber}</p>
                <p>{data.purchasedBy.gstNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold text-gray-600">
                Shipped To:
              </h2>
              <div className="text-sm text-gray-600">
                <p>{data.purchasedTo.companyName}</p>
                <p>{data.purchasedTo.street}</p>
                <p>{data.purchasedTo.MainArea}</p>
                <p>{data.purchasedTo.postOffice}</p>
                <p>{data.purchasedTo.City}</p>
                <p>{data.purchasedTo.State}</p>
                <p>{data.purchasedTo.Country}</p>
                <p>{data.purchasedTo.ZIPCode}</p>
                <p>{data.purchasedTo.companyPanNumber}</p>
                <p>{data.purchasedTo.gstNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mb-10">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left text-sm font-semibold">
                  Sl No.
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">
                  Item Of Description
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">
                  HSN Code
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">
                  Unit
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">
                  Rate
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-left text-sm">
                    {item.serialNumber}
                  </td>
                  <td className="border px-4 py-2 text-left text-sm">
                    {item.stockName}
                  </td>
                  <td className="border px-4 py-2 text-left text-sm">
                    {item.hsnCode}
                  </td>
                  <td className="border px-4 py-2 text-left text-sm">
                    {item.unit}
                  </td>
                  <td className="border px-4 py-2 text-center text-sm">
                    {item.actualrate}
                  </td>
                  <td className="border px-4 py-2 text-right text-sm">
                    {Number(item.rate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total and Amount in Words */}
        <div className="flex justify-end mb-2">
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">
              Subtotal: ₹{totalSubtotal.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Add CGST {taxRate / 2}: ₹{totalCGST.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Add SGST {taxRate / 2}: ₹{totalSGST.toFixed(2)}
            </p>
            <p className="text-xl font-bold text-gray-800 mt-2">
              Total: ₹{overallTotal.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="">
          <p className="text-base text-gray-600">
            Amount in Words: {convertNumberToWords(overallTotal)}
          </p>
        </div>

        {/* Bank Details and Declaration */}
        {invoiceList &&
        (Array.isArray(invoiceList)
          ? invoiceList.length
          : Object.keys(invoiceList).length) ? (
          (Array.isArray(invoiceList) ? invoiceList : [invoiceList]).map(
            (invoice, index) => (
              <div key={index} className="mb-10">
                <h2 className="text-lg font-semibold text-gray-600 mb-2">
                  Bank Details:
                </h2>
                <p className="text-sm text-gray-600">
                  Account name: {invoice.bankName || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Account Number: {invoice.accountNumber || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  IFSC Code: {invoice.ifsc || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Branch: {invoice.branch || "N/A"}
                </p>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 text-[16px]">
                    {invoice.description || "No description provided."}
                  </p>
                </div>
                {/* 
              <div className="mt-2 text-right">
                <p className="text-lg font-semibold text-gray-600">
                  For {invoice.companyName || "Company Name"}
                </p>
                <p className="text-base text-gray-600">
                  {invoice.director || "Director"}
                </p>
                <p className="text-base text-gray-600">Managing Director</p>
              </div> */}
              </div>
            )
          )
        ) : (
          <p className="text-gray-600">No invoices available.</p>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex justify-between mt-10">
        {/* <button
          onClick={handleEdit}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow-md hover:bg-blue-700"
        >
          Edit
        </button> */}
        <PDFDownloadLink
          document={<InvoicePDF invoiceList={invoiceList} data={data} />}
          fileName="invoice.pdf"
          className="bg-green-600 text-white px-6 py-2 rounded shadow-md hover:bg-green-700"
        >
          {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
        </PDFDownloadLink>
        {/* <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-6 py-2 rounded shadow-md hover:bg-red-700"
        >
          Delete
        </button> */}
      </div>{" "}
      *
    </div>
  );
};

export default Invoice;
