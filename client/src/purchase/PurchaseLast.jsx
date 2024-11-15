import React from "react";

const PurchaseLast = ({ purchaseData, handleChangeLast }) => {
  return (
    <div className="p-4 mt-8 max-w-md mx-auto bg-white shadow-md rounded-md">
      {/* Is Credit Checkbox */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="isCredit"
        >
          Is Credit
        </label>
        <input
          type="checkbox"
          name="isCredit"
          id="isCredit"
          checked={purchaseData.isCredit}
          onChange={handleChangeLast}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
      </div>

      {/* Credit Details Section */}
      {purchaseData.isCredit && (
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="creditPeriod"
          >
            Credit Period
          </label>
          <input
            type="number"
            name="creditDetails.creditPeriod"
            id="creditPeriod"
            value={purchaseData.creditDetails.creditPeriod || ""}
            onChange={handleChangeLast}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="creditAmount"
          >
            Credit Amount
          </label>
          <input
            type="number"
            name="creditDetails.creditAmount"
            id="creditAmount"
            value={purchaseData.creditDetails.creditAmount || ""}
            onChange={handleChangeLast}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="creditDueDate"
          >
            Credit Due Date
          </label>
          <input
            type="date"
            name="creditDetails.creditDueDate"
            id="creditDueDate"
            value={purchaseData.creditDetails.creditDueDate || ""}
            onChange={handleChangeLast}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      )}

      {/* Purpose of Payment */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="purposeOfPayment"
        >
          Purpose of Payment
        </label>
        <input
          type="text"
          name="purposeOfPayment"
          id="purposeOfPayment"
          value={purchaseData.purposeOfPayment || ""}
          onChange={handleChangeLast}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Voucher Number */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="voucherNumber"
        >
          Voucher Number
        </label>
        <input
          type="text"
          name="voucherNumber"
          id="voucherNumber"
          value={purchaseData.voucherNumber || ""}
          onChange={handleChangeLast}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Transaction Date */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="transactionDate"
        >
          Transaction Date
        </label>
        <input
          type="date"
          name="recordDate"
          id="recordDate"
          value={purchaseData.recordDate || ""}
          onChange={handleChangeLast}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows="4"
          value={purchaseData.description || ""}
          onChange={handleChangeLast}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>

      {/* Purchase By */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="purchaseBy"
        >
          Purchase By
        </label>
        <input
          type="text"
          name="purchaseBy"
          id="purchaseBy"
          value={purchaseData.purchaseBy || ""}
          onChange={handleChangeLast}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Purchase To */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="purchaseTo"
        >
          Purchase To
        </label>
        <input
          type="text"
          name="purchaseTo"
          id="purchaseTo"
          value={purchaseData.purchaseTo || ""}
          onChange={handleChangeLast}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    </div>
  );
};

export default PurchaseLast;
