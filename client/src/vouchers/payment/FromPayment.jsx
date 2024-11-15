import React from "react";

function FromPayment({ formData, handleChange }) {
  return (
    <div className="w-[95%] mx-auto mt-8 p-6 bg-blue-400 shadow-md rounded-lg payment-from">
      <h2 className="text-xl font-semibold mb-4">Payment From</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Payment from name</label>
          <input
            type="text"
            id="paymentFromName"
            name="companyName"
            value={formData.paymentFrom.companyName}
            onChange={handleChange}
            placeholder="Payment From"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment From Address</label>
          <textarea
            id="paymentFromAddress"
            name="companyAddress"
            value={formData.paymentFrom.companyAddress}
            onChange={handleChange}
            placeholder="Payment From Address"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment From Gst</label>
          <input
            type="text"
            id="paymentFromGstNumber"
            name="gstNumber"
            value={formData.paymentFrom.gstNumber}
            onChange={handleChange}
            placeholder="Payment From GST"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment From state</label>
          <input
            type="text"
            id="paymentFromState"
            name="state"
            value={formData.paymentFrom.state}
            onChange={handleChange}
            placeholder="Payment From State"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment From state code</label>
          <input
            type="text"
            id="paymentFromStateCode"
            name="stateCode"
            value={formData.paymentFrom.stateCode}
            onChange={handleChange}
            placeholder="Payment From State Code"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Payment From Invoice Number
          </label>
          <input
            type="text"
            id="paymentFromInvoiceNumber"
            name="invoiceNumber"
            value={formData.paymentFrom.invoiceNumber}
            onChange={handleChange}
            placeholder="Payment From Invoice Number"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Payment From Invoice Date
          </label>
          <input
            type="date"
            id="paymentFromInvoiceDate"
            name="date"
            value={formData.paymentFrom.date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Payment From Delivery Note
          </label>
          <input
            type="text"
            id="paymentFromDeliveryNote"
            name="deliveryNote"
            value={formData.paymentFrom.deliveryNote}
            onChange={handleChange}
            placeholder="Payment From Delivery Note"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment Type</label>
          <input
            type="text"
            id="paymentFromModeTermsOfPayment"
            name="modeTermsOfPayment"
            value={formData.paymentFrom.modeTermsOfPayment}
            onChange={handleChange}
            placeholder="Payment Type"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment From Email</label>
          <input
            type="email"
            id="paymentFromCompanyEmail"
            name="companyEmail"
            value={formData.paymentFrom.companyEmail}
            onChange={handleChange}
            placeholder="Payment From Email"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment From Pan</label>
          <input
            type="text"
            id="paymentFromCompanyPanNumber"
            name="companyPanNumber"
            value={formData.paymentFrom.companyPanNumber}
            onChange={handleChange}
            placeholder="Payment From Pan"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment From Phone</label>
          <input
            type="number"
            id="paymentFromMobile"
            name="companyMobile"
            value={formData.paymentFrom.companyMobile}
            onChange={handleChange}
            placeholder="Payment From Mobile"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>
    </div>
  );
}

export default FromPayment;
