import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function InvoiceForm() {
  const [state, setState] = useState({
    isOpen: false,
    currency: "₹",
    currentDate: "",
    invoiceNumber: 1,
    billTo: "",
    billToAddress: "",
    billToEmail: "",
    billForm: "js consultancy",
    billFromEmail: "tamilskill@gmail.com",
    billFromAddresss: "tamilnadu india",
    notes: "",
    subTotal: "",
    taxRate: 0,
    taxAmount: "0.00",
    discountRate: 0,
    discountAmount: "0.00",
  });
  const [total, setTotal] = useState(0.0);
  const [items, setItems] = useState([
    {
      id: 0,
      name: "",
      description: "",
      price: 1.0,
      quantity: 1,
    },
  ]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(12);

    // Title
    doc.text("Invoice", 14, 20);

    // Current Date and Invoice Number
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Invoice Number: ${state.invoiceNumber}`, 14, 40);

    // Bill To Section
    doc.text("Bill To:", 14, 50);
    doc.text(`Name: ${state.billTo}`, 14, 60);
    doc.text(`Address: ${state.billToAddress}`, 14, 70);
    doc.text(`Email: ${state.billToEmail}`, 14, 80);

    // Bill From Section
    doc.text("Bill From:", 14, 100);
    doc.text(`Name: ${state.billForm}`, 14, 110);
    doc.text(`Address: ${state.billFromAddresss}`, 14, 120);
    doc.text(`Email: ${state.billFromEmail}`, 14, 130);

    // Notes
    doc.text("Notes:", 14, 150);
    doc.text(state.notes, 14, 160);

    // Invoice Items
    const columns = ["Description", "Price", "Quantity", "Total"];
    const rows = items.map((item) => [
      item.description,
      item.price,
      item.quantity,
      (item.price * item.quantity).toFixed(2),
    ]);

    doc.autoTable({
      startY: 180,
      head: [columns],
      body: rows,
    });

    // Summary
    doc.text(
      `Subtotal: ${state.currency} ${state.subTotal}`,
      14,
      doc.autoTable.previous.finalY + 10
    );
    doc.text(
      `Tax Rate: ${state.taxRate}%`,
      14,
      doc.autoTable.previous.finalY + 20
    );
    doc.text(
      `Tax Amount: ${state.currency} ${state.taxAmount}`,
      14,
      doc.autoTable.previous.finalY + 30
    );
    doc.text(
      `Discount Rate: ${state.discountRate}%`,
      14,
      doc.autoTable.previous.finalY + 40
    );
    doc.text(
      `Discount Amount: ${state.currency} ${state.discountAmount}`,
      14,
      doc.autoTable.previous.finalY + 50
    );

    const finalTotal =
      parseFloat(state.subTotal) +
      parseFloat(state.taxAmount) -
      parseFloat(state.discountAmount);
    doc.text(
      `Total: ${state.currency} ${finalTotal.toFixed(2)}`,
      14,
      doc.autoTable.previous.finalY + 60
    );

    doc.save("invoice.pdf");
  };

  return (
    <form className="">
      <div className="bg-white shadow p-6 rounded-lg">
        <div className="flex flex-row items-start justify-between mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Date
            </label>
            <span className="block text-gray-900">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Invoice Number
            </label>
            <input
              type="number"
              name="invoiceNumber"
              value={state.invoiceNumber}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bill To
            </label>
            <input
              type="text"
              name="billTo"
              value={state.billTo}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bill To Address
            </label>
            <input
              type="text"
              name="billToAddress"
              value={state.billToAddress}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bill To Email
            </label>
            <input
              type="email"
              name="billToEmail"
              value={state.billToEmail}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bill From
            </label>
            <input
              type="text"
              name="billForm"
              value={state.billForm}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bill From Email
            </label>
            <input
              type="email"
              name="billFromEmail"
              value={state.billFromEmail}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bill From Address
            </label>
            <input
              type="text"
              name="billFromAddresss"
              value={state.billFromAddresss}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            name="notes"
            value={state.notes}
            onChange={onChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              SubTotal
            </label>
            <input
              type="number"
              name="subTotal"
              value={state.subTotal}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tax Rate
            </label>
            <input
              type="number"
              name="taxRate"
              value={state.taxRate}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tax Amount
            </label>
            <input
              type="number"
              name="taxAmount"
              value={state.taxAmount}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discount Rate
            </label>
            <input
              type="number"
              name="discountRate"
              value={state.discountRate}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discount Amount
            </label>
            <input
              type="number"
              name="discountAmount"
              value={state.discountAmount}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={generatePDF}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm"
        >
          Generate PDF
        </button>
      </div>
    </form>
  );
}

export default InvoiceForm;
