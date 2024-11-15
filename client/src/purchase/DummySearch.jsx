import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaBuilding, FaBook } from "react-icons/fa";
import {
  useGetLedgerQuery,
  useCreateLedgerMutation,
} from "../store/api/LedgerApi";
import {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
} from "../store/api/CompanyApi";
import { useCheckVoucherNumbersQuery } from "../store/api/PurchaseApi";
import { useCreateStockGroupMutation } from "../store/api/StockGroupApi";
import { useGetStockCategoriesQuery } from "../store/api/StockCategoryApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateCompanyModal from "../vouchers/dummy2/CompanyCreateModal";
import {
  useCreatePurchaseMutation,
  useCheckVoucherNumberQuery,
} from "../store/api/PurchaseApi";
import { useCreateStockItemMutation } from "../store/api/StockItemsApi";
import { useGetPaymentsQuery } from "../store/api/PaymentApi";
import CreateStockModal from "../vouchers/dummy2/CreateStock";
import Ledger from "../vouchers/dummy2/Ledger";
const PurchaseVoucher = () => {
  const { data: ledgerData = [], refetch } = useGetLedgerQuery();
  console.log("data", ledgerData);
  const { data: stockData = [], refetch: stockrefetch } =
    useGetStockCategoriesQuery();
  const [createLedger] = useCreateLedgerMutation(); // Hook for creating new ledger
  const [localLedgerData, setLocalLedgerData] = useState([]); // Local ledger state for dropdown
  const [createStockGroup] = useCreateStockGroupMutation();
  const [purchaseData, setPurchaseData] = useState({
    voucherType: "Purchase Voucher",
    voucherNumber: "",
    transactionDate: "",
    creditPeriod: "",
    creditAmount: "",
    creditDueDate: "",
    purposeOfPayment: "",
    thisPurchase: "New bill", // Initial value matching dropdown
    status: "Unsettled",
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
        stockName: "",
        description: "",
        quantity: "",
        price: "",
        amount: 0,
        unit: "",
        hsnCode: "",
        taxRate: "",
        taxAmount: 0,
        stockGroup: "",
        stockGroupName: "",
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
  const [createCompany, { isLoading }] = useCreateCompanyMutation();
  console.log("purchaseDatasdetails", purchaseData);
  const dropdownRefs = {
    debit: useRef(null),
    credit: useRef(null),
    tax: useRef(null),
    stock: useRef(null),
    purchaseBy: useRef(null),
    purchaseTo: useRef(null),
  };
  //debit ledger search field
  const [searchTermDebit, setSearchTermDebit] = useState("");
  const [searchTermCredit, setSearchTermCredit] = useState("");

  const [purchaseToName, setPurchaseToName] = useState("");
  const [purchaseByName, setPurchaseByName] = useState("");
  const [searchTermStock, setSearchTermStock] = useState(""); // Search term state

  const [selectedStock, setSelectedStock] = useState({ name: "", id: "" }); // Selected stock state

  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    debit: false,
    credit: false,
    tax: false,
    stock: null,
    purchaseBy: false,
    purchaseTo: false,
  });

  // Logic to handle validation
  //logic for

  const { data: voucherCheck } = useCheckVoucherNumberQuery();
  console.log("voucherCheck ", voucherCheck);
  const [selectedVoucherIds, setSelectedVoucherIds] = useState("New bill");
  console.log("selectedVoucherIds", selectedVoucherIds);
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

  // Filter stock data based on search term
  useEffect(() => {
    setPurchaseData((prevData) => ({
      ...prevData,
      thisPurchase: selectedVoucherIds, // Update with selected voucher option
    }));
  }, [selectedVoucherIds]);

  // Update purchaseData when payment status is selected
  useEffect(() => {
    setPurchaseData((prevData) => ({
      ...prevData,
      status: selectedPayments, // Update with selected payment status
    }));
  }, [selectedPayments]);

  // Handle selection of a stock item

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

  const [createPurchase, { isSuccess, isError, error }] =
    useCreatePurchaseMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);
  const [createStockItem] = useCreateStockItemMutation();
  const handleSaveAndSubmit = async (e) => {
    e.preventDefault();
    console.log("click me");

    let allItemsCreatedSuccessfully = true; // Flag to track stock item creation success

    // Access items from purchaseData
    const { items } = purchaseData;
    console.log("click me", items);

    // Step 1: Save each item
    for (const item of items) {
      try {
        console.log("Creating stock item:", item); // Log each item being created
        await createStockItem({
          ...item,
          amount: item.amount || 0,
          taxAmount: item.taxAmount || 0,
          stockGroupName: item.stockGroupName || "",
        }).unwrap();
        console.log("Stock item created successfully");
      } catch (error) {
        console.error("Failed to create stock item:", error);
        toast.error("An error occurred while creating stock items.", {
          autoClose: 3000,
        });
        allItemsCreatedSuccessfully = false; // Mark as failed
        break; // Exit the loop if any item creation fails
      }
    }

    // Step 2: Submit the purchase data only if all items were created successfully
    if (allItemsCreatedSuccessfully) {
      try {
        console.log("Submitting purchase data:", purchaseData); // Log purchase data
        await createPurchase(purchaseData).unwrap();
        toast.success("Purchase created successfully!", {
          autoClose: 3000,
        });

        // Reset the form after successful purchase
        resetForm();
      } catch (purchaseError) {
        console.error("Failed to create purchase:", purchaseError);
        toast.error("An error occurred while creating the purchase.", {
          autoClose: 3000,
        });
      }
    } else {
      // Reset the form only if item creation fails
      console.log("Not resetting form due to item creation failure.");
    }
  };

  // Function to reset the purchase form
  const resetForm = () => {
    setPurchaseData({
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
          stockName: "",
          description: "",
          quantity: "",
          price: "",
          amount: 0,
          unit: "",
          hsnCode: "",
          taxRate: "",
          taxAmount: 0,
          stockGroup: "",
          stockGroupName: "",
          subtotal: 0,
          total: 0,
        },
      ],
      debitLedgers: [{ ledgerId: "", ledgerName: "Select Ledger", amount: "" }],
      creditLedgers: [
        { ledgerId: "", ledgerName: "Select Ledger", amount: "" },
      ],
      taxId: "",
      taxRate: 0,
      taxName: "",
      subTotal: 0,
      taxAmount: 0,
      total: 0,
    });

    // Reset dropdown search terms and states
    setSearchTermDebit("");
    setSearchTermCredit("");
    setTaxDropdownState({
      searchTerm: "",
      isDropdownOpen: false,
    });
    setPurchaseToName("");
    setPurchaseByName("");
    setSearchTermPurchasedTo("");
    setSearchTermPurchasedBy("");
    setIsDropdownOpen({ purchasedTo: false, purchasedBy: false });
    setSearchTermStock("");
    setIsDropdownOpen({ stock: false });
  };

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
  useEffect(() => {
    stockrefetch();
  }, []);
  const handleStockCreation = async (newStockGroupData) => {
    try {
      await createStockGroup(newStockGroupData).unwrap();
      toast.success("Stock group created successfully!");
      closeModal(); // Close the modal after successful creation
      stockrefetch();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };
  useEffect(() => {
    let shouldRefetch = false;
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
        shouldRefetch = true; // Set flag to refetch if necessary
      }
      if (shouldRefetch) {
        refetch(); // Trigger refetch if any dropdown is closed
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

  const { data: purchaseVouchers = [] } = useGetPaymentsQuery();
  const [selectedVoucherId, setSelectedVoucherId] = useState("");
  console.log("date", purchaseVouchers);
  useEffect(() => {
    if (selectedVoucherId) {
      const selectedVoucher = purchaseVouchers.find(
        (voucher) => voucher._id === selectedVoucherId
      );

      if (selectedVoucher) {
        const { _id, __v, ...filteredVoucher } = selectedVoucher;

        setPurchaseData((prevData) => ({
          ...filteredVoucher,
          voucherType: "Purchase Voucher", // Automatically set voucherType to "Payment Voucher"
          creditDueDate: new Date(filteredVoucher.creditDueDate)
            .toISOString()
            .split("T")[0],
          transactionDate: new Date(filteredVoucher.transactionDate)
            .toISOString()
            .split("T")[0],
          selectedOption: prevData.selectedOption, // Preserve the selected option
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
    if (name === "rate" || name === "quantity") {
      updatedItems[index].amount =
        updatedItems[index].rate * updatedItems[index].quantity;
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
          description: "",
          quantity: "",
          price: "",
          amount: 0,
          unit: "",
          hsnCode: "",
          taxRate: "",
          taxAmount: 0,
          stockGroup: "",
          stockGroupName: "",
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
    console.log("type", type);
    console.log("option", option);

    if (type === "credit") {
      setSearchTermCredit(option.name);
      // Handle credit ledger updates
      setPurchaseData((prevData) => {
        const updatedCreditLedgers = [...prevData.creditLedgers];

        // Update or add the ledger based on its index
        const indexToUpdate = 0; // Update the ledger at index 0

        if (indexToUpdate < updatedCreditLedgers.length) {
          // If the index exists, update it
          updatedCreditLedgers[indexToUpdate] = {
            ledgerId: option._id,
            ledgerName: option.name,
            amount: prevData.total || 0, // Default to 0 if subTotal is not available
          };
        } else {
          // If the index does not exist, add it
          updatedCreditLedgers.push({
            ledgerId: option._id,
            ledgerName: option.name,
            amount: prevData.total || 0, // Default to 0 if subTotal is not available
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
      setSearchTermDebit(option.name);
      // Existing debit ledger logic remains unchanged
      setPurchaseData((prevData) => {
        const updatedDebitLedgers = [...prevData.debitLedgers];

        // Update or add the ledger based on its index
        const indexToUpdate = 1; // Index 1 where you want to update or add the ledger

        if (indexToUpdate < updatedDebitLedgers.length) {
          // If the index exists, update it
          updatedDebitLedgers[indexToUpdate] = {
            ledgerId: option._id,
            ledgerName: option.name,
            amount: prevData.total || 0, // Default to 0 if subTotal is not available
          };
        } else {
          // If the index does not exist, add it
          updatedDebitLedgers.push({
            ledgerId: option._id,
            ledgerName: option.name,
            amount: prevData.total || 0, // Default to 0 if subTotal is not available
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

  // const handleStockSelect = (index, option) => {
  //   const updatedItems = [...purchaseData.items];
  //   updatedItems[index].stockItem = option._id; // Store the stock ID
  //   updatedItems[index].stockName = option.stockItem; // Display the stock name
  //   setPurchaseData((prevState) => ({
  //     ...prevState,
  //     items: updatedItems,
  //   }));
  //   setIsDropdownOpen({ stock: false });
  // };

  const calculateTotals = () => {
    // Calculate the subTotal by summing up the amounts for all items
    const subTotal = purchaseData.items.reduce(
      (acc, item) => acc + item.amount,
      0
    );

    // Calculate the total taxAmount by summing up the taxAmount for all items
    const totalTaxAmount = purchaseData.items.reduce(
      (acc, item) => acc + parseFloat(item.taxAmount || 0), // Ensure taxAmount is a number
      0
    );

    // Calculate the total by adding subTotal and totalTaxAmount
    const total = subTotal + totalTaxAmount;

    setPurchaseData((prevData) => ({
      ...prevData,
      creditAmount: total, // Update creditAmount with the total
      subTotal: subTotal, // Update subTotal
      taxAmount: totalTaxAmount, // Update taxAmount with the summed taxAmount
      total: total, // Update total

      // Update the creditLedgers
      creditLedgers: prevData.creditLedgers.map((ledger, index) => {
        if (index === 0) {
          return {
            ...ledger,
            amount: total, // First credit ledger holds the total amount
          };
        }
        return ledger;
      }),

      // Update the debitLedgers
      debitLedgers: prevData.debitLedgers.map((ledger, index) => {
        if (index === 0) {
          return {
            ...ledger,
            amount: totalTaxAmount, // First debit ledger holds the total tax amount
          };
        } else if (index === 1) {
          return {
            ...ledger,
            amount: total, // Second debit ledger holds the subtotal
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

  console.log("taxDropdownState", taxDropdownState);
  const taxDropdownRef = useRef(null);

  // Handler for selecting a tax option
  const handleTaxSelect = (option) => {
    console.log("Selected option:", option);

    setTaxDropdownState((prevState) => ({
      ...prevState,
      searchTerm: option.name, // Update the search term or selected value
      isDropdownOpen: false, // Close the dropdown after selection
    }));

    setPurchaseData((prevState) => {
      // Calculate or retrieve the taxAmount
      const taxAmount = prevState.taxAmount; // Or calculate it if needed

      // Clone the existing debitLedgers array
      const updatedDebitLedgers = [...prevState.debitLedgers];

      // Update the first index (index 0) with the selected tax details
      updatedDebitLedgers[0] = {
        ...updatedDebitLedgers[0],
        ledgerId: option._id,
        ledgerName: option.name,
        amount: taxAmount, // Set the calculated or retrieved taxAmount
      };

      return {
        ...prevState,
        debitLedgers: updatedDebitLedgers, // Set updated debitLedgers
      };
    });
  };
  console.log(ledgerData);

  // Filter tax data based on search term
  const filteredTaxData = (searchTerm) =>
    ledgerData.filter(
      (item) =>
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const { data: companyData = [], refetch: refetching } =
    useGetCompaniesQuery();

  console.log("pu", purchaseData);
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
  useEffect(() => {
    if (purchaseData.transactionDate && purchaseData.creditPeriod) {
      console.log("creditDate", purchaseData.creditPeriod);
      const transactionDate = new Date(purchaseData.transactionDate);
      console.log("creditDate", transactionDate);
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

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefs.stock.current &&
        !dropdownRefs.stock.current.contains(event.target)
      ) {
        setIsDropdownOpen((prevState) => ({ ...prevState, stock: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // Handle input change and allow re-selection
  const handleInputChange = (e) => {
    setSearchTermStock(e.target.value); // Update search term
    setSelectedStock({ name: "", id: "" }); // Reset selected stock to allow re-selection
    setIsDropdownOpen((prevState) => ({ ...prevState, stock: true })); // Open dropdown for new search
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
        stockGroupName: stock.name,
        stockGroup: stock._id,
      };
      return { ...prevData, items: updatedItems };
    });

    // Close the dropdown for the selected index
    setIsDropdownOpen((prev) => ({
      ...prev,
      [index]: false,
    }));
  };
  const filteredStockData = (searchTerm) => {
    // Ensure searchTerm is a string before proceeding
    const term = typeof searchTerm === "string" ? searchTerm : "";
    return stockData.filter((item) =>
      item.name?.toLowerCase().includes(term.toLowerCase())
    );
  };

  // const filteredStockData = (searchTerm) => {
  //   if (typeof searchTerm !== "string") {
  //     searchTerm = "";
  //   }

  //   return stockData.filter((item) => {
  //     const stockCategoryName = item.stockCategory?.name?.toLowerCase() || "";
  //     const stockGroup = item.stockGroup?.toLowerCase() || "";

  //     // Return all items if searchTerm is empty
  //     if (!searchTerm) {
  //       return true; // Include all items
  //     }

  //     return (
  //       stockCategoryName.includes(searchTerm.toLowerCase()) ||
  //       stockGroup.includes(searchTerm.toLowerCase())
  //     );
  //   });
  // };
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <div className="flex items-center gap-4 ">
          V/N
          <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
            {purchaseData.voucherNumber}
          </p>
        </div>
      </div>
      {/* form field  */}
      <form className="max-w-4xl mx-auto p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-10 ">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {/* Row 1 */}

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
              Which Type of Purchase
            </label>
            <select
              value={selectedVoucherIds}
              onChange={(e) => setSelectedVoucherIds(e.target.value)}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="New bill">New Bill</option>
              <option value="Advance">Advance</option>
              <option value="Against bills">Against Bills</option>
              <option value="New bill">New Bill</option>
              <option value="Own bill">Own Bill</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              creditPeriod
            </label>
            <input
              type="number"
              name="creditPeriod"
              value={purchaseData.creditPeriod}
              onChange={handleChange}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Row 2 */}

          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300">
              Status of Payment
            </label>
            <select
              value={selectedPayments}
              onChange={(e) => setSelectedPayments(e.target.value)}
              className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Unsettled">Unsettled</option>
              <option value="Partially Settled">Partially Settled</option>
              <option value="Settled">Settled</option>
            </select>
          </div>

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
              purchase number
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
                  " StokName",
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
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.stockName}
                      onChange={(e) =>
                        handleItemChange(index, "stockName", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
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
                        className="w-full px-2 py-1 border rounded"
                      />
                      {isDropdownOpen[index] && (
                        <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md w-full max-h-40 overflow-auto">
                          {filteredStockData(searchTerms[index] || "").length >
                          0 ? (
                            filteredStockData(searchTerms[index] || []).map(
                              (option) => (
                                <li
                                  key={option._id}
                                  onClick={() =>
                                    handleStockSelect(index, option)
                                  }
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                >
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
            {/* Stock Name Input */}
            <div className="font-bold mb-2">
              Stock Name
              <input
                type="text"
                value={item.stockName}
                onChange={(e) =>
                  handleItemChange(index, "stockName", e.target.value)
                }
                className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>

            {/* Stock Items Dropdown */}
            <div className="font-bold mb-2 mt-4">Stock Items</div>
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
                className="w-full px-2 py-1 border rounded"
              />
              {isDropdownOpen[index] && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md w-full max-h-40 overflow-auto">
                  {filteredStockData(searchTerms[index] || "").length > 0 ? (
                    filteredStockData(searchTerms[index] || []).map(
                      (option) => (
                        <li
                          key={option._id}
                          onClick={() => handleStockSelect(index, option)}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        >
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
            onComapnyCreate={handleCompanyCreation}
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            {taxDropdownState.isDropdownOpen && (
              <div
                ref={taxDropdownRef}
                className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full dark:bg-gray-800 dark:border-gray-600"
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

          {/* Debit Ledger */}
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
              value={searchTermDebit}
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
                  {filteredLedgerData(searchTermDebit).length > 0 ? (
                    filteredLedgerData(searchTermDebit).map((option) => (
                      <li
                        key={option._id}
                        onClick={() => {
                          handleLedgerSelect("debit", option);
                          setIsDropdownOpen((prevState) => ({
                            ...prevState,
                            debit: false, // Close dropdown after selection
                          }));
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
              value={searchTermCredit}
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
                  {filteredLedgerData(searchTermCredit).length > 0 ? (
                    filteredLedgerData(searchTermCredit).map((option) => (
                      <li
                        key={option._id}
                        onClick={() => {
                          handleLedgerSelect("credit", option);
                          setIsDropdownOpen((prevState) => ({
                            ...prevState,
                            credit: false, // Close dropdown after selection
                          }));
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
    </div>
  );
};

export default PurchaseVoucher;
