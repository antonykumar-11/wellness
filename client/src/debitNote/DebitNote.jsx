import React, { useState } from "react";

const DebitNote = () => {
  const [debitNoteData, setDebitNoteData] = useState({
    debitNoteNumber: "",
    date: "",
    supplierName: "",
    amount: "",
    reason: "",
    description: "",
  });

  const handleChange = (e) => {
    setDebitNoteData({
      ...debitNoteData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Debit Note</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Debit Note Number
          </label>
          <input
            type="text"
            name="debitNoteNumber"
            value={debitNoteData.debitNoteNumber}
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
            value={debitNoteData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Supplier Name
          </label>
          <input
            type="text"
            name="supplierName"
            value={debitNoteData.supplierName}
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
            value={debitNoteData.amount}
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
            value={debitNoteData.reason}
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
            value={debitNoteData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </form>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-center">
          Debit Note Details
        </h3>
        <div className="p-6 bg-gray-100 rounded-md">
          <p className="mb-2">
            <strong>Debit Note Number:</strong> {debitNoteData.debitNoteNumber}
          </p>
          <p className="mb-2">
            <strong>Date:</strong> {debitNoteData.date}
          </p>
          <p className="mb-2">
            <strong>Supplier Name:</strong> {debitNoteData.supplierName}
          </p>
          <p className="mb-2">
            <strong>Amount:</strong> {debitNoteData.amount}
          </p>
          <p className="mb-2">
            <strong>Reason:</strong> {debitNoteData.reason}
          </p>
          <p className="mb-2">
            <strong>Description:</strong> {debitNoteData.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebitNote;
