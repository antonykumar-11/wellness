import React, { useState, useRef, useEffect } from "react";
import { useGetLedgerQuery } from "../store/api/LedgerApi";
import { useGetCompaniesQuery } from "../store/api/CompanyApi";
import { useGetAllStocksQuery } from "../store/api/StockApi";
import { useCreatePaymentMutation } from "../store/api/PaymentApi";
import { useGetPurchasesQuery } from "../store/api/PurchaseApi";
import CreateCompanyModal from "../vouchers/dummy2/CompanyCreateModal";

import CreateStockModal from "../vouchers/dummy2/CreateStock";
import Ledger from "../vouchers/dummy2/Ledger";
const PaymentForm = () => {
  const { data: ledgerData = [], refetch } = useGetLedgerQuery();
  console.log("data", ledgerData);

  const { data: stockData = [] } = useGetAllStocksQuery();
  console.log("stock", stockData);

  const [purchaseData, setPurchaseData] = useState({
    voucherType: "Payment Voucher",
    voucherNumber: "",
    transactionDate: "",
    creditPeriod: "",
    creditAmount: "",
    creditDueDate: "",
    purposeOfPayment: "",
    selectedOption: "onPayment",
    authorizedBy: {
      name: "",
      designation: "",
      signature: "",
    },
    purchasedBy: "",
    purchasedTo: "",
    description: "",
    items: [
      {
        id: 1,
        serialNumber: "1", // Initial serial number
        description: "",
        unit: "",
        hsnCode: "",
        rate: 0,
        quantity: 0,
        amount: 0,
        stockName: "",
        stockItem: "", // Stock item dropdown
      },
    ],
    debitLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    taxId: "",
    taxRate: 0, // Added taxRate
    taxName: "",

    taxAmount: 0,
    total: 0,
    subTotal: 0,
  });

  console.log("purchaseDatadetails", purchaseData);

  const handleOptionChanges = (event) => {
    const value = event.target.value; // Get the selected value from the event
    setPurchaseData((prevData) => ({
      ...prevData,
      selectedOption: value, // Update selectedOption in purchaseData
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length === 1) {
      setPurchaseData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setPurchaseData((prevState) => ({
        ...prevState,
        [keys[0]]: {
          ...prevState[keys[0]],
          [keys[1]]: value,
        },
      }));
    }
  };

  const [searchTermDebit, setSearchTermDebit] = useState("");
  const [searchTermCredit, setSearchTermCredit] = useState("");

  const [searchTermStock, setSearchTermStock] = useState("");
  const [purchaseToName, setPurchaseToName] = useState("");
  const [purchaseByName, setPurchaseByName] = useState("");
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    debit: false,
    credit: false,
    tax: false,
    stock: false,
    purchaseBy: false,
    purchaseTo: false,
  });
  const [createPurchase, { isLoading, isSuccess, isError, error }] =
    useCreatePaymentMutation();
  const handleSaveAndSubmit = async (event) => {
    event.preventDefault();

    try {
      await createPurchase(purchaseData).unwrap(); // Sending data to the API

      // Handle successful submission (e.g., show a success message, redirect, etc.)
      alert("Purchase created successfully!");

      // Reset the purchaseData state to its initial values
      setPurchaseData({
        voucherType: "Purchase Voucher",
        voucherNumber: "",
        transactionDate: "",
        creditPeriod: "",
        creditAmount: "",
        creditDueDate: "",
        purposeOfPayment: "",
        authorizedBy: {
          name: "",
          designation: "",
          signature: "",
        },
        purchasedBy: "",
        purchasedTo: "",
        description: "",
        items: [
          {
            id: 1,
            serialNumber: "1", // Initial serial number
            description: "",
            unit: "",
            hsnCode: "",
            rate: 0,
            quantity: 0,
            amount: 0,
            stockName: "",
            stockItem: "", // Stock item dropdown
          },
        ],
        debitLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
        creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
        taxId: "",
        taxRate: 0, // Added taxRate
        taxName: "",
        subTotal: 0,
        taxAmount: 0,
        total: 0,
      });
    } catch (err) {
      // Handle error
      console.error("Failed to create purchase:", err);
    }
  };
  const { data: purchaseVouchers = [] } = useGetPurchasesQuery();
  const [selectedVoucherId, setSelectedVoucherId] = useState("");
  console.log("date", purchaseVouchers);
  useEffect(() => {
    if (selectedVoucherId) {
      const selectedVoucher = purchaseVouchers.find(
        (voucher) => voucher._id === selectedVoucherId
      );

      if (selectedVoucher) {
        setPurchaseData((prevData) => ({
          ...selectedVoucher,
          creditDueDate: new Date(selectedVoucher.creditDueDate)
            .toISOString()
            .split("T")[0],
          transactionDate: new Date(selectedVoucher.transactionDate)
            .toISOString()
            .split("T")[0],
          selectedOption: prevData.selectedOption, // Preserve the selected option
        }));
      }
    }
  }, [selectedVoucherId, purchaseVouchers]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRefs.purchaseTo.current &&
        !dropdownRefs.purchaseTo.current.contains(e.target)
      ) {
        setIsDropdownOpen((prevState) => ({
          ...prevState,
          purchaseTo: false,
        }));
      }
      if (
        dropdownRefs.purchaseBy.current &&
        !dropdownRefs.purchaseBy.current.contains(e.target)
      ) {
        setIsDropdownOpen((prevState) => ({
          ...prevState,
          purchaseBy: false,
        }));

        // Refetch ledger data when clicking outside purchaseBy dropdown
        refetch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [refetch]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const filteredCompanyData = (searchTerm) =>
    companyData.filter((item) =>
      (item.companyName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

  const dropdownRefs = {
    debit: useRef(null),
    credit: useRef(null),
    tax: useRef(null),
    stock: useRef(null),
    purchaseBy: useRef(null),
    purchaseTo: useRef(null),
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      Object.keys(dropdownRefs).forEach((key) => {
        if (
          dropdownRefs[key].current &&
          !dropdownRefs[key].current.contains(e.target)
        ) {
          setIsDropdownOpen((prevState) => ({
            ...prevState,
            [key]: false,
          }));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [purchaseData.items, purchaseData.taxRate]);

  const handleItemChange = (index, name, value) => {
    const updatedItems = [...purchaseData.items];
    updatedItems[index][name] = value;
    if (name === "rate" || name === "quantity") {
      updatedItems[index].amount =
        updatedItems[index].rate * updatedItems[index].quantity;
    }
    setPurchaseData((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
  };

  const addItem = () => {
    setPurchaseData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        {
          id: prevData.items.length + 1,
          serialNumber: (prevData.items.length + 1).toString(), // Increment serial number
          description: "",
          unit: "",
          hsnCode: "",
          rate: 0,
          quantity: 0,
          amount: 0,
          stockItem: "",
          stockName: "", // Stock item dropdown
        },
      ],
    }));
  };

  const deleteItem = (index) => {
    setPurchaseData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((_, i) => i !== index),
    }));
  };

  const handleLedgerSelect = (type, option) => {
    setPurchaseData((prevData) => {
      let updatedLedgers;
      let updatedLedgerName;

      // Determine the array and name to update based on the type
      if (type === "debit") {
        updatedLedgers = [...prevData.debitLedgers];
        updatedLedgerName = "debitLedgerName";
      } else {
        updatedLedgers = [...prevData.creditLedgers];
        updatedLedgerName = "creditLedgerName";
      }

      // Check if the selected ledger already exists in the array
      const existingLedgerIndex = updatedLedgers.findIndex(
        (ledger) => ledger.ledgerId === option._id
      );

      if (existingLedgerIndex !== -1) {
        // If it exists, update the ledger's amount
        updatedLedgers[existingLedgerIndex].amount = prevData.subTotal || 0;
      } else {
        // If it doesn't exist, add it as a new ledger
        updatedLedgers.push({
          ledgerId: option._id,
          ledgerName: option.name,
          amount: prevData.subTotal || 0, // Default to 0 if subTotal is not available
        });
      }

      return {
        ...prevData,
        [type === "debit" ? "debitLedgers" : "creditLedgers"]: updatedLedgers,
        [updatedLedgerName]: option.name, // Update the ledger name in the input field
      };
    });

    // Close the dropdown for the specific ledger type
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [type]: false,
    }));
  };

  // Function to handle the selection of a tax ledger
  const handleTaxSelect = (option) => {
    setPurchaseData((prevData) => {
      // Check if the tax ledger already exists in debitLedgers
      const existingLedgerIndex = prevData.debitLedgers.findIndex(
        (ledger) => ledger.ledgerId === option._id
      );

      let updatedDebitLedgers = [...prevData.debitLedgers];

      if (existingLedgerIndex !== -1) {
        // If it exists, update the ledger's amount
        updatedDebitLedgers[existingLedgerIndex].amount =
          prevData.taxAmount || 0;
      } else {
        // If it doesn't exist, add it as a new ledger
        updatedDebitLedgers.push({
          ledgerId: option._id,
          ledgerName: option.name,
          amount: prevData.taxAmount || 0, // Default to 0 if taxAmount is not available
        });
      }

      return {
        ...prevData,
        taxId: option._id, // Store the selected tax ledger's _id
        taxName: option.name, // Update taxName with the selected item's name
        debitLedgers: updatedDebitLedgers, // Update debit ledgers with the selected tax ledger
      };
    });

    // Close the dropdown after selection
    setTaxDropdownState((prevState) => ({
      ...prevState,
      isDropdownOpen: false,
    }));
  };

  const handleStockSelect = (index, option) => {
    console.log("optionsssss", option);
    const updatedItems = [...purchaseData.items];
    updatedItems[index].stockItem = option._id; // Only store the ID
    updatedItems[index].stockName = option.stockItem; // Store the stock name separately if needed
    setPurchaseData((prevState) => ({
      ...prevState,
      items: updatedItems,
    }));
    setIsDropdownOpen({ stock: false });
  };

  const calculateTotals = () => {
    const subTotal = purchaseData.items.reduce(
      (total, item) => total + item.amount,
      0
    );
    const taxAmount = (subTotal * purchaseData.taxRate) / 100;
    const total = subTotal + taxAmount;
    setPurchaseData((prevData) => ({
      ...prevData,
      subTotal,
      taxAmount,
      total,
      creditAmount: subTotal,
      debitAmount: subTotal,
    }));
  };

  const filteredLedgerData = (searchTerm) =>
    ledgerData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredStockData = (searchTerm) => {
    return stockData.filter((item) =>
      item.stockItem.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const openLedgerModal = () => setIsLedgerModalOpen(true);
  const closeLedgerModal = () => setIsLedgerModalOpen(false);
  const [isModalOpeni, setIsModalOpeni] = useState(false);

  const openModali = () => setIsModalOpeni(true);
  const closeModali = () => setIsModalOpeni(false);

  // State for dropdowns
  const [taxDropdownState, setTaxDropdownState] = useState({
    isDropdownOpen: false,
    searchTerm: "",
  });

  const taxDropdownRef = useRef(null);

  // Handler for selecting a tax option

  // Filter tax data based on search term
  const filteredTaxData = (searchTerm) =>
    ledgerData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  const { data: companyData = [] } = useGetCompaniesQuery();

  console.log("pu", purchaseData);
  const [searchTermPurchasedBy, setSearchTermPurchasedBy] = useState("");
  const [searchTermPurchasedTo, setSearchTermPurchasedTo] = useState("");
  const handleSelect = (field, option) => {
    setPurchaseData((prevState) => ({
      ...prevState,
      [field]: option._id,
    }));
    if (field === "purchasedBy") {
      setPurchaseByName(option.companyName);
    } else {
      setPurchaseToName(option.companyName);
    }
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [field]: false,
    }));
  };
  const handleDropdownToggle = (field) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  return (
    <div className="p-6">
      <div className="my-4">
        {/* Dropdown to select voucher */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Voucher Number
        </label>
        <select
          value={selectedVoucherId}
          onChange={(e) => setSelectedVoucherId(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="" disabled>
            Select a voucher
          </option>
          {purchaseVouchers.map((voucher) => (
            <option key={voucher._id} value={voucher._id}>
              {voucher.voucherNumber}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700 dark:text-gray-300">
          Select Payment Option
        </label>
        <select
          value={purchaseData.selectedOption}
          onChange={handleOptionChanges}
          className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="onPayment">On Payment</option>
          <option value="onAdvance">On Advance</option>
          <option value="onReference">On Reference</option>
          <option value="onAgainstReference">On Against Reference</option>
        </select>
      </div>
      {/* form field  */}
      <form className="max-w-4xl mx-auto p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-10 ">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {/* Row 1 */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Voucher Number
            </label>
            <input
              type="text"
              name="voucherNumber"
              value={purchaseData.voucherNumber}
              onChange={handleChange}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Transaction Date
            </label>
            <input
              type="date"
              name="transactionDate"
              value={purchaseData.transactionDate}
              onChange={handleChange}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Credit Period
            </label>
            <input
              type="text"
              name="creditPeriod"
              value={purchaseData.creditPeriod}
              onChange={handleChange}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Row 2 */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Credit Amount
            </label>
            <input
              type="number"
              name="creditAmount"
              value={purchaseData.creditAmount}
              onChange={handleChange}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Credit Due Date
            </label>
            <input
              type="date"
              name="creditDueDate"
              value={purchaseData.creditDueDate}
              onChange={handleChange}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Purpose of Payment
            </label>
            <input
              type="text"
              name="purposeOfPayment"
              value={purchaseData.purposeOfPayment}
              onChange={handleChange}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Row 3 */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Authorized By Name
            </label>
            <input
              type="text"
              name="authorizedBy.name"
              value={purchaseData.authorizedBy.name}
              onChange={handleChange}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Designation
            </label>
            <input
              type="text"
              name="authorizedBy.designation"
              value={purchaseData.authorizedBy.designation}
              onChange={handleChange}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Signature
            </label>
            <input
              type="text"
              name="authorizedBy.signature"
              value={purchaseData.authorizedBy.signature}
              onChange={handleChange}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Row 4 */}
          <div className="relative flex flex-col mb-4">
            <label className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
              Purchased By
            </label>
            <input
              type="text"
              value={purchaseByName}
              onChange={(e) => {
                setSearchTermPurchasedBy(e.target.value);
                setPurchaseByName(e.target.value);
              }}
              onClick={() => handleDropdownToggle("purchasedBy")}
              className="p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
            />
            {isDropdownOpen.purchasedBy && (
              <div
                ref={dropdownRefs.purchasedBy}
                className="absolute left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg w-full max-h-60 overflow-y-auto z-10"
                style={{
                  top: "50%",
                  // Adjusts the element's position by 50% of its own height
                }}
              >
                <div className="p-2">
                  {filteredCompanyData(searchTermPurchasedBy).map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleSelect("purchasedBy", item)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      {item.companyName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative flex flex-col mb-4">
            <label className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
              Purchased To
            </label>
            <input
              type="text"
              value={purchaseToName}
              onChange={(e) => {
                setSearchTermPurchasedTo(e.target.value);
                setPurchaseToName(e.target.value);
              }}
              onClick={() => handleDropdownToggle("purchasedTo")}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
            />
            {isDropdownOpen.purchasedTo && (
              <div
                ref={dropdownRefs.purchasedTo}
                className="absolute left-0    mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg w-full max-h-60 overflow-y-auto z-10"
                style={{
                  top: "53%",
                  // Adjusts the element's position by 50% of its own height
                }}
              >
                <div className="p-2">
                  {filteredCompanyData(searchTermPurchasedTo).map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleSelect("purchasedTo", item)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      {item.companyName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={purchaseData.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </form>
      {/* ithu main table container*/}
      <div className="hidden lg:block mt-10">
        <div className="">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {[
                  "Serial Number",
                  "Description",
                  "Unit",
                  "HSN Code",
                  "Rate",
                  "Quantity",
                  "Amount",
                  "Stock Item",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {purchaseData.items.map((item, index) => (
                <tr key={item.id} className="text-sm">
                  <td className="w-24 px-3 py-2 whitespace-nowrap">
                    {item.serialNumber}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) =>
                        handleItemChange(index, "unit", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.hsnCode}
                      onChange={(e) =>
                        handleItemChange(index, "hsnCode", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(index, "rate", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.amount}
                      readOnly
                      className="w-full px-2 py-1 border rounded bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap z-50">
                    <div className="relative">
                      {/* Main input field for display and searching */}
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTermStock || item.stockName || ""}
                        onClick={() =>
                          setIsDropdownOpen((prevState) => ({
                            ...prevState,
                            stock: !prevState.stock,
                          }))
                        }
                        onChange={(e) => setSearchTermStock(e.target.value)} // Update search term
                        className="w-full px-2 py-1 border rounded cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      />
                      {isDropdownOpen.stock && (
                        <div
                          ref={dropdownRefs.stock}
                          className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mt-1 w-full"
                          style={{ maxHeight: "10rem", overflowY: "auto" }}
                        >
                          {/* List of filtered options */}
                          <ul className="max-h-40">
                            {filteredStockData(searchTermStock).map(
                              (option) => (
                                <li
                                  key={option._id}
                                  onClick={() => {
                                    handleStockSelect(index, option);
                                    setIsDropdownOpen((prevState) => ({
                                      ...prevState,
                                      stock: false,
                                    })); // Close dropdown after selection
                                  }}
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  {option.stockItem}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap text-right">
                    <button
                      onClick={() => deleteItem(index)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* ithu responsive items create */}
      <div className="lg:hidden mt-10">
        {purchaseData.items.map((item, index) => (
          <div
            key={item.id}
            className="border-b border-gray-200 dark:border-gray-700 mb-4 p-4"
          >
            <div className="font-bold mb-2">Serial Number</div>
            <div>{item.serialNumber}</div>

            <div className="font-bold mb-2 mt-4">Description</div>
            <input
              type="text"
              value={item.description}
              onChange={(e) =>
                handleItemChange(index, "description", e.target.value)
              }
              className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />

            <div className="font-bold mb-2 mt-4">Unit</div>
            <input
              type="text"
              value={item.unit}
              onChange={(e) => handleItemChange(index, "unit", e.target.value)}
              className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />

            <div className="font-bold mb-2 mt-4">HSN Code</div>
            <input
              type="text"
              value={item.hsnCode}
              onChange={(e) =>
                handleItemChange(index, "hsnCode", e.target.value)
              }
              className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />

            <div className="font-bold mb-2 mt-4">Rate</div>
            <input
              type="number"
              value={item.rate}
              onChange={(e) => handleItemChange(index, "rate", e.target.value)}
              className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />

            <div className="font-bold mb-2 mt-4">Quantity</div>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />

            <div className="font-bold mb-2 mt-4">Amount</div>
            <input
              type="number"
              value={item.amount}
              readOnly
              className="w-full px-2 py-1 border rounded bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
            />

            <div className="font-bold mb-2 mt-4 ">Stock Items</div>
            <div className="relative">
              <input
                type="text"
                value={item.stockName || searchTermStock}
                onClick={() =>
                  setIsDropdownOpen((prevState) => ({
                    ...prevState,
                    [index]: !prevState[index],
                  }))
                }
                onChange={(e) => setSearchTermStock(e.target.value)}
                className="w-full px-2 py-1 border rounded cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              {isDropdownOpen[index] && (
                <div className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mt-1 w-full">
                  <ul className="max-h-40 overflow-auto">
                    {filteredStockData(searchTermStock).map((option) => (
                      <li
                        key={option._id}
                        onClick={() => {
                          handleStockSelect(index, option);
                          setIsDropdownOpen((prevState) => ({
                            ...prevState,
                            [index]: false, // Close dropdown after selection
                          }));
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {option.stockItem}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => deleteItem(index)}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/*buttons*/}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-10">
        <button
          onClick={addItem}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800"
        >
          Add Item
        </button>

        <button
          onClick={openLedgerModal}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800"
        >
          Open Ledger Modal
        </button>
        {isLedgerModalOpen && <Ledger closeModal={closeLedgerModal} />}

        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Create Company
        </button>
        {isModalOpen && (
          <CreateCompanyModal closeModal={closeModal} themeMode="dark" />
        )}

        <button
          onClick={openModali}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Create New Stock Item
        </button>
        {isModalOpeni && <CreateStockModal onClose={closeModali} />}
      </div>

      {/* tax field  */}
      <div className="flex flex-wrap gap-4 justify-center mt-10">
        {/* Tax Rate */}
        <div className="flex-1 min-w-[200px]">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
            htmlFor="taxRate"
          >
            Tax Rate (%)
          </label>
          <input
            type="number"
            name="taxRate"
            id="taxRate"
            value={purchaseData.taxRate || ""}
            onChange={(e) =>
              setPurchaseData((prevData) => ({
                ...prevData,
                taxRate: e.target.value,
              }))
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        {/* Tax Amount */}
        <div className="flex-1 min-w-[200px]">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
            htmlFor="taxAmount"
          >
            Tax Amount
          </label>
          <input
            type="number"
            name="taxAmount"
            id="taxAmount"
            value={purchaseData.taxAmount || ""}
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
          />
        </div>

        {/* Subtotal */}
        <div className="flex-1 min-w-[200px]">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
            htmlFor="subTotal"
          >
            Subtotal
          </label>
          <input
            type="number"
            name="subTotal"
            id="subTotal"
            value={purchaseData.subTotal || ""}
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
          />
        </div>

        {/* Total */}
        <div className="flex-1 min-w-[200px]">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
            htmlFor="total"
          >
            Total
          </label>
          <input
            type="number"
            name="total"
            id="total"
            value={purchaseData.total || ""}
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Tax Ledger */}
      <div className="space-y-4 md:space-y-6 mt-10">
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Tax Ledger */}
          <div className="relative flex-1 min-w-[200px]">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="taxLedger"
            >
              Tax Ledger
            </label>
            <input
              type="text"
              name="taxLedger"
              id="taxLedger"
              value={purchaseData.taxName || taxDropdownState.searchTerm}
              onClick={() =>
                setTaxDropdownState((prevState) => ({
                  ...prevState,
                  isDropdownOpen: !prevState.isDropdownOpen,
                }))
              }
              onChange={(e) =>
                setTaxDropdownState((prevState) => ({
                  ...prevState,
                  searchTerm: e.target.value,
                }))
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            {taxDropdownState.isDropdownOpen && (
              <div
                ref={taxDropdownRef}
                className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full dark:bg-gray-800 dark:border-gray-600"
              >
                <ul className="max-h-40 overflow-auto">
                  {filteredTaxData(taxDropdownState.searchTerm).map(
                    (option) => (
                      <li
                        key={option._id}
                        onClick={() => {
                          handleTaxSelect(option);
                          setTaxDropdownState((prevState) => ({
                            ...prevState,
                            isDropdownOpen: false, // Close dropdown after selection
                          }));
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {option.name}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Debit Ledger */}
          <div className="relative flex-1 min-w-[200px]">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="debitLedger"
            >
              Debit Ledger
            </label>
            <input
              type="text"
              name="debitLedger"
              id="debitLedger"
              value={purchaseData.debitLedgerName || searchTermDebit}
              onClick={() =>
                setIsDropdownOpen((prevState) => ({
                  ...prevState,
                  debit: !prevState.debit,
                }))
              }
              onChange={(e) => setSearchTermDebit(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            {isDropdownOpen.debit && (
              <div
                ref={dropdownRefs.debit}
                className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full dark:bg-gray-800 dark:border-gray-600"
              >
                <ul className="max-h-40 overflow-auto">
                  {filteredLedgerData(searchTermDebit).map((option) => (
                    <li
                      key={option._id}
                      onClick={() => {
                        handleLedgerSelect("debit", option);
                        setIsDropdownOpen((prevState) => ({
                          ...prevState,
                          debit: false,
                        })); // Close dropdown after selection
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {option.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Credit Ledger */}
          <div className="relative flex-1 min-w-[200px]">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="creditLedger"
            >
              Credit Ledger
            </label>
            <input
              type="text"
              name="creditLedger"
              id="creditLedger"
              value={purchaseData.creditLedgerName || searchTermCredit}
              onClick={() =>
                setIsDropdownOpen((prevState) => ({
                  ...prevState,
                  credit: !prevState.credit,
                }))
              }
              onChange={(e) => setSearchTermCredit(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            {isDropdownOpen.credit && (
              <div
                ref={dropdownRefs.credit}
                className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full dark:bg-gray-800 dark:border-gray-600"
              >
                <ul className="max-h-40 overflow-auto">
                  {filteredLedgerData(searchTermCredit).map((option) => (
                    <li
                      key={option._id}
                      onClick={() => {
                        handleLedgerSelect("credit", option);
                        setIsDropdownOpen((prevState) => ({
                          ...prevState,
                          credit: false,
                        })); // Close dropdown after selection
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {option.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="my-10">
        <button
          type="button"
          onClick={handleSaveAndSubmit}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save & Submit"}
        </button>
      </div>

      {isSuccess && (
        <p className="text-green-500">Purchase created successfully!</p>
      )}
      {isError && (
        <p className="text-red-500">
          Failed to create purchase: {error.message}
        </p>
      )}
    </div>
  );
};

export default PaymentForm;
