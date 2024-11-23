import React, { useState, useRef, useEffect } from "react";
import {
  useGetLedgerQuery,
  useCreateLedgerMutation,
} from "../store/api/LedgerApi";
import {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
} from "../store/api/CompanyApi";

import CreateCompanyModal from "../vouchers/dummy2/CompanyCreateModal";
import { useGetPurchasesQuery } from "../store/api/PurchaseApi";
import {
  useCreateSalesVoucherMutation,
  useCheckVoucherNumberQuery,
} from "../store/api/SalesApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateStockModal from "../vouchers/dummy2/CreateStock";
import Ledger from "../vouchers/dummy2/Ledger";
import { FaPlus, FaBuilding, FaBook } from "react-icons/fa";
import { useGetLedgerAllPurchaseQuery } from "../store/api/LedgerApi";
const SalesVoucher = () => {
  const { data: companyData = [], refetch: refetching } =
    useGetCompaniesQuery();

  const { data: ledgerData = [], refetch } = useGetLedgerQuery();

  // const { data: stockData = [], refetch: stockrefetch } =
  //   useGetPurchasesQuery();

  const { data: stockData = [], refetch: stockItemsrefetch } =
    useGetLedgerAllPurchaseQuery();
  console.log("stockData ", stockData);
  useEffect(() => {
    // stockrefetch();
    stockItemsrefetch();
  }, [stockItemsrefetch]);

  const [purchaseData, setPurchaseData] = useState({
    voucherType: "Sales Voucher",
    voucherNumber: "",
    transactionDate: "",

    saleInvoiceNumber: "",

    purchasedBy: "",
    purchasedTo: "",
    description: "",
    items: [
      {
        id: 1,
        serialNumber: "1",
        stockName: "",

        quantity: 1,
        rate: "",
        amount: 0,
        unit: "",
        actualrate: "",
        hsnCode: "",
        taxRate: "",
        taxAmount: 0,

        stockId: "",
        subtotal: 0,
        total: 0,
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
  console.log("salesData", purchaseData);
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
  const [selectedStock, setSelectedStock] = useState({ name: "", id: "" }); // Selected stock state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    debit: false,
    credit: false,
    tax: false,
    stock: false,
    purchaseBy: false,
    purchaseTo: false,
  });
  const { data: voucherCheck, refetch: voucherChecking } =
    useCheckVoucherNumberQuery();
  const { data: Purchase } = useGetPurchasesQuery();
  console.log("Purchase ", Purchase);
  const [selectedVoucherIds, setSelectedVoucherIds] = useState("New bill");

  const [selectedPayments, setSelectedPayments] = useState("Unsettled");
  // Handle voucher number check

  useEffect(() => {
    if (voucherCheck && voucherCheck.length > 0) {
      // Extract existing voucher numbers
      const existingVoucherNumbers = voucherCheck.map(
        (voucher) => voucher.voucherNumber
      );

      // Find the maximum voucher number
      const maxVoucherNumber = Math.max(...existingVoucherNumbers, -1);

      // Set the new voucher number
      const newVoucherNumber = maxVoucherNumber + 1;

      // Update the purchase data
      setPurchaseData((prevData) => ({
        ...prevData,
        voucherNumber: newVoucherNumber, // Set the incremented voucher number
      }));
    }
  }, [voucherCheck]);
  const [askHelp, setAskHelp] = useState(false); // State to manage modal visibility

  const openModalAsk = () => {
    setAskHelp(true); // Function to open the modal
  };

  const closeModalAsk = () => {
    setAskHelp(false); // Function to close the modal
  };
  // Filter stock data based on search term
  useEffect(() => {
    setPurchaseData((prevData) => ({
      ...prevData,
      thisPurchase: selectedVoucherIds, // Update with selected voucher option
    }));
  }, [selectedVoucherIds]);
  useEffect(() => {
    if (purchaseData.transactionDate && purchaseData.creditPeriod) {
      const transactionDate = new Date(purchaseData.transactionDate);

      const creditDueDate = new Date(transactionDate);

      creditDueDate.setDate(
        creditDueDate.getDate() + parseInt(purchaseData.creditPeriod)
      );

      setPurchaseData((prevData) => ({
        ...prevData,
        creditDueDate: creditDueDate.toISOString().split("T")[0],
      }));
    }
  }, [purchaseData.transactionDate, purchaseData.creditPeriod]);

  // Update purchaseData when payment status is selected
  useEffect(() => {
    setPurchaseData((prevData) => ({
      ...prevData,
      status: selectedPayments, // Update with selected payment status
    }));
  }, [selectedPayments]);
  const [createSales, { isLoading, isSuccess, isError, error }] =
    useCreateSalesVoucherMutation();
  const handleSaveAndSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Submit the purchase data directly
      await createSales(purchaseData).unwrap();

      // Optionally reset the form or provide feedback to the user
      // Step 2: Refetch the voucher numbers after successful sales creation
      voucherChecking(); // Refetch the voucher numbers
      stockItemsrefetch();
      setPurchaseData({
        voucherNumber: "",
        transactionDate: "",
        creditPeriod: "",
        creditAmount: "",
        creditDueDate: "",
        saleInvoiceNumber: "",
        authorizedBy: {
          name: "",
          designation: "",
          signature: "",
        },
        purchasedBy: "", // Reset to empty
        purchasedTo: "", // Reset to empty
        description: "",
        items: [
          {
            stockName: "",

            quantity: 1,
            rate: "",
            amount: 0,
            unit: "",
            actualrate: "",
            hsnCode: "",
            taxRate: "",
            taxAmount: 0,

            stockId: "",
            subtotal: 0,
            total: 0,
          },
        ],
        debitLedgers: [
          { ledgerId: "", ledgerName: "Select Ledger", amount: "" },
        ], // Reset to default dropdown value
        creditLedgers: [
          { ledgerId: "", ledgerName: "Select Ledger", amount: "" },
        ], // Reset to default dropdown value
        taxId: "",
        taxRate: 0,
        taxName: "",
        subTotal: 0,
        taxAmount: 0,
        total: 0,
      });
      // Reset dropdown search term
      setSearchTermDebit("");
      setSearchTermCredit("");
      setTaxDropdownState({
        searchTerm: "", // Reset search term
        isDropdownOpen: false, // Close the dropdown
      });
      // Reset purchaseToName and purchaseByName
      setPurchaseToName(""); // Reset input value
      setPurchaseByName(""); // Reset input value

      // Reset search terms
      setSearchTermPurchasedTo(""); // Reset search term for "Purchased To"
      setSearchTermPurchasedBy(""); // Reset search term for "Purchased By"

      // Reset dropdown states
      setIsDropdownOpen({ purchasedTo: false, purchasedBy: false });
      setSearchTermStock(""); // Reset stock search term
      setIsDropdownOpen({ stock: false }); // Close dropdown
      // Show success toast with 3-second auto-close
      toast.success("Sales created successfully!", {
        autoClose: 3000, // Close after 3 seconds
      });
    } catch (error) {
      console.error("Failed to create sales:", error);

      // Show error toast with 3-second auto-close
      toast.error("An error occurred while creating the purchase.", {
        autoClose: 3000, // Close after 3 seconds
      });
    }
  };
  const [createStockGroup] = useCreateLedgerMutation();
  const [createCompany] = useCreateCompanyMutation();
  const [createLedger] = useCreateLedgerMutation(); // Hook for creating new ledger
  const [localLedgerData, setLocalLedgerData] = useState([]); // Local ledger state for dropdown
  // Handle ledger creation
  const handleLedgerCreation = async (newLedgerData) => {
    try {
      const newLedger = await createLedger(newLedgerData).unwrap();
      setLocalLedgerData([...localLedgerData, newLedger]); // Update local state
      refetch(); // Refetch ledger data to sync
      setIsLedgerModalOpen(false); // Close modal
    } catch (error) {
      console.error("Failed to create ledger:", error);
    }
  };
  const [searchTerms, setSearchTerms] = useState({}); // Keep it as an object or convert to an array if preferred
  console.log("searchTerms", searchTerms);
  const handleStockSelect = (index, stock) => {
    console.log("stock", stock);
    // Set the stock name for the selected index
    setSearchTerms((prev) => ({
      ...prev,
      [index]: stock.name,
    }));

    setPurchaseData((prevData) => {
      const updatedItems = [...prevData.items];
      updatedItems[index] = {
        ...updatedItems[index],

        stockName: stock.name,
        stockId: stock._id,
      };
      return { ...prevData, items: updatedItems };
    });

    // Close the dropdown for the selected index
    setIsDropdownOpen((prev) => ({
      ...prev,
      [index]: false,
    }));
  };
  console.log("stockData", stockData);
  const filteredStockData = (searchTerm) => {
    // Ensure searchTerm is a string before proceeding
    const term = typeof searchTerm === "string" ? searchTerm : "";

    return stockData.filter((item) =>
      item.name?.toLowerCase().includes(term.toLowerCase())
    );
  };

  const handleCompanyCreation = async (newLedgerData) => {
    try {
      const newLedger = await createCompany(newLedgerData).unwrap();
      setLocalLedgerData([...localLedgerData, newLedger]); // Update local state
      refetching(); // Refetch ledger data to sync
      setIsLedgerModalOpen(false); // Close modal
    } catch (error) {
      console.error("Failed to create ledger:", error);
    }
  };
  const handleStockCreation = async (newStockGroupData) => {
    try {
      await createStockGroup(newStockGroupData).unwrap();
      toast.success("Stock group created successfully!");
      closeModal(); // Close the modal after successful creation
      stockItemsrefetch();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };
  // Handle selection of a stock
  const handleStockSelects = (stock) => {
    const updatedItems = [...purchaseData.items];

    updatedItems[0].stockGroup = stock.stockGroup; // Set stock group
    updatedItems[0].stockGroupId = stock._id; // Set stock group ID

    setPurchaseData({
      ...purchaseData,
      items: updatedItems,
    });

    setSelectedStock({ name: stock.stockGroup, id: stock._id }); // Set selected stock name and ID
    setSearchTermStock(stock.stockGroup); // Set input value to selected stock name
    setIsDropdownOpen((prevState) => ({ ...prevState, stock: false })); // Close dropdown
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
    updatedItems[index] = { ...updatedItems[index], [name]: value };

    // Calculate the amount when rate or quantity changes
    if (name === "rate") {
      updatedItems[index].amount = updatedItems[index].rate * 1;
    }

    // Calculate the taxAmount when taxRate, rate, or quantity changes
    if (name === "taxRate" || name === "rate" || name === "quantity") {
      const { taxRate, amount } = updatedItems[index];
      updatedItems[index].taxAmount = (taxRate * amount) / 100;
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
          stockName: "",

          quantity: "",
          rate: "",
          amount: 0,
          unit: "",
          actualrate: "",
          hsnCode: "",
          taxRate: "",
          taxAmount: 0,

          stockId: "",
          subtotal: 0,
          total: 0,
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
    if (type === "credit") {
      setSearchTermCredit(option.name);
      // Handle credit ledger updates
      setPurchaseData((prevData) => {
        const updatedCreditLedgers = [...prevData.creditLedgers];

        // Update or add the ledger based on its index (index 1 for credit)
        const indexToUpdate = 1;

        if (indexToUpdate < updatedCreditLedgers.length) {
          updatedCreditLedgers[indexToUpdate] = {
            ledgerId: option._id,
            ledgerName: option.name,
            amount: prevData.total || 0,
          };
        } else {
          updatedCreditLedgers.push({
            ledgerId: option._id,
            ledgerName: option.name,
            amount: prevData.total || 0,
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
      setSearchTermDebit(option.name);
      setPurchaseData((prevData) => {
        const updatedDebitLedgers = [...prevData.debitLedgers];

        // Update or add the ledger based on its index (index 0 for debit)
        const indexToUpdate = 0;

        if (indexToUpdate < updatedDebitLedgers.length) {
          updatedDebitLedgers[indexToUpdate] = {
            ledgerId: option._id,
            ledgerName: option.name,
            amount: prevData.total || 0,
          };
        } else {
          updatedDebitLedgers.push({
            ledgerId: option._id,
            ledgerName: option.name,
            amount: prevData.total || 0,
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

  const calculateTotals = () => {
    // Calculate subtotal by summing up all item amounts
    const subTotal = purchaseData.items.reduce(
      (acc, item) => acc + item.amount,
      0
    );

    // Sum all individual tax amounts to calculate the total tax amount
    const totalTaxAmount = purchaseData.items.reduce(
      (acc, item) => acc + (item.taxAmount || 0), // Handle cases where taxAmount may be undefined
      0
    );

    // Total is subtotal plus the total tax amount
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
            amount: totalTaxAmount, // Credit Ledger at index 0 holds the total tax amount
          };
        } else if (index === 1) {
          return {
            ...ledger,
            amount: total, // Credit Ledger at index 1 holds the total
          };
        }
        return ledger;
      }),
      debitLedgers: prevData.debitLedgers.map((ledger, index) => {
        if (index === 0) {
          return {
            ...ledger,
            amount: total, // Debit Ledger at index 0 holds the total
          };
        }
        return ledger;
      }),
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [purchaseData.items, purchaseData.taxRate]);

  const filteredLedgerData = (searchTerm) =>
    ledgerData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
    setTaxDropdownState((prevState) => ({
      ...prevState,
      searchTerm: option.name, // Update the search term or selected value
      isDropdownOpen: false, // Close the dropdown after selection
    }));
    setPurchaseData((prevState) => {
      // Calculate or retrieve the taxAmount
      const taxAmount = prevState.taxAmount; // Or calculate it if needed

      // Clone the existing debitLedgers array
      const updatedCreditLedgers = [...prevState.creditLedgers];

      // Update the first index (index 0) with the selected tax details
      updatedCreditLedgers[0] = {
        ...updatedCreditLedgers[0],
        ledgerId: option._id,
        ledgerName: option.name,
        amount: taxAmount, // Set the calculated or retrieved taxAmount
      };

      return {
        ...prevState,
        creditLedgers: updatedCreditLedgers, // Set updated debitLedgers
      };
    });

    // Close the dropdown after selection
    setTaxDropdownState((prevState) => ({
      ...prevState,
      isDropdownOpen: false,
    }));
  };
  // Filter tax data based on search term
  const filteredTaxData = (searchTerm) =>
    ledgerData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
  const filteredData = filteredStockData(searchTermStock); // Filtered data based on search term
  const [isTrue, setIsTrue] = useState(false);

  const handleClick = () => {
    setIsTrue(!isTrue); // Toggle between true and false
  };
  return (
    <div className="p-2">
      {/* form field  */}
      <form className="max-w-6xl mx-auto p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-10 ">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Row 1 */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Voucher Number
            </label>
            <input
              type="number"
              name="voucherNumber"
              value={purchaseData.voucherNumber}
              readOnly
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

          {/* Row 2 */}

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Invoice Number
            </label>
            <input
              type="text"
              name="saleInvoiceNumber"
              value={purchaseData.saleInvoiceNumber}
              onChange={handleChange}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Row 3 */}

          {/* Row 4 */}
          {/* Row 4 - Purchased By */}
          <div className="relative flex flex-col mb-4">
            <label className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
              Shipped To
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
              Billeed To
            </label>
            <input
              type="text"
              value={purchaseToName} // Display the selected company's name
              onChange={(e) => {
                setSearchTermPurchasedTo(e.target.value); //ivide
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

          {/* Tax Ledger */}
          <div className="relative flex flex-col">
            <label
              className=" text-gray-700 dark:text-gray-300"
              htmlFor="taxLedger"
            >
              Tax Ledger
            </label>
            <input
              type="text"
              name="taxLedger"
              id="taxLedger"
              value={taxDropdownState.searchTerm}
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
              className="mt-1 p-2 bg-gray-100  dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
            {taxDropdownState.isDropdownOpen && (
              <div
                ref={taxDropdownRef}
                style={{ top: "100%", right: 0 }} // Position above the input
                className="absolute mt-2 z-10 bg-white border border-gray-300  w-full dark:bg-gray-800 dark:border-gray-600 rounded-md shadow-sm dark:focus:ring dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              >
                <ul className="max-h-40 overflow-auto">
                  {filteredTaxData(taxDropdownState.searchTerm).length > 0 ? (
                    filteredTaxData(taxDropdownState.searchTerm).map(
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
                    )
                  ) : (
                    <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      No data
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          {/* Credit Ledger */}
          <div className="relative flex flex-col">
            <label
              className=" text-gray-700 dark:text-gray-300"
              htmlFor="creditLedger"
            >
              Credit Ledger
            </label>
            <input
              type="text"
              name="creditLedger"
              id="creditLedger"
              value={searchTermCredit}
              onClick={() =>
                setIsDropdownOpen((prevState) => ({
                  ...prevState,
                  credit: !prevState.debit,
                }))
              }
              onChange={(e) => setSearchTermCredit(e.target.value)}
              className="mt-1 p-2 bg-gray-100  dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
            {isDropdownOpen.credit && (
              <div
                ref={dropdownRefs.credit}
                style={{ top: "100%", right: 0 }} // Position above the input
                className="absolute mt-2 z-10 bg-white border border-gray-300  w-full dark:bg-gray-800 dark:border-gray-600 rounded-md shadow-sm dark:focus:ring dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              >
                <ul className="max-h-40 overflow-auto">
                  {filteredLedgerData(searchTermCredit).length > 0 ? (
                    filteredLedgerData(searchTermCredit).map((option) => (
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
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      No data
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          {/* Debit Ledger */}
          <div className="relative flex flex-col">
            <label
              className=" text-gray-700 dark:text-gray-300"
              htmlFor="debitLedger"
            >
              Debit Ledger
            </label>
            <input
              type="text"
              name="debitLedger"
              id="debitLedger"
              value={searchTermDebit}
              onClick={() =>
                setIsDropdownOpen((prevState) => ({
                  ...prevState,
                  debit: !prevState.debit,
                }))
              }
              onChange={(e) => setSearchTermDebit(e.target.value)}
              className="mt-1 p-2 bg-gray-100  dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
            {isDropdownOpen.debit && (
              <div
                ref={dropdownRefs.debit}
                className="absolute mt-2 z-10 bg-white border border-gray-300 rounded mb-1 w-full dark:bg-gray-800 dark:border-gray-600"
                style={{ top: "100%", right: 0 }} // Position above the input
              >
                <ul className="max-h-40 overflow-auto">
                  {filteredLedgerData(searchTermDebit).length > 0 ? (
                    filteredLedgerData(searchTermDebit).map((option) => (
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
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      No data
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Tax Amount
            </label>
            <input
              type="number"
              name="taxAmount"
              id="taxAmount"
              value={
                typeof purchaseData.taxAmount === "number"
                  ? purchaseData.taxAmount.toFixed(2)
                  : "0.00"
              }
              readOnly
              className="mt-1 p-2 bg-gray-100 appearance-none cursor-not-allowed dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">Subtotal</label>
            <input
              type="number"
              name="subTotal"
              id="subTotal"
              value={
                typeof purchaseData.subTotal === "number"
                  ? purchaseData.subTotal.toFixed(2)
                  : "0.00"
              }
              readOnly
              className="mt-1 p-2 bg-gray-100 appearance-none cursor-not-allowed dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">Total</label>
            <input
              type="number"
              name="total"
              id="total"
              value={
                typeof purchaseData.total === "number"
                  ? purchaseData.total.toFixed(2)
                  : "0.00"
              }
              readOnly
              className="mt-1 p-2 bg-gray-100 appearance-none cursor-not-allowed dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </form>
      {/* ithu main table container*/}

      {/* Table container */}
      <div className="hidden lg:block mt-10  dark:border-slate-50 dark:border-2 dark:rounded-lg">
        <div className="">
          <table className="min-w-full bg-white  dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {[
                  "Item Descriptions",
                  "HSN Code",
                  "Unit",
                  "Acutal Rate",

                  "Rate",

                  "Tax Rate", // Added Tax Rate header
                  "Tax Amount", // Added Tax Amount header
                  "Amount",

                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="py-2 px-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className=" dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
              {purchaseData.items.map((item, index) => (
                <tr
                  key={item.id}
                  className="text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <td className=" p-1 whitespace-nowrap bg-white dark:bg-gray-800 dark:text-white">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerms[index] || ""} // Use empty string if undefined
                        onClick={() =>
                          setIsDropdownOpen((prev) => ({
                            ...prev,
                            [index]: !prev[index],
                          }))
                        }
                        onChange={(e) => {
                          // Update the search term for the specific index
                          setSearchTerms((prev) => ({
                            ...prev,
                            [index]: e.target.value, // Correctly set the current value
                          }));
                        }}
                        className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      />
                      {isDropdownOpen[index] && (
                        <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md w-full max-h-40 overflow-auto dark:bg-gray-800 dark:text-white">
                          {filteredStockData(searchTerms[index] || "").length >
                          0 ? (
                            filteredStockData(searchTerms[index] || []).map(
                              (option) => (
                                <li
                                  key={option._id}
                                  onClick={() =>
                                    handleStockSelect(index, option)
                                  }
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                  {option.name}
                                </li>
                              )
                            )
                          ) : (
                            <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
                              No data
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </td>
                  <td className=" p-1 whitespace-nowrap bg-white dark:bg-gray-800 dark:text-white">
                    <input
                      type="text"
                      value={item.hsnCode}
                      onChange={(e) =>
                        handleItemChange(index, "hsnCode", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </td>
                  <td className=" p-1 whitespace-nowrap bg-white dark:bg-gray-800 dark:text-white">
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) =>
                        handleItemChange(index, "unit", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </td>

                  <td className=" p-1 whitespace-nowrap bg-white dark:bg-gray-800 dark:text-white">
                    <input
                      type="text"
                      value={item.actualrate}
                      onChange={(e) =>
                        handleItemChange(index, "actualrate", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </td>
                  <td className=" p-1 whitespace-nowrap bg-white dark:bg-gray-800 dark:text-white">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(index, "rate", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </td>

                  {/* Tax Rate Field */}
                  <td className=" p-1 whitespace-nowrap bg-white dark:bg-gray-800 dark:text-white">
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
                  <td className=" p-1 whitespace-nowrap bg-white dark:bg-gray-800 dark:text-white">
                    <input
                      type="number"
                      value={
                        item.taxAmount || (item.taxRate * item.amount) / 100
                      }
                      readOnly
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </td>

                  <td className=" p-1 whitespace-nowrap bg-white dark:bg-gray-800 dark:text-white">
                    <input
                      type="number"
                      value={item.amount}
                      readOnly
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </td>

                  <td className=" p-1 whitespace-nowrap bg-white dark:bg-gray-800 dark:text-white">
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
            {/* Stock Items Dropdown */}
            <div className="font-bold mb-2 mt-4  whitespace-nowrap bg-white dark:bg-gray-800 dark:text-white">
              Stock Items
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerms[index] || ""} // Use empty string if undefined
                onClick={() =>
                  setIsDropdownOpen((prev) => ({
                    ...prev,
                    [index]: !prev[index],
                  }))
                }
                onChange={(e) => {
                  // Update the search term for the specific index
                  setSearchTerms((prev) => ({
                    ...prev,
                    [index]: e.target.value, // Correctly set the current value
                  }));
                }}
                className="w-full px-2 py-1 border rounded  whitespace-nowrap bg-white dark:bg-gray-800 dark:text-white"
              />
              {isDropdownOpen[index] && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md w-full max-h-40 overflow-auto  whitespace-nowrap  dark:bg-gray-800 dark:text-white">
                  {filteredStockData(searchTerms[index] || "").length > 0 ? (
                    filteredStockData(searchTerms[index] || []).map(
                      (option) => (
                        <li
                          key={option._id}
                          onClick={() => handleStockSelect(index, option)}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200  whitespace-nowrap bg-white dark:bg-gray-800 dark:text-white"
                        >
                          {" "}
                          {console.log("option", option.name)}
                          {option.name}
                        </li>
                      )
                    )
                  ) : (
                    <li className="px-4 py-2 text-gray-500">No data</li>
                  )}
                </ul>
              )}
            </div>

            {/* Other Input Fields */}

            <div className="font-bold mb-2 mt-4">HSN Code</div>
            <input
              type="text"
              value={item.hsnCode}
              onChange={(e) =>
                handleItemChange(index, "hsnCode", e.target.value)
              }
              className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />

            <div className="font-bold mb-2 mt-4">Actual Rate</div>
            <input
              type="number"
              value={item.actualrate}
              onChange={(e) =>
                handleItemChange(index, "actualrate", e.target.value)
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

            {/* Tax Rate Field */}
            <div className="font-bold mb-2 mt-4">Tax Rate (%)</div>
            <input
              type="number"
              value={item.taxRate}
              onChange={(e) =>
                handleItemChange(index, "taxRate", e.target.value)
              }
              className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />

            {/* Tax Amount (Auto-calculated) */}
            <div className="font-bold mb-2 mt-4">Tax Amount</div>
            <input
              type="number"
              value={item.taxAmount || (item.taxRate * item.amount) / 100}
              readOnly
              className="w-full px-2 py-1 border rounded bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
            />

            {/* Amount Field (Read-only) */}
            <div className="font-bold mb-2 mt-4">Amount</div>
            <input
              type="number"
              value={item.amount}
              readOnly
              className="w-full px-2 py-1 border rounded bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
            />

            {/* Delete Button */}
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
      {/*buttons*/}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-10">
        <button
          onClick={addItem}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800"
        >
          <FaPlus className="mr-2" /> {/* Add icon */}
          Add Item
        </button>

        <button
          onClick={openLedgerModal}
          className="flex items-center bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800"
        >
          <FaBook className="mr-2" /> {/* Add icon */}
          Add Ledger
        </button>

        {isLedgerModalOpen && (
          <Ledger
            closeModal={closeLedgerModal}
            onLedgerCreate={handleLedgerCreation}
          />
        )}

        <button
          onClick={openModal}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <FaBuilding className="mr-2" /> {/* Add icon */}
          Add Company
        </button>

        {isModalOpen && (
          <CreateCompanyModal
            closeModal={closeModal}
            onCompanyCreate={handleCompanyCreation} // correct spelling here
            isLoading={isLoading}
            themeMode="dark"
          />
        )}

        <button
          onClick={openModali}
          className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <FaPlus className="mr-2" /> {/* Add icon */}
          Stock group
        </button>

        {isModalOpeni && (
          <CreateStockModal
            onClose={closeModali}
            createStockGroup={handleStockCreation}
          />
        )}
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
        <button
          onClick={openModalAsk} // On button click, open the modal
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
        >
          Any Help
        </button>

        {askHelp && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 overflow-y-auto">
            <div className="bg-white lg:mr-24 rounded-lg p-6 md:p-8 max-w-lg md:max-w-6xl mx-auto relative shadow-lg border border-blue-300">
              <button
                onClick={closeModalAsk} // Close modal when "Thank You" is clicked
                className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
              >
                Thank You
              </button>
              <h2 className="text-xl font-bold text-center mb-4 text-blue-600 tracking-wide">
                Information Guide
              </h2>
              <div className="overflow-y-auto max-h-[70vh]">
                {" "}
                {/* Limit height for scrolling */}
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  <span className="font-semibold">Shipped To:</span>
                  ഇവിടെ Shipped To കൊണ്ട് ഉദേശിക്കുന്നത് നിങ്ങൾ Invoice
                  കൊടുക്കുമ്പോൾ അവിടെ Shipped To എന്ന ഭാഗത്തു ഏതു company name
                  വയ്ക്കണമോ അത് കൊടുക്കണം. അതായതു നിങ്ങൾ ഒരു സേവനം നൽകി അതിന്റെ
                  ശമ്പളം തരേണ്ട കമ്പനി പേര് .
                </p>
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  <span className="font-semibold">Billed To:</span>
                  ഇവിടെ Billed To കൊണ്ട് ഉദ്ദേശിക്കുന്നത് നിങ്ങൾ Invoice
                  കൊടുക്കുമ്പോൾ അവിടെ Billed To എന്ന ഭാഗത്തു ഏതു company name
                  വയ്ക്കണമോ അത് കൊടുക്കണം.അതായതു നിങ്ങൾ ഒരു സേവനം നൽകി അതിന്റെ
                  ശമ്പളം തരേണ്ട കമ്പനി പേരിനു മറ്റെന്തെങ്കിലും സബ്ഡിവിഷൻ
                  ഉണ്ടെങ്കിൽ അതും കൊടുക്കാം
                </p>
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  <span className="font-semibold">Tax Ledger:</span> ഇവിടെ Tax
                  Ledger കൊണ്ട് ഉദ്ദേശിക്കുന്നത് നമ്മൾ ഒരു സേവനം ( നമ്മുടെ
                  വാഹനങ്ങൾ വാടകയ്ക്കു നൽകുന്നത് ) ഒരാൾക്ക് നൽകുമ്പോൾ അയാൾ ആ
                  സേവനത്തിനു തരുന്ന GST രേഖപ്പെടുത്തണം . ആ GST Duties & Tax
                  കീഴിൽ കൊടുക്കണം . ഇവിടെ GST നൽകുന്ന പേര് നിങ്ങൾക്കു
                  ഇഷ്ടമുള്ളത് കൊടുക്കാം . sales gst, under 18% gst ,output gst
                  ഇങ്ങനെ നിങ്ങൾക്കു ഇഷ്ടമുള്ള പേര് കൊടുക്കാം പക്ഷെ Duties % tax
                  കീഴിൽ മാത്രമേ വരവ് .
                </p>
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  <span className="font-semibold">Debit Ledger:</span>
                  ഇവിടെ Debit Ledger കൊണ്ട് ഉദ്ദേശിക്കുന്നത് നമ്മൾ ഒരു സേവനം
                  നൽകുമ്പോൾ ആ സമയം തന്നെ പൈസ തരാം അല്ലെങ്കിൽ ബാങ്ക് വഴി തരാം
                  അല്ലെങ്കിൽ കടം വയ്ക്കുമായിരിക്കും . പൈസ തന്നാലും ബാങ്കിൽ
                  തന്നാലും അത് നമ്മൾ Debit Ledger ഭാഗത്തു രേഖപ്പെടുത്തണം .ഇനി
                  കടം ആണ് വൈകുന്നതെങ്കിൽ ആരാണോ അല്ലെങ്കിൽ ഏതു സ്ഥാപനമാണോ കടം
                  വയ്ക്കുന്നത് അവരെ Sundry Debtor കീഴിൽ വയ്ക്കുകയും Debit Ledger
                  ഭാഗത്തു രേഖപ്പെടുത്തുകയും വേണം .
                </p>
                <p className="text-sm mb-4 leading-relaxed tracking-wide">
                  <span className="font-semibold">Credit Ledger:</span>
                   Credit Ledger കൊണ്ട് ഉദ്ദേശിക്കുന്നത് നമ്മൾ നൽകുന്ന സേവനം
                  കമ്പനിയിൽ ഒരു വരുമാനമായിട്ടാണ് വരുന്നതെങ്കിലും കമ്പനിക്കു
                  അതൊരു ബാദ്യതയാണ് . അത് കൊണ്ട് അതിനെ Credit Ledger ഭാഗത്തു
                  വയ്ക്കണം . ഉദാഹരണത്തിന് നമ്മൾ വാടകയ്ക്കു കൊടുക്കുന്ന വാഹനം ആണ്
                  നമ്മുടെ വരുമാനം അത് കൊണ്ട് അതിനെ Credit Ledger ഈ ഭാഗത്തു Sales
                  Accounts കീഴിൽ വയ്ക്കണം .
                </p>
              </div>
            </div>
          </div>
        )}
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

export default SalesVoucher;

// <div className="mt-10">
//   {purchaseData.items.map((item, index) => (
//     <div
//       key={item.id}
//       className="border-b border-gray-200 dark:border-gray-700 mb-4 p-4"
//     >
//       {/* Row 1: Stock Item, Stock Group, HSN Code */}
//       <div className="grid grid-cols-3 gap-4">
//         {/* Stock Item Dropdown */}
//         <div>
//           <label className="font-bold mb-2">Stock Items</label>
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchTerms[index] || ""}
//               onClick={() =>
//                 setIsDropdownOpen((prev) => ({
//                   ...prev,
//                   [index]: !prev[index],
//                 }))
//               }
//               onChange={(e) =>
//                 setSearchTerms((prev) => ({
//                   ...prev,
//                   [index]: e.target.value,
//                 }))
//               }
//               className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:text-white"
//             />
//             {isDropdownOpen[index] && (
//               <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md w-full max-h-40 overflow-auto dark:bg-gray-800 dark:text-white">
//                 {filteredStockData(searchTerms[index] || "").length > 0 ? (
//                   filteredStockData(searchTerms[index] || []).map((option) => (
//                     <li
//                       key={option._id}
//                       onClick={() => handleStockSelect(index, option)}
//                       className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
//                     >
//                       {option.stockName}
//                     </li>
//                   ))
//                 ) : (
//                   <li className="px-4 py-2 text-gray-500">No data</li>
//                 )}
//               </ul>
//             )}
//           </div>
//         </div>

//         {/* Stock Group */}
//         <div>
//           <label className="font-bold mb-2">Stock Group</label>
//           <input
//             type="text"
//             value={item.stockGroup}
//             onChange={(e) =>
//               handleItemChange(index, "stockGroup", e.target.value)
//             }
//             className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//           />
//         </div>

//         {/* HSN Code */}
//         <div>
//           <label className="font-bold mb-2">HSN Code</label>
//           <input
//             type="text"
//             value={item.hsnCode}
//             onChange={(e) =>
//               handleItemChange(index, "hsnCode", e.target.value)
//             }
//             className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//           />
//         </div>
//       </div>

//       {/* Row 2: Rate, Quantity, Tax Rate */}
//       <div className="grid grid-cols-3 gap-4 mt-4">
//         <div>
//           <label className="font-bold mb-2">Rate</label>
//           <input
//             type="number"
//             value={item.rate}
//             onChange={(e) => handleItemChange(index, "rate", e.target.value)}
//             className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//           />
//         </div>

//         <div>
//           <label className="font-bold mb-2">Quantity</label>
//           <input
//             type="number"
//             value={item.quantity}
//             onChange={(e) =>
//               handleItemChange(index, "quantity", e.target.value)
//             }
//             className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//           />
//         </div>

//         <div>
//           <label className="font-bold mb-2">Tax Rate (%)</label>
//           <input
//             type="number"
//             value={item.taxRate}
//             onChange={(e) =>
//               handleItemChange(index, "taxRate", e.target.value)
//             }
//             className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//           />
//         </div>
//       </div>

//       {/* Row 3: Tax Amount, Amount, Actions */}
//       <div className="grid grid-cols-3 gap-4 mt-4">
//         <div>
//           <label className="font-bold mb-2">Tax Amount</label>
//           <input
//             type="number"
//             value={item.taxAmount || (item.taxRate * item.amount) / 100}
//             readOnly
//             className="w-full px-2 py-1 border rounded bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
//           />
//         </div>

//         <div>
//           <label className="font-bold mb-2">Amount</label>
//           <input
//             type="number"
//             value={item.amount}
//             readOnly
//             className="w-full px-2 py-1 border rounded bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
//           />
//         </div>

//         <div className="flex justify-end space-x-2">
//           <button
//             onClick={openModali}
//             className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
//           >
//             <FaPlus className="mr-2" />
//             Stock Group
//           </button>

//           {isModalOpeni && (
//             <CreateStockModal
//               onClose={closeModali}
//               createStockGroup={handleStockCreation}
//             />
//           )}

//           <button
//             onClick={addItem}
//             className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800"
//           >
//             <FaPlus className="mr-2" />
//             Add Item
//           </button>

//           <button
//             onClick={() => deleteItem(index)}
//             className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 dark:bg-red-400 dark:hover:bg-red-600"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   ))}
// </div>
