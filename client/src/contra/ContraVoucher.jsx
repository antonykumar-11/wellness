import React, { useState } from "react";

const ContraVoucher = () => {
  const [voucherData, setVoucherData] = useState({
    voucherNumber: "",
    date: "",
    transactionType: "bankToBank",
    accountFrom: "",
    accountTo: "",
    amount: "",
    description: "",
  });

  const handleChange = (e) => {
    setVoucherData({
      ...voucherData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Contra Voucher</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Voucher Number
          </label>
          <input
            type="text"
            name="voucherNumber"
            value={voucherData.voucherNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={voucherData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Transaction Type
          </label>
          <select
            name="transactionType"
            value={voucherData.transactionType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="bankToBank">Bank to Bank</option>
            <option value="bankToCash">Bank to Cash</option>
            <option value="cashToBank">Cash to Bank</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {voucherData.transactionType === "cashToBank"
              ? "Cash Account"
              : "From Account"}
          </label>
          <input
            type="text"
            name="accountFrom"
            value={voucherData.accountFrom}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        {(voucherData.transactionType === "bankToBank" ||
          voucherData.transactionType === "bankToCash") && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {voucherData.transactionType === "bankToCash"
                ? "Cash Account"
                : "To Account"}
            </label>
            <input
              type="text"
              name="accountTo"
              value={voucherData.accountTo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={voucherData.amount}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={voucherData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </form>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Voucher Details</h3>
        <div className="p-4 bg-gray-100 rounded-md">
          <p>
            <strong>Voucher Number:</strong> {voucherData.voucherNumber}
          </p>
          <p>
            <strong>Date:</strong> {voucherData.date}
          </p>
          <p>
            <strong>Transaction Type:</strong>{" "}
            {voucherData.transactionType.replace(/([A-Z])/g, " $1").trim()}
          </p>
          <p>
            <strong>
              {voucherData.transactionType === "cashToBank"
                ? "Cash Account"
                : "From Account"}
              :
            </strong>{" "}
            {voucherData.accountFrom}
          </p>
          {(voucherData.transactionType === "bankToBank" ||
            voucherData.transactionType === "bankToCash") && (
            <p>
              <strong>
                {voucherData.transactionType === "bankToCash"
                  ? "Cash Account"
                  : "To Account"}
                :
              </strong>{" "}
              {voucherData.accountTo}
            </p>
          )}
          <p>
            <strong>Amount:</strong> {voucherData.amount}
          </p>
          <p>
            <strong>Description:</strong> {voucherData.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContraVoucher;
