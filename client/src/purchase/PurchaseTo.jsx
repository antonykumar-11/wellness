import React, { useRef, useCallback, useEffect } from "react";

function PurchaseTo({ allState, handleNestedChange11, handleNestedChange22 }) {
  // Create a ref for all input elements
  const inputRefs = useRef([]);

  // Add a ref to the inputRefs array
  const addInputRef = useCallback((element) => {
    if (element && !inputRefs.current.includes(element)) {
      inputRefs.current.push(element);
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        // Move to previous input
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // Move to next input
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      }
    }
  }, []);

  // Reset refs when component mounts or updates
  useEffect(() => {
    inputRefs.current = [];
  }, []);

  const purchaseTo = allState.purchaseTo || {};
  const authorizedBy = allState.authorizedBy || {};

  const fields = [
    { id: "purchaseToName", name: "companyName", placeholder: "Payment To" },
    {
      id: "purchaseToAddress",
      name: "companyAddress",
      placeholder: "Payment To Address",
      type: "textarea",
    },
    {
      id: "purchaseToGstNumber",
      name: "gstNumber",
      placeholder: "Payment To GST",
    },
    { id: "purchaseToState", name: "state", placeholder: "Payment To State" },
    {
      id: "purchaseToInvoiceNumber",
      name: "invoiceNumber",
      placeholder: "Payment To Invoice Number",
    },
    {
      id: "purchaseToInvoiceDate",
      name: "invoiceDate",
      placeholder: "Payment To Invoice Date",
      type: "date",
    },
    {
      id: "purchaseToDeliveryNote",
      name: "deliveryNote",
      placeholder: "Payment To Delivery Note",
    },
    {
      id: "purchaseToModeTermsOfPayment",
      name: "modeTermsOfPayment",
      placeholder: "Payment Type",
    },
    {
      id: "purchaseToBuyersOrderNumber",
      name: "buyersOrderNumber",
      placeholder: "Buyers Order Number",
    },
    {
      id: "purchaseToCompanyEmail",
      name: "companyEmail",
      placeholder: "Payment to Email",
      type: "email",
    },
    {
      id: "purchaseToCompanyMobile",
      name: "companyMobile",
      placeholder: "Payment to Phone Number",
      type: "tel",
    },
    {
      id: "purchaseToCompanyPanNumber",
      name: "companyPanNumber",
      placeholder: "Payment PAN Number",
    },
    {
      id: "purchaseToSupplyDate",
      name: "supplyDate",
      placeholder: "Payment Supply Date",
      type: "date",
    },
    { id: "bankName", name: "bankName", placeholder: "Bank Name" },
    {
      id: "accountNumber",
      name: "accountNumber",
      placeholder: "Account Number",
    },
    { id: "ifcecode", name: "ifcecode", placeholder: "IFCE Code" },
    { id: "branch", name: "branch", placeholder: "Branch Name" },
    {
      id: "authorizedByName",
      name: "name",
      placeholder: "Authorized By Name",
      value: authorizedBy.name,
      handleChange: handleNestedChange22,
    },
    {
      id: "designation",
      name: "designation",
      placeholder: "Designation",
      value: authorizedBy.designation,
      handleChange: handleNestedChange22,
    },
    {
      id: "signature",
      name: "signature",
      placeholder: "Signature",
      value: authorizedBy.signature,
      handleChange: handleNestedChange22,
    },
  ];

  return (
    <div className="w-[95%] mx-auto mt-8 p-6 bg-yellow-400 shadow-md rounded-lg payment-to">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {fields.map((field, index) => (
          <div className="mb-4" key={field.id}>
            <label htmlFor={field.id} className="block text-gray-700">
              {field.placeholder}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.id}
                name={field.name}
                value={purchaseTo[field.name] || ""}
                onChange={handleNestedChange11}
                placeholder={field.placeholder}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                ref={addInputRef}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ) : (
              <input
                type={field.type || "text"}
                id={field.id}
                name={field.name}
                value={purchaseTo[field.name] || ""}
                onChange={field.handleChange || handleNestedChange11}
                placeholder={field.placeholder}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                ref={addInputRef}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PurchaseTo;
