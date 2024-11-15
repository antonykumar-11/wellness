import React, { useState, useRef, useEffect } from "react";
import { useGetLedgerQuery } from "../store/api/LedgerApi";
import { useGetCompaniesQuery } from "../store/api/CompanyApi";
import { useGetAllStocksQuery } from "../store/api/StockApi";
import { useParams, useNavigate } from "react-router-dom";

import CreateCompanyModal from "../vouchers/dummy2/CompanyCreateModal";
import { useGetPurchasesQuery } from "../store/api/PurchaseApi";
import { useCreateDebitNoteMutation } from "../store/api/DebitNoteApi";

import CreateStockModal from "../vouchers/dummy2/CreateStock";
import Ledger from "../vouchers/dummy2/Ledger";

const DebitNote = () => {
  const { data: ledgerData = [] } = useGetLedgerQuery();
  console.log("data", ledgerData);

  const navigate = useNavigate();
  const { data: stockData = [] } = useGetAllStocksQuery();

  const [purchaseData, setPurchaseData] = useState({
    voucherType: "DebitNote",
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
        serialNumber: "1",
        description: "",
        unit: "",
        hsnCode: "",
        rate: 0,
        quantity: 0,
        taxRate: "",
        taxAmount: "",
        amount: 0,
        stockName: "",
        stockItem: "",
      },
    ],
    debitLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    taxId: "",
    taxRate: 0,
    taxName: "",
    subTotal: 0,
    taxAmount: 0,
    total: 0,
  });
  console.log("purchaseData", purchaseData);
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
  console.log("searchTermCredit", searchTermCredit);
  const [searchTermStock, setSearchTermStock] = useState("");
  const [purchaseToName, setPurchaseToName] = useState("");
  const [purchaseByName, setPurchaseByName] = useState("");
  const dropdownRef = useRef(null);
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
  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen({ debit: false });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [createPurchase, { isLoading, isSuccess, isError, error }] =
    useCreateDebitNoteMutation();
  const handleSaveAndSubmit = async (event) => {
    event.preventDefault();

    try {
      await createPurchase(purchaseData).unwrap(); // Sending data to the API

      // Handle successful submission (e.g., show a success message, redirect, etc.)
      alert("Purchase created successfully!");

      // Reset the purchaseData state to its initial values
      setPurchaseData({
        voucherType: "DebitNoter",
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
            taxRate: "",
            taxAmount: "",
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
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { data: purchaseVouchers = [] } = useGetPurchasesQuery();

  const [selectedVoucherId, setSelectedVoucherId] = useState("");
  const [debitNote, setDebitNote] = useState({
    debitLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
  });

  useEffect(() => {
    if (selectedVoucherId) {
      const selectedVoucher = purchaseVouchers.find(
        (voucher) => voucher._id === selectedVoucherId
      );

      if (selectedVoucher) {
        const { _id, __v, ...filteredVoucher } = selectedVoucher;

        setDebitNote((prevData) => ({
          ...prevData,
          ...filteredVoucher,
        }));

        // Update purchaseData state
        setPurchaseData((prevData) => ({
          ...prevData, // Preserve the existing state data
          ...filteredVoucher, // Merge the voucher data
          voucherType: "DebitNote", // Automatically set voucherType to "Debit Note"
          creditDueDate: new Date(filteredVoucher.creditDueDate)
            .toISOString()
            .split("T")[0], // Format creditDueDate to "YYYY-MM-DD"
          transactionDate: new Date(filteredVoucher.transactionDate)
            .toISOString()
            .split("T")[0], // Format transactionDate to "YYYY-MM-DD"
          selectedOption: prevData.selectedOption, // Preserve the selected option
          debitLedgers: [],
          creditLedgers: [],
        }));

        // Populate company names for display purposes
        setPurchaseByName(filteredVoucher.purchasedBy?.companyName || "");
        setPurchaseToName(filteredVoucher.purchasedTo?.companyName || "");
      }
    }
  }, [selectedVoucherId, purchaseVouchers]);

  const filteredCompanyData = (searchTerm) => {
    // Check if companyData and companyData.data are available and are arrays
    if (companyData && Array.isArray(companyData.data)) {
      return companyData.data.filter((item) =>
        (item.companyName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    // Return an empty array if data is not available or not in the correct format
    return [];
  };

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
    const updatedItem = { ...updatedItems[index], [name]: value };

    // Update amount if rate or quantity changes
    if (name === "rate" || name === "quantity") {
      updatedItem.amount = updatedItem.rate * updatedItem.quantity;
    }

    // Update taxAmount if amount or taxRate changes
    if (name === "amount" || name === "taxRate") {
      updatedItem.taxAmount = (updatedItem.amount * updatedItem.taxRate) / 100;
    }

    updatedItems[index] = updatedItem;

    setPurchaseData((prevData) => {
      // Update the state with the new items and recalculate totals
      const newData = {
        ...prevData,
        items: updatedItems,
      };

      calculateTotals(newData); // Recalculate totals with updated data

      return newData;
    });
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
          taxRate: "",
          taxAmount: "",
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
    console.log("type", type);
    console.log("option", option);

    if (type === "credit") {
      // Handle credit ledger updates
      setPurchaseData((prevData) => {
        const updatedCreditLedgers = [...prevData.creditLedgers];

        // Update the ledger at index 1 (second position in the array)
        const indexToUpdate = 1;

        if (indexToUpdate < updatedCreditLedgers.length) {
          // If the index exists, update it
          updatedCreditLedgers[indexToUpdate] = {
            ledgerId: option._id,
            ledgerName: option.name,
            amount: prevData.subTotal || 0, // Default to 0 if subTotal is not available
          };
        } else {
          // If the index does not exist, add it
          updatedCreditLedgers.push({
            ledgerId: option._id,
            ledgerName: option.name,
            amount: prevData.subTotal || 0, // Default to 0 if subTotal is not available
          });
        }

        return {
          ...prevData,
          creditLedgers: updatedCreditLedgers,
          creditLedgerName: option.name, // Update the credit ledger name in the input field
        };
      });

      // Close the dropdown for credit
      setIsDropdownOpen((prevState) => ({
        ...prevState,
        credit: false,
      }));
    } else if (type === "debit") {
      // Handle debit ledger updates
      setPurchaseData((prevData) => {
        const updatedDebitLedgers = [...prevData.debitLedgers];

        // Update the ledger at index 0 (first position in the array)
        const indexToUpdate = 0;

        if (indexToUpdate < updatedDebitLedgers.length) {
          // If the index exists, update it
          updatedDebitLedgers[indexToUpdate] = {
            ledgerId: option._id,
            ledgerName: option.name,
            amount: prevData.subTotal || 0, // Default to 0 if subTotal is not available
          };
        } else {
          // If the index does not exist, add it
          updatedDebitLedgers.push({
            ledgerId: option._id,
            ledgerName: option.name,
            amount: prevData.subTotal || 0, // Default to 0 if subTotal is not available
          });
        }

        return {
          ...prevData,
          debitLedgers: updatedDebitLedgers,
          debitLedgerName: option.name, // Update the debit ledger name in the input field
        };
      });

      // Close the dropdown for debit
      setIsDropdownOpen((prevState) => ({
        ...prevState,
        debit: false,
      }));
    }
  };

  const handleStockSelect = (index, option) => {
    const updatedItems = [...purchaseData.items];
    updatedItems[index].stockItem = option._id; // Store the stock ID
    updatedItems[index].stockName = option.stockItem; // Display the stock name
    setPurchaseData((prevState) => ({
      ...prevState,
      items: updatedItems,
    }));
    setIsDropdownOpen({ stock: false });
  };

  const calculateTotals = () => {
    // Calculate subtotal by summing up the amount of each item
    const subTotal = purchaseData.items.reduce(
      (acc, item) => acc + item.amount,
      0
    );

    // Calculate total tax amount by summing up the taxAmount of each item
    const totalTaxAmount = purchaseData.items.reduce(
      (acc, item) => acc + item.taxAmount,
      0
    );

    // Calculate total amount (subtotal + total tax amount)
    const total = subTotal + totalTaxAmount;

    setPurchaseData((prevData) => ({
      ...prevData,
      subTotal: subTotal,
      taxAmount: totalTaxAmount,
      total: total,
      creditLedgers: prevData.creditLedgers.map((ledger, index) => {
        if (index === 0) {
          return {
            ...ledger,
            amount: total, // Assuming the first ledger on the credit side holds the total amount
          };
        }
        return ledger;
      }),
      debitLedgers: prevData.debitLedgers.map((ledger, index) => {
        if (index === 0) {
          return {
            ...ledger,
            amount: total, // The first ledger on the debit side holds the total amount
          };
        } else if (index === 1) {
          return {
            ...ledger,
            amount: subTotal, // The second ledger on the debit side holds the subtotal
          };
        } else if (index === 2) {
          return {
            ...ledger,
            amount: totalTaxAmount, // The third ledger on the debit side holds the total tax amount
          };
        }
        return ledger;
      }),
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
  const handleTaxSelect = (option) => {
    console.log("options", option);

    // Update the purchaseData state
    setPurchaseData((prevState) => {
      const taxAmount = prevState.taxAmount || 0;

      const updatedCreditLedgers = [...prevState.creditLedgers];
      updatedCreditLedgers[0] = {
        ...updatedCreditLedgers[0],
        ledgerId: option._id,
        ledgerName: option.name,
        amount: taxAmount,
      };

      return {
        ...prevState,
        creditLedgers: updatedCreditLedgers,
      };
    });

    // Update the taxDropdownState to reflect selected value in the input
    setTaxDropdownState((prevState) => ({
      ...prevState,
      searchTerm: option.name, // Update searchTerm to display selected value
      isDropdownOpen: false,
    }));
  };

  // Filter tax data based on search term
  const filteredTaxData = (searchTerm) =>
    ledgerData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  const { data: companyData = [] } = useGetCompaniesQuery();

  console.log("companyData", companyData);
  const [searchTermPurchasedBy, setSearchTermPurchasedBy] = useState("");
  const [searchTermPurchasedTo, setSearchTermPurchasedTo] = useState("");
  const handleSelect = (field, option) => {
    setPurchaseData((prevState) => ({
      ...prevState,
      [field]: option._id, // Store the selected company's _id
    }));
    if (field === "purchasedBy") {
      setPurchaseByName(option.companyName); // Store the selected company's name for display
      setSearchTermPurchasedBy(""); // Reset search term after selection
    } else if (field === "purchasedTo") {
      setPurchaseToName(option.companyName); // Store the selected company's name for display
      setSearchTermPurchasedTo(""); // Reset search term after selection
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
              Select Voucher Number
            </label>
            <select
              value={selectedVoucherId}
              onChange={(e) => setSelectedVoucherId(e.target.value)}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
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
          {/* Row 4 - Purchased By */}
          <div className="relative flex flex-col mb-4">
            <label className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
              Purchased By
            </label>
            <input
              type="text"
              value={purchaseByName} // Display the selected company's name
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
                className="absolute left-0 mt-[70px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg w-full max-h-60 overflow-y-auto z-10"
              >
                <div className="p-2">
                  {filteredCompanyData(searchTermPurchasedBy).length > 0 ? (
                    filteredCompanyData(searchTermPurchasedBy).map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleSelect("purchasedBy", item)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        {item.companyName}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500 dark:text-gray-300">
                      No data found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Row 4 - Purchased To */}
          <div className="relative flex flex-col mb-4">
            <label className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
              Purchased To
            </label>
            <input
              type="text"
              value={purchaseToName} // Display the selected company's name
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
                className="absolute left-0 mt-[70px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg w-full max-h-60 overflow-y-auto z-10"
              >
                <div className="p-2">
                  {filteredCompanyData(searchTermPurchasedTo).length > 0 ? (
                    filteredCompanyData(searchTermPurchasedTo).map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleSelect("purchasedTo", item)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        {item.companyName}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500 dark:text-gray-300">
                      No data found
                    </div>
                  )}
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
      {/* Table container */}
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
                  "Tax Rate", // Added Tax Rate header
                  "Tax Amount", // Added Tax Amount header
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

                  {/* Tax Rate Field */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.taxRate}
                      onChange={(e) =>
                        handleItemChange(index, "taxRate", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </td>

                  {/* Tax Amount Field */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={
                        item.taxAmount || (item.taxRate * item.amount) / 100
                      }
                      readOnly
                      className="w-full px-2 py-1 border rounded bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
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
                      <input
                        type="text"
                        placeholder="Search..."
                        value={item.stockName || searchTermStock}
                        onClick={() =>
                          setIsDropdownOpen((prevState) => ({
                            ...prevState,
                            stock: !prevState.stock,
                          }))
                        }
                        onChange={(e) => setSearchTermStock(e.target.value)}
                        className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      />
                      {isDropdownOpen.stock && (
                        <ul
                          ref={dropdownRefs.stock}
                          className="absolute z-10 bg-white border border-gray-300 rounded shadow-md w-full max-h-40 overflow-auto"
                        >
                          {filteredStockData(searchTermStock).map(
                            (option, optionIndex) => (
                              <li
                                key={optionIndex}
                                onClick={() => handleStockSelect(index, option)}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                              >
                                {option.stockItem}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button
                      onClick={() => deleteItem(index)}
                      className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
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

      {/* Responsive Items Create */}
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

            {/* New TaxRate Field */}
            <div className="font-bold mb-2 mt-4">Tax Rate (%)</div>
            <input
              type="number"
              value={item.taxRate}
              onChange={(e) =>
                handleItemChange(index, "taxRate", e.target.value)
              }
              className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />

            {/* New TaxAmount Field */}
            <div className="font-bold mb-2 mt-4">Tax Amount</div>
            <input
              type="number"
              value={item.taxAmount || (item.taxRate * item.amount) / 100} // Auto-calculation
              readOnly
              className="w-full px-2 py-1 border rounded bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
            />

            <div className="font-bold mb-2 mt-4">Amount</div>
            <input
              type="number"
              value={item.amount}
              readOnly
              className="w-full px-2 py-1 border rounded bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
            />

            <div className="font-bold mb-2 mt-4">Stock Items</div>
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
      {/* Tax Ledger dummy */}
      <div className="space-y-4 md:space-y-6 mt-10">
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Tax Ledger */}
          <div className="relative flex-1 min-w-[200px]">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="taxLedger"
            >
              Tax in purchase
            </label>
            <input
              type="text"
              name="taxLedger"
              id="taxLedger"
              value={
                debitNote.debitLedgers?.[0]?.ledgerName ||
                "Please fill in the tax ledger"
              }
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                !debitNote.debitLedgers?.[0]?.ledgerName
                  ? "text-red-500"
                  : "text-gray-700"
              }`}
              readOnly
            />
          </div>
          {/* Credit Ledger */}
          <div className="relative flex-1 min-w-[200px]">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="creditLedger"
            >
              Credit in purchase Ledger
            </label>
            <input
              type="text"
              name="creditLedger"
              id="creditLedger"
              value={
                debitNote.creditLedgers?.[0]?.ledgerName ||
                "Please fill in the credit ledger"
              }
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                !debitNote.creditLedgers?.[0]?.ledgerName
                  ? "text-red-500"
                  : "text-gray-700"
              }`}
              readOnly
            />
          </div>
          {/* Debit Ledger */}
          <div className="relative flex-1 min-w-[200px]">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="debitLedger"
            >
              Debit in purchase Ledger
            </label>
            <input
              type="text"
              name="debitLedger"
              id="debitLedger"
              value={
                debitNote.debitLedgers?.[1]?.ledgerName ||
                "Please fill in the debit ledger"
              }
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                !debitNote.debitLedgers?.[1]?.ledgerName
                  ? "text-red-500"
                  : "text-gray-700"
              }`}
              readOnly
            />
          </div>
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
              value={taxDropdownState.searchTerm} // Should display the selected tax ledger name
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
                            isDropdownOpen: false,
                          }));
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {option.name}
                      </li>
                    )
                  )}
                  {filteredTaxData(taxDropdownState.searchTerm).length ===
                    0 && (
                    <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      No results found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Credit Ledger */}
          <div className="relative flex-1 min-w-[200px]">
            {/* Label */}
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="creditLedger"
            >
              Credit Ledger
            </label>

            {/* Input Field */}
            <input
              type="text"
              name="creditLedger"
              id="creditLedger"
              value={searchTermCredit} // Display the current search term or selected ledger name
              onClick={() =>
                setIsDropdownOpen((prevState) => ({
                  ...prevState,
                  credit: !prevState.credit,
                }))
              }
              onChange={(e) => setSearchTermCredit(e.target.value)} // Update search term on change
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />

            {/* Dropdown */}
            {isDropdownOpen.credit && (
              <div
                ref={dropdownRefs.credit}
                className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full dark:bg-gray-800 dark:border-gray-600"
              >
                {/* List of Options */}
                <ul className="max-h-40 overflow-auto">
                  {filteredLedgerData(searchTermCredit).map((option) => (
                    <li
                      key={option._id}
                      onClick={() => {
                        handleLedgerSelect("credit", option); // Handle selection logic
                        setSearchTermCredit(option.name); // Update the searchTermCredit with the selected name
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
                  {/* Handle no results found */}
                  {filteredLedgerData(searchTermCredit).length === 0 && (
                    <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      No results found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Debit Ledger */}
          {/* Debit Ledger */}
          <div className="relative flex-1 min-w-[200px]">
            {/* Label */}
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="debitLedger"
            >
              Debit Ledger
            </label>

            {/* Input Field */}
            <input
              type="text"
              name="debitLedger"
              id="debitLedger"
              value={
                purchaseData.debitLedgers[0]?.ledgerName || searchTermDebit
              } // Display selected ledger name or search term
              onClick={() =>
                setIsDropdownOpen((prevState) => ({
                  ...prevState,
                  debit: !prevState.debit, // Toggle dropdown visibility
                }))
              }
              onChange={(e) => setSearchTermDebit(e.target.value)} // Update search term on change
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />

            {/* Dropdown */}
            {isDropdownOpen.debit && (
              <div
                ref={dropdownRefs.debit}
                className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full dark:bg-gray-800 dark:border-gray-600"
              >
                {/* List of Options */}
                <ul className="max-h-40 overflow-auto">
                  {filteredLedgerData(searchTermDebit).map((option) => (
                    <li
                      key={option._id}
                      onClick={() => {
                        handleLedgerSelect("debit", option); // Handle selection logic
                        setSearchTermDebit(option.name); // Set search term to the selected ledger name
                        setIsDropdownOpen((prevState) => ({
                          ...prevState,
                          debit: false, // Close the dropdown after selection
                        }));
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {option.name}
                    </li>
                  ))}

                  {/* Handle no results found */}
                  {filteredLedgerData(searchTermDebit).length === 0 && (
                    <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      No results found
                    </li>
                  )}
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
          {isLoading ? "Saved..." : "Save"}
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

export default DebitNote;
