import html2pdf from "html2pdf.js";
import React from "react";
import Invoice from "./Invoice"; // Adjust the path as necessary

const generatePDF = () => {
  const element = document.getElementById("invoice");

  const options = {
    margin: [0.5, 0.5],
    filename: "invoice.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf().from(element).set(options).save();
};

const App = () => {
  const invoiceData = {
    invoiceNumber: "123456",
    date: "2024-08-01",
    customerName: "John Doe",
    items: [
      { name: "Item 1", quantity: 2, price: 10.0 },
      { name: "Item 2", quantity: 1, price: 25.0 },
    ],
    totalAmount: 45.0,
  };

  return (
    <div>
      <button onClick={generatePDF}>Download Invoice as PDF</button>
      <div id="invoice">
        <Invoice invoiceData={invoiceData} />
      </div>
    </div>
  );
};

export default App;
