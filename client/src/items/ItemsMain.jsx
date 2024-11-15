import React, { useState, useEffect } from "react";
import { useGetAllInvoicesQuery } from "../store/api/InvoicesApi";
import Invoice from "../invoice/Invoice";

const InvoiceContainer = () => {
  const {
    data: invoices,
    error,
    isLoading,
    refetch,
  } = useGetAllInvoicesQuery();
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const invoiceList = invoices?.data || [];

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
    const subtotal = items.reduce(
      (acc, item) => acc + Number(item.price) * item.qty,
      0
    );
    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    return subtotal + cgst + sgst;
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
              {invoiceList.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{invoice.invoiceNo}</td>
                  <td className="py-2 px-4 border-b">{invoice.companyName}</td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(invoice.date)}
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
