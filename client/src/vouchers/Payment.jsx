import { useState, useEffect } from "react";
import { useCreatePaymentMutation } from "../store/api/PaymentApi"; // Adjust the import path
import shortid from "shortid"; // Import shortid

import FromPayment from "./payment/FromPayment";
import ToPayment from "./payment/ToPayment";
import PaymentLedger from "./payment/PaymentLedger";
import ItemPayment from "./payment/ItemPayment";
import SearchableDropdown from "./payment/SearchableDropdown";
import { useGetAllLedgersWithTransactionsQuery } from "../store/api/AllLedgerApi";

const Payment = () => {
  const { data: ledgerData = [] } = useGetAllLedgersWithTransactionsQuery();
  const { primaryLedgers = [], secondaryLedgers = [] } = ledgerData;
  const [ledgers, setLedgers] = useState([]);
  const [filteredLedgers, setFilteredLedgers] = useState([]);
  useEffect(() => {
    if (primaryLedgers.length > 0 || secondaryLedgers.length > 0) {
      const allLedgers = [...primaryLedgers, ...secondaryLedgers];
      setLedgers(allLedgers);
      setFilteredLedgers(allLedgers);
    }
  }, [primaryLedgers, secondaryLedgers]);
  const [formData, setFormData] = useState({
    paymentTo: {
      companyName: "",
      companyAddress: "",
      companyEmail: "",
      companyMobile: "",
      companyPanNumber: "",
      gstNumber: "",
      invoiceNumber: "",
      panCard: "",
      date: "",
      state: "",
      stateCode: "",
      deliveryNote: "",
      modeTermsOfPayment: "",
      buyersOrderNumber: " ",
      under: "",
    },
    paymentFrom: {
      companyName: "ALPHA CRANE SERVICE",
      currentDate: new Date().toLocaleDateString(),
      companyAddress:
        "VIZHINJAM SEA PORT , THIRUVANANTHAPURAM , KERALA , INDIA",
      companyEmail: "alphacranesalpha@gmail.com",
      companyMobile: "9995265576",
      companyPanNumber: "HPZPS9891L",
      gstNumber: "32HPZPS981L1ZB",
      invoiceNumber: "",
      panCard: "",
      date: "",
      state: "",
      stateCode: "",
      deliveryNote: "",
      modeTermsOfPayment: "",
      buyersOrderNumber: " ",
    },

    balanceBillByBill: false,
    defaultCreditPeriod: 0,

    panItNo: "",
    registrationType: "",
    gstinUin: "",
    transactionType: "",
    subTotal: "",
    total: "",
    taxRate: 0,
    taxAmount: "",
    totalInWords: "",
  });

  const [items, setItems] = useState([
    {
      id: shortid.generate(),
      serialNumber: 1,

      ledger: "",
      value: "", // To hold the ledger name
      hsnCode: "",
      Unit: "",
      quantity: 0,
      Rate: 0,
      Amount: 0,
    },
    // Add more items if needed
  ]);
  console.log("items..............................", items);
  //ivide njan type cheyunna field value ayittu varum pinne a type cheyyunna shtalathe name ivide parayunnu
  // Unified handleChange function for form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name", name);
    console.log("value", value);
    if (e.target.closest(".payment-to")) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        paymentTo: {
          ...prevFormData.paymentTo,
          [name]: value,
        },
      }));
    } else if (e.target.closest(".payment-from")) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        paymentFrom: {
          ...prevFormData.paymentFrom,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  const handleInputChange = (itemId, name, value) => {
    console.log("name", name);
    console.log("itemId", itemId);
    console.log("value", value);
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, [name]: value } : item
    );
    setItems(updatedItems);
  };
  const updateItems = (updatedItems) => {
    console.log("updatesItem", updateItems);
    setItems(updatedItems);
  };
  const handleAddEvent = () => {
    const newItem = {
      id: shortid.generate(),
      serialNumber: items.length + 1,
      ledger: "",
      hsnCode: "",
      Unit: "",
      quantity: 0,
      Rate: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const handleItemChange = (id, data) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
              amount:
                (data.quantity || item.quantity) * (data.Rate || item.Rate),
            }
          : item
      )
    );
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
  };

  const handleCalculateTotal = () => {
    let subTotal = items
      .reduce(
        (acc, item) => acc + parseFloat(item.Rate) * parseInt(item.quantity),
        0
      )
      .toFixed(2);

    const taxAmount = (
      parseFloat(subTotal) *
      (parseFloat(formData.taxRate) / 100)
    ).toFixed(2);
    const total = (parseFloat(subTotal) + parseFloat(taxAmount)).toFixed(2);

    setFormData((prevState) => ({
      ...prevState,
      subTotal: parseFloat(subTotal),
      taxAmount: parseFloat(taxAmount),
      total: parseFloat(total),
    }));
  };
  useEffect(() => {
    handleCalculateTotal();
  }, [items, formData.taxRate]);
  const handleLedgerSelect = (ledger, ledgerType) => {
    setItems((prevFormData) => ({
      ...prevFormData,
      [ledgerType]: ledger,
    }));
  };

  const [postInvoice, { isLoading }] = useCreatePaymentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const invoiceData = { ...formData, items };
      await postInvoice(invoiceData).unwrap();
      alert("Invoice submitted successfully!");
      // Reset form data if needed
    } catch (error) {
      console.error("Failed to submit invoice: ", error);
      alert("Failed to submit invoice.");
    }
  };

  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleSelect = (ledger, itemId) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            ledger: ledger._id,
            value: ledger.name,
            Amount: item.Rate * item.quantity,
          }
        : item
    );

    setItems(updatedItems);
  };

  return (
    <div className="w-[95%] mx-auto mt-8 bg-slate-200 shadow-md rounded-lg p-6">
      <div className="flex justify-around mb-8">
        {[1, 2, 3, 4].map((num) => (
          <div
            key={num}
            className={`rounded-full w-8 h-8 flex items-center justify-center ${
              step === num ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {num}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <FromPayment formData={formData} handleChange={handleChange} />
          <button
            onClick={nextStep}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <ToPayment
            formData={formData}
            handleChange={handleChange}
            handleSelect={handleSelect}
            items={items}
            filteredLedgers={filteredLedgers}
          />
          <button
            onClick={prevStep}
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-2"
          >
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <PaymentLedger />
          <button
            onClick={prevStep}
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-2"
          >
            Next
          </button>
        </div>
      )}

      {step === 4 && (
        <div>
          <ItemPayment
            items={items}
            formData={formData}
            selectedLedger={handleLedgerSelect}
            handleItemChange={handleItemChange}
            handleDeleteItem={handleDeleteItem}
            setFormData={setFormData}
            handleChange={handleChange}
            isLoading={isLoading}
            filteredLedgers={filteredLedgers}
            SearchableDropdown={SearchableDropdown}
            handleSelect={(ledger, itemId) => handleSelect(ledger, itemId)}
            setItems={updateItems}
            handleInputChange={handleInputChange}
            onSelectLedger={(ledger) =>
              handleLedgerSelect(ledger, "debitLedger")
            }
          />
          <button
            onClick={prevStep}
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
          >
            Back
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleAddEvent}
          >
            Add Item
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-2"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;
