import React, { useState, useEffect } from "react";
import { useGetAllInvoicesQuery } from "../store/api/InvoicesApi";
import Invoice from "../invoice/Invoice";

const InvoiceContainer = () => {
  const {
    data: invoicesResponse,
    error,
    isLoading,
    refetch,
  } = useGetAllInvoicesQuery();

  // Correctly access the invoices and sales arrays
  const invoiceList1 = invoicesResponse?.data || [];
  const invoiceList = invoicesResponse?.data?.invoices || [];
  const salesList = invoicesResponse?.data?.sales || [];
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    if (selectedInvoice) {
      refetch();
    }
  }, [selectedInvoice, refetch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateTotal = (items) => {
    // Step 1: Initialize subtotal
    let subtotal = 0;

    // Step 2: Calculate subtotal
    items.forEach((item) => {
      const rate = Number(item.rate);
      const quantity = Number(item.quantity) || 1; // Treat null or undefined as 0
      subtotal += rate * quantity; // Accumulate the subtotal
    });

    // Log the calculated subtotal

    // Step 3: Store the subtotal for reference
    const subtotalValue = subtotal;

    // Step 4: Assuming all items have the same tax rate, use the first item's taxRate
    const taxRate = items.length > 0 ? Number(items[0].taxRate) : 0;

    // Step 5: Calculate CGST and SGST amounts
    const cgst = (subtotalValue * (taxRate / 2)) / 100; // CGST amount
    const sgst = (subtotalValue * (taxRate / 2)) / 100; // SGST amount

    // Step 6: Calculate the final total
    const total = subtotalValue + cgst + sgst;

    // Log the final total

    // Step 7: Return the final total
    return total;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {selectedInvoice ? (
        <Invoice data={selectedInvoice} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Invoices</h2>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              onClick={refetch}
            >
              Refresh
            </button>
          </div>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Invoice No</th>
                <th className="py-2 px-4 border-b">Company Name</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salesList.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {invoice.saleInvoiceNumber}
                  </td>
                  {invoiceList.length > 0 ? (
                    invoiceList.map((invoice) => (
                      <td key={invoice._id} className="py-2 px-4 border-b">
                        {invoice.companyName}
                      </td>
                    ))
                  ) : (
                    <td colSpan={1} className="py-2 px-4 border-b text-center">
                      No invoices found.
                    </td>
                  )}

                  <td className="py-2 px-4 border-b">
                    {formatDate(invoice.transactionDate)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {calculateTotal(invoice.items).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default InvoiceContainer;
