import { useRef } from "react";

function PurchaseBy({ allState, handleNestedChange, handleNestedChange22 }) {
  const purchaseBy = allState.purchaseBy || {};
  const authorizedBy = allState.authorizedBy || {};
  console.log("purchaseBy", allState);

  // Create a ref for all input elements
  const inputRefs = useRef([]);

  // Add a ref to the inputRefs array
  const addInputRef = (element) => {
    if (element && !inputRefs.current.includes(element)) {
      inputRefs.current.push(element);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        // Move to previous input
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        // Move to next input
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1].focus();
        }
      }
    }
  };

  return (
    <div className="w-[95%] mx-auto mt-8 p-6 bg-yellow-400 shadow-md rounded-lg payment-to">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Purchase By</label>
          <input
            type="text"
            id="purchaseByName"
            name="companyName"
            value={purchaseBy.companyName || ""}
            onChange={handleNestedChange}
            placeholder="Payment To"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 1)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <textarea
            id="purchaseByAddress"
            name="companyAddress"
            value={purchaseBy.companyAddress || ""}
            onChange={handleNestedChange}
            placeholder="Payment To Address"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 2)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">GST</label>
          <input
            type="text"
            id="purchaseByGstNumber"
            name="gstNumber"
            value={purchaseBy.gstNumber || ""}
            onChange={handleNestedChange}
            placeholder="Payment To GST"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 3)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">State</label>
          <input
            type="text"
            id="purchaseByState"
            name="state"
            value={purchaseBy.state || ""}
            onChange={handleNestedChange}
            placeholder="Payment To State"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 4)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Delivery Note</label>
          <textarea
            id="purchaseByDeliveryNote"
            name="deliveryNote"
            value={purchaseBy.deliveryNote || ""}
            onChange={handleNestedChange}
            placeholder="Payment To Delivery Note"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 7)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Purchase Type</label>
          <input
            type="text"
            id="purchaseByModeTermsOfPayment"
            name="modeTermsOfPayment"
            value={purchaseBy.modeTermsOfPayment || ""}
            onChange={handleNestedChange}
            placeholder="Payment Type"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 8)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Purchase Order Number</label>
          <input
            type="text"
            id="purchaseByBuyersOrderNumber"
            name="buyersOrderNumber"
            value={purchaseBy.buyersOrderNumber || ""}
            onChange={handleNestedChange}
            placeholder="Buyer's Order Number"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 9)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            id="purchaseByCompanyEmail"
            name="companyEmail"
            value={purchaseBy.companyEmail || ""}
            onChange={handleNestedChange}
            placeholder="Payment to Email"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 10)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="number"
            id="purchaseByCompanyMobile"
            name="companyMobile"
            value={purchaseBy.companyMobile || ""}
            onChange={handleNestedChange}
            placeholder="Payment to Phone Number"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 11)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">PAN Number</label>
          <input
            type="text"
            id="purchaseByCompanyPanNumber"
            name="companyPanNumber"
            value={purchaseBy.companyPanNumber || ""}
            onChange={handleNestedChange}
            placeholder="Payment PAN Number"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 12)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Supply Date</label>
          <input
            type="date"
            id="purchaseBySupplyDate"
            name="supplyDate"
            value={purchaseBy.supplyDate || ""}
            onChange={handleNestedChange}
            placeholder="Payment Supply Date"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 13)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Bank name</label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={purchaseBy.bankName || ""}
            onChange={handleNestedChange}
            placeholder="bank name"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 14)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Account Number</label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={purchaseBy.accountNumber || ""}
            onChange={handleNestedChange}
            placeholder="account number"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 15)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">IFCE : code</label>
          <input
            type="text"
            id="ifcecode"
            name="ifcecode"
            value={purchaseBy.ifcecode || ""}
            onChange={handleNestedChange}
            placeholder="ifce code"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 16)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Branch</label>
          <input
            type="text"
            id="branch"
            name="branch"
            value={purchaseBy.branch || ""}
            onChange={handleNestedChange}
            placeholder="branch name"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 17)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">authorizedBy name</label>
          <input
            type="text"
            id="authorizedByName"
            name="name"
            value={authorizedBy.name || ""}
            onChange={handleNestedChange22}
            placeholder="authorizedby"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 18)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">designation</label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={authorizedBy.designation || ""}
            onChange={handleNestedChange22}
            placeholder="designation"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 19)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">signature</label>
          <input
            type="text"
            id="signature"
            name="signature"
            value={authorizedBy.signature || ""}
            onChange={handleNestedChange22}
            placeholder="signature"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ref={addInputRef}
            onKeyDown={(e) => handleKeyDown(e, 20)}
          />
        </div>
      </div>
    </div>
  );
}

export default PurchaseBy;
