import React from "react";

const Invoice = ({ invoiceData }) => {
  const { invoiceNumber, date, customerName, items, totalAmount } = invoiceData;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Invoice</h1>
      <p>
        <strong>Invoice Number:</strong> {invoiceNumber}
      </p>
      <p>
        <strong>Date:</strong> {date}
      </p>
      <p>
        <strong>Customer Name:</strong> {customerName}
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Item</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Quantity
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Price</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {item.name}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {item.quantity}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                ${item.price.toFixed(2)}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                ${(item.quantity * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
      </p>
    </div>
  );
};

export default Invoice;
