import React, { useState } from "react";

function ToPayment({
  formData,
  handleChange,
  handleSelect,
  items,
  filteredLedgers,
}) {
  const [showDropdown, setShowDropdown] = useState({});

  const toggleDropdown = (itemId) => {
    console.log("itemid", itemId);
    setShowDropdown((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const closeDropdown = (itemId) => {
    setShowDropdown((prev) => ({
      ...prev,
      [itemId]: false,
    }));
  };

  const handleLedgerSelect = (ledger, itemId) => {
    handleSelect(ledger, itemId);
    closeDropdown(itemId);
  };

  return (
    <div className="w-[95%] mx-auto mt-8 p-6 bg-yellow-400 shadow-md rounded-lg payment-to">
      <div>
        <h2 className="text-xl font-semibold mb-4">Payment To</h2>
        {items.map((item) => (
          <div key={item.id} className="border border-gray-300 px-4 py-2">
            <div className="relative">
              <input
                type="text"
                className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Search Ledger..."
                value={formData.under || ""}
                onClick={() => toggleDropdown(item.id)}
                readOnly
              />
              {showDropdown[item.id] && (
                <div className="absolute z-10 w-full max-h-60 mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto">
                  {filteredLedgers.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500">
                      No results found
                    </div>
                  ) : (
                    filteredLedgers.map((ledger) => (
                      <div
                        key={ledger._id}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${
                          item.ledger === ledger._id ? "bg-gray-100" : ""
                        }`}
                        onClick={() => handleLedgerSelect(ledger, item.id)}
                      >
                        {ledger.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Payment to name</label>
          <input
            type="text"
            id="paymentToName"
            name="companyName"
            value={formData.paymentTo.companyName}
            onChange={handleChange}
            placeholder="Payment To"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment to Address</label>
          <input
            type="text"
            id="paymentToAddress"
            name="companyAddress"
            value={formData.paymentTo.companyAddress}
            onChange={handleChange}
            placeholder="Payment To Address"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment to Gst</label>
          <input
            type="text"
            id="paymentTogstNumber"
            name="gstNumber"
            value={formData.paymentTo.gstNumber}
            onChange={handleChange}
            placeholder="Payment To GST"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment to state</label>
          <input
            type="text"
            id="paymentTostate"
            name="state"
            value={formData.paymentTo.state}
            onChange={handleChange}
            placeholder="Payment To state"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment to state code</label>
          <input
            type="text"
            id="paymentTostateCode"
            name="stateCode"
            value={formData.paymentTo.stateCode}
            onChange={handleChange}
            placeholder="Payment To state code"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Payment to Invoice Number
          </label>
          <input
            type="text"
            id="paymentToInvoiceNumber"
            name="invoiceNumber"
            value={formData.paymentTo.invoiceNumber}
            onChange={handleChange}
            placeholder="Payment To invoice number"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment to Invoice Date</label>
          <input
            type="date"
            id="paymentToInvoiceDate"
            name="date"
            value={formData.paymentTo.date}
            onChange={handleChange}
            placeholder="Payment To invoice Date"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Payment to delivery note
          </label>
          <input
            type="text"
            id="paymentTodeliveryNote"
            name="deliveryNote"
            value={formData.paymentTo.deliveryNote}
            onChange={handleChange}
            placeholder="Payment To delivery Note"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment type</label>
          <input
            type="text"
            id="paymentTomodeTermsOfPayment"
            name="modeTermsOfPayment"
            value={formData.paymentTo.modeTermsOfPayment}
            onChange={handleChange}
            placeholder="Payment Type"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment to Email</label>
          <input
            type="email"
            id="paymentTocompanyEmail"
            name="companyEmail"
            value={formData.paymentTo.companyEmail}
            onChange={handleChange}
            placeholder="Payment to email"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment Pan</label>
          <input
            type="text"
            id="paymentTocompanyPanNumber"
            name="companyPanNumber"
            value={formData.paymentTo.companyPanNumber}
            onChange={handleChange}
            placeholder="Payment Pan number"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment phone</label>
          <input
            type="number"
            id="paymentToMobile"
            name="companyMobile"
            value={formData.paymentTo.companyMobile}
            onChange={handleChange}
            placeholder="Payment Mobile"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>
    </div>
  );
}

export default ToPayment;
