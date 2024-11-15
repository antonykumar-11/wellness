import React, { useState } from "react";

const CreditNote = () => {
  const [creditNoteData, setCreditNoteData] = useState({
    creditNoteNumber: "",
    date: "",
    customerName: "",
    amount: "",
    reason: "",
    description: "",
  });

  const handleChange = (e) => {
    setCreditNoteData({
      ...creditNoteData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Credit Note</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Credit Note Number
          </label>
          <input
            type="text"
            name="creditNoteNumber"
            value={creditNoteData.creditNoteNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={creditNoteData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Customer Name
          </label>
          <input
            type="text"
            name="customerName"
            value={creditNoteData.customerName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={creditNoteData.amount}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Reason
          </label>
          <input
            type="text"
            name="reason"
            value={creditNoteData.reason}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={creditNoteData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </form>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-center">
          Credit Note Details
        </h3>
        <div className="p-6 bg-gray-100 rounded-md">
          <p className="mb-2">
            <strong>Credit Note Number:</strong>{" "}
            {creditNoteData.creditNoteNumber}
          </p>
          <p className="mb-2">
            <strong>Date:</strong> {creditNoteData.date}
          </p>
          <p className="mb-2">
            <strong>Customer Name:</strong> {creditNoteData.customerName}
          </p>
          <p className="mb-2">
            <strong>Amount:</strong> {creditNoteData.amount}
          </p>
          <p className="mb-2">
            <strong>Reason:</strong> {creditNoteData.reason}
          </p>
          <p className="mb-2">
            <strong>Description:</strong> {creditNoteData.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreditNote;
