import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaBuilding, FaBook } from "react-icons/fa";
import {
  useGetLedgerQuery,
  useCreateLedgerMutation,
} from "../store/api/LedgerApi";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
} from "../store/api/CompanyApi";
import {
  useGetStockGroupsQuery,
  useCreateStockGroupMutation,
} from "../store/api/StockGroupApi";

import { useGetPurchasesQuery } from "../store/api/PurchaseApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateCompanyModal from "../vouchers/dummy2/CompanyCreateModal";
import { useCheckVoucherNumbersQuery } from "../store/api/SalesApi";
import {
  useGetCreditNoteByIdQuery,
  useUpdateCreditNoteMutation,
  useDeleteCreditNoteMutation,
} from "../store/api/CreditNoteApi";
import { useUpdateSalesVoucherMutation } from "../store/api/SalesApi";
import CreateStockModal from "../vouchers/dummy2/CreateStock";
import Ledger from "../vouchers/dummy2/Ledger";
const CreditNotePreviews = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { data: ledgerData = [], refetch } = useGetLedgerQuery();

  const { data: stockData = [], refetch: stockrefetch } =
    useGetStockGroupsQuery();
  const [createLedger] = useCreateLedgerMutation(); // Hook for creating new ledger
  const [localLedgerData, setLocalLedgerData] = useState([]); // Local ledger state for dropdown
  const [createStockGroup] = useCreateStockGroupMutation();
  const [purchaseData, setPurchaseData] = useState({
    voucherType: "Receipt Voucher",
    voucherNumber: "",
    paymentNumber: "",
    transactionDate: "",
    creditPeriod: "",
    creditAmount: "",
    creditDueDate: "",
    VoucherNumberTrue: "",
    purposeOfPayment: "",
    thisPurchase: "New bill", // Initial value matching dropdown
    status: "Unsettled",
    voucherNumberTrue: "",
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
  console.log("creditnote........preview", purchaseData);
  const [searchTermPurchasedBy, setSearchTermPurchasedBy] = useState("");
  const [searchTermPurchasedTo, setSearchTermPurchasedTo] = useState("");
  console.log("searchTermPurchasedBy", searchTermPurchasedBy);
  console.log("earchTermPurchasedTo", searchTermPurchasedTo);
  const [createCompany, { isLoading }] = useCreateCompanyMutation();

  const {
    data: paymentVoucher, // Alias `data` as `paymentVoucher`
    isLoading: voucherLoading, // Alias `isLoading` as `voucherLoading`
    isError: voucherError, // Alias `isError` as `voucherError`
    refetch: refetchVoucherData, // Alias `refetch` as `refetchVoucherData`
  } = useGetCreditNoteByIdQuery(transactionId || "", {
    skip: !transactionId, // Skip the query if `transactionId` is falsy
  });
  useEffect(() => {
    refetchVoucherData();
  }, [refetchVoucherData]);
  const dropdownRefs = {
    debit: useRef(null),
    credit: useRef(null),
    tax: useRef(null),
    stock: useRef(null),
    purchaseBy: useRef(null),
    purchaseTo: useRef(null),
  };
  useEffect(() => {
    stockrefetch();
  }, []);
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
  // Triggering the query to check voucher number based on purchaseData.thisPurchase (e.g., "Advance" value)
  const { data } = useCheckVoucherNumbersQuery(purchaseData.thisPurchase, {
    skip: !purchaseData.thisPurchase, // Skip query if no thisPurchase value is provided
  });

  // ivide against logic
  const [selectedVoucherIds, setSelectedVoucherIds] = useState("New bill");

  const [selectedPayments, setSelectedPayments] = useState("Unsettled");
  // Handle voucher number check
  useEffect(() => {
    if (data && data.exists) {
      alert("Voucher number already exists. Please choose a different number.");
      // Optionally clear the voucher number field to prompt the user to enter a new one
      setPurchaseData((prevData) => ({
        ...prevData,
        voucherNumber: "", // Clear the voucher number
      }));
    }
  }, [data]);
  // Update purchaseData when a voucher is selected
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

  // Filter stock data based on search term

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

  const [updatePayment] = useUpdateCreditNoteMutation();
  const [deletePayment] = useDeleteCreditNoteMutation();
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // Create the payload object for updated purchase data
      const payload = {
        transactionId,
        updatedPurchase: purchaseData,
      };

      // Step 1: Submit the updated purchase data with ledgers
      const updateResult = await updatePayment(payload).unwrap();

      if (updateResult) {
        toast.success("Payment updated successfully!", {
          autoClose: 3000, // Show success toast for 3 seconds
        });
        navigate("/reports/creditNotereports");
        // Reset form data and other related states
        resetFormData();
      } else {
        throw new Error("Failed to update payment");
      }
    } catch (error) {
      console.error("Failed to update payment:", error);

      // Show error toast with specific message if available
      const errorMessage =
        error?.data?.message ||
        error.message ||
        "An error occurred while updating the payment.";

      toast.error(errorMessage, {
        autoClose: 3000, // Show error toast for 3 seconds
      });
    }
  };
  const handleDeletePayment = async (e) => {
    e.preventDefault();

    try {
      // Log the transaction ID to verify its type and value
      console.log("Transaction ID:", debitNote.transactionId);

      // Create the payload object for deleting payment data

      // Submit the delete request
      const deleteResult = await deletePayment(transactionId).unwrap(); // Use the ID directly

      if (deleteResult) {
        toast.success("Payment deleted successfully!", {
          autoClose: 3000, // Show success toast for 3 seconds
        });
        navigate("/reports/creditNotereports");
        // Perform any necessary actions after successful deletion
      }
    } catch (error) {
      console.error("Failed to delete payment:", error);

      // Show error toast with specific message if available
      const errorMessage =
        error?.data?.message ||
        error.message ||
        "An error occurred while deleting the payment.";

      toast.error(errorMessage, {
        autoClose: 3000, // Show error toast for 3 seconds
      });
    }
  };
  // Helper function to reset form data and related states
  const resetFormData = () => {
    // Reset purchase data
    setPurchaseData({
      voucherNumber: "",
      VoucherNumberTrue: "",
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
      purchasedBy: "", // Reset to empty
      purchasedTo: "", // Reset to empty
      description: "",
      items: [
        {
          stockGroup: "",
          description: "",
          unit: "",
          hsnCode: "",
          rate: 0,
          taxRate: "",
          stockGroupId: "",
          taxAmount: "",
          quantity: 0,
          amount: 0,
          stockName: "",
          stockItem: "",
        },
      ],
      debitLedgers: [{ ledgerId: "", ledgerName: "Select Ledger", amount: "" }], // Reset debit ledgers
      creditLedgers: [
        { ledgerId: "", ledgerName: "Select Ledger", amount: "" },
      ], // Reset credit ledgers
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
      searchTerm: "",
      isDropdownOpen: false, // Close the dropdown
    });

    // Reset purchaseToName and purchaseByName
    setPurchaseToName(""); // Reset input value
    setPurchaseByName(""); // Reset input value

    // Reset search terms and dropdown states
    setSearchTermPurchasedTo("");
    setSearchTermPurchasedBy("");
    setIsDropdownOpen({ purchasedTo: false, purchasedBy: false });
    setSearchTermStock("");
    setIsDropdownOpen({ stock: false });
  };
  console.log("setPurchaseByName", setPurchaseByName);
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

  const { data: purchaseVouchers = [] } = useCheckVoucherNumbersQuery();
  const [selectedVoucherId, setSelectedVoucherId] = useState("");

  const [voucherkuttan, setVoucherKuttan] = useState("");

  console.log("selected", data);

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
  const [debitNote, setDebitNote] = useState({
    debitLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    transactionId: "",
  });
  console.log("debitnotin receipt voucher", debitNote);
  // useEffect(() => {
  //   if (selectedVoucherId) {
  //     const selectedVoucher = data.find(
  //       (voucher) => voucher._id === selectedVoucherId
  //     );

  //     if (selectedVoucher) {
  //       const { _id, __v, ...filteredVoucher } = selectedVoucher; // Extract transactionId

  //       // Update debitNote state including transactionId
  //       setDebitNote((prevData) => ({
  //         ...prevData,
  //         ...filteredVoucher,
  //         transactionId: _id || "haikkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", // Set the transactionId from selectedVoucher
  //       }));

  //       // Update purchaseData state
  //       setPurchaseData((prevData) => ({
  //         ...prevData, // Preserve the existing state data
  //         ...filteredVoucher, // Merge the voucher data
  //         voucherType: "Payment Voucher", // Automatically set voucherType to "Debit Note"
  //         voucherNumber: voucher1,
  //         creditDueDate: new Date(filteredVoucher.creditDueDate)
  //           .toISOString()
  //           .split("T")[0], // Format creditDueDate to "YYYY-MM-DD"
  //         transactionDate: new Date(filteredVoucher.transactionDate)
  //           .toISOString()
  //           .split("T")[0], // Format transactionDate to "YYYY-MM-DD"
  //         selectedOption: prevData.selectedOption, // Preserve the selected option
  //         debitLedgers: [], // Reset debit ledgers if needed
  //         creditLedgers: [], // Reset credit ledgers if needed
  //       }));

  //       // Populate company names for display purposes
  //       setPurchaseByName(filteredVoucher.purchasedBy.companyName || "");
  //       setPurchaseToName(filteredVoucher.purchasedTo.companyName || "");
  //     }
  //   }
  // }, [selectedVoucherId, purchaseVouchers]);

  useEffect(() => {
    if (paymentVoucher) {
      // Extract stockGroupNames from items (if items exist)
      const stockGroupNames = paymentVoucher.items
        ? paymentVoucher.items
            .map((item) => item.stockGroupName)
            .filter(Boolean)
        : [];

      // Convert stockGroupNames into an object with index-based keys
      const stockGroupNamesObject = stockGroupNames.reduce(
        (acc, name, index) => {
          acc[index] = name; // Store each name with its index as the key
          return acc;
        },
        {}
      );

      // Filter out unnecessary fields and extract IDs
      const {
        _id,
        __v,
        purchasedBy,
        purchasedTo,
        debitLedgers,
        creditLedgers,
        voucherNumber,
        ...filteredVoucher
      } = paymentVoucher;
      setDebitNote((prevData) => ({
        ...prevData,
        ...filteredVoucher,
        debitLedgers: debitLedgers || [
          { ledgerId: "", ledgerName: "", amount: "" },
        ], // Use the extracted debitLedgers
        creditLedgers: creditLedgers || [
          { ledgerId: "", ledgerName: "", amount: "" },
        ], // Use the extracted creditLedgers
        transactionId: _id || "", // Set the transactionId from selectedVoucher
      }));
      // Set the purchase data, including IDs for purchasedBy and purchasedTo
      setPurchaseData((prevData) => ({
        ...prevData, // Preserve previous data
        ...filteredVoucher,
        voucherNumber: voucherNumber, // Ensure voucher1 is defined or provide a fallback
        voucherType: "Purchase Voucher",
        creditDueDate: new Date(filteredVoucher.creditDueDate)
          .toISOString()
          .split("T")[0],
        transactionDate: new Date(filteredVoucher.transactionDate)
          .toISOString()
          .split("T")[0],
        selectedOption: prevData.selectedOption, // Preserve the selected option
        purchasedBy: purchasedBy._id,
        purchasedTo: purchasedTo._id,
        debitLedgers: debitLedgers || [
          { ledgerId: "", ledgerName: "", amount: "" },
        ], // Use the extracted debitLedgers
        creditLedgers: creditLedgers || [
          { ledgerId: "", ledgerName: "", amount: "" },
        ], // Use the extracted creditLedgers
      }));

      // Update searchTerms with the transformed stockGroupNames
      setSearchTerms((prev) => ({
        ...prev,
        ...stockGroupNamesObject, // Spread the transformed object into the state
      }));

      // Set company names for display purposes
      setPurchaseByName(purchasedBy?.companyName || "");
      setPurchaseToName(purchasedTo?.companyName || "");
      setSearchTermPurchasedBy(purchasedBy?.companyName || ""); // Set for search term
      setSearchTermPurchasedTo(purchasedTo?.companyName || ""); // Set for search term
      setVoucherKuttan(filteredVoucher.voucherNumber || ""); // Set voucher number
    }
  }, [selectedVoucherId, paymentVoucher]);
  useEffect(() => {
    if (paymentVoucher) {
      // Extract stockGroupNames from items (if items exist)
      const stockGroupNames = paymentVoucher.items
        ? paymentVoucher.items
            .map((item) => item.stockGroupName)
            .filter(Boolean)
        : [];

      // Convert stockGroupNames into an object with index-based keys
      const stockGroupNamesObject = stockGroupNames.reduce(
        (acc, name, index) => {
          acc[index] = name; // Store each name with its index as the key
          return acc;
        },
        {}
      );

      // Filter out unnecessary fields and extract IDs
      const {
        _id,
        __v,
        purchasedBy,
        purchasedTo,
        debitLedgers,
        creditLedgers,
        voucherNumber,
        ...filteredVoucher
      } = paymentVoucher;
      setDebitNote((prevData) => ({
        ...prevData,
        ...filteredVoucher,
        debitLedgers: debitLedgers || [
          { ledgerId: "", ledgerName: "", amount: "" },
        ], // Use the extracted debitLedgers
        creditLedgers: creditLedgers || [
          { ledgerId: "", ledgerName: "", amount: "" },
        ], // Use the extracted creditLedgers
        transactionId: _id || "", // Set the transactionId from selectedVoucher
      }));
      // Set the purchase data, including IDs for purchasedBy and purchasedTo
      setPurchaseData((prevData) => ({
        ...prevData, // Preserve previous data
        ...filteredVoucher,
        voucherNumber: voucherNumber, // Ensure voucher1 is defined or provide a fallback
        voucherType: "Receipt Voucher",
        creditDueDate: new Date(filteredVoucher.creditDueDate)
          .toISOString()
          .split("T")[0],
        transactionDate: new Date(filteredVoucher.transactionDate)
          .toISOString()
          .split("T")[0],
        selectedOption: prevData.selectedOption, // Preserve the selected option
        debitLedgers: debitLedgers || [
          { ledgerId: "", ledgerName: "", amount: "" },
        ], // Use the extracted debitLedgers
        creditLedgers: creditLedgers || [
          { ledgerId: "", ledgerName: "", amount: "" },
        ], // Use the extracted creditLedgers
      }));

      // Update searchTerms with the transformed stockGroupNames
      setSearchTerms((prev) => ({
        ...prev,
        ...stockGroupNamesObject, // Spread the transformed object into the state
      }));

      // Set company names for display purposes
      setPurchaseByName(purchasedBy?.companyName || "");
      setPurchaseToName(purchasedTo?.companyName || "");
      setSearchTermPurchasedBy(purchasedBy?.companyName || ""); // Set for search term
      setSearchTermPurchasedTo(purchasedTo?.companyName || ""); // Set for search term
      setVoucherKuttan(filteredVoucher.voucherNumber || ""); // Set voucher number
    }
  }, [selectedVoucherId, paymentVoucher]);

  const [searchTerms, setSearchTerms] = useState({}); // Keep it as an object or convert to an array if preferred

  const handleStockSelect = (index, stock) => {
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
  const handleLedgerSelect = (type, option) => {
    if (type === "credit") {
      setSearchTermCredit(option.name);
      // Handle credit ledger updates
      setPurchaseData((prevData) => {
        const updatedCreditLedgers = [...prevData.creditLedgers];

        // Update or add the ledger based on its index
        const indexToUpdate = 1; // Update the ledger at index 0

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
        const indexToUpdate = 0; // Index 1 where you want to update or add the ledger

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

      // Clone the existing creditLedgers array
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
        creditLedgers: updatedCreditLedgers, // Set updated creditLedgers
      };
    });
  };

  // Filter tax data based on search term
  const filteredTaxData = (searchTerm) =>
    ledgerData.filter(
      (item) =>
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const { data: companyData = [], refetch: refetching } =
    useGetCompaniesQuery();

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
  // Function to filter stock data based on search term

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

  const filteredData = filteredStockData(searchTermStock); // Filtered data based on search term

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {/* Row 1 */}
        <div className="flex items-center gap-4 ">
          Against voucher :{/* Display voucher number as plain text */}
          <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
            {voucherkuttan}
          </p>
        </div>
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
              Payment Date
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
              <option value="New Bill">New Bill</option>
              <option value="Advance">Advance</option>
              <option value="Against Bills">Against Bills</option>
              <option value="New Bill">New Bill</option>
              <option value="Own Bill">Own Bill</option>
            </select>
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
              Payment number
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

      {/* Tax Ledger dummy */}

      <div className="space-y-4 md:space-y-6 mt-10">
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Tax Ledger */}

          {/* Conditional rendering for Tax and Credit Ledgers */}
          {debitNote.debitLedgers?.length >= 2 && (
            <>
              {/* Tax Ledger */}
              <div className="relative flex-1 min-w-[200px]">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
                  htmlFor="taxLedger"
                >
                  Tax in Purchase
                </label>
                <input
                  type="text"
                  name="taxLedger"
                  id="taxLedger"
                  value={
                    debitNote.debitLedgers[0]?.ledgerName || // Use the 0 index for tax
                    "No tax rate defined" // Dummy text if not defined
                  }
                  className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
                  readOnly
                />
              </div>

              {/* Credit Ledger */}
              <div className="relative flex-1 min-w-[200px]">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
                  htmlFor="creditLedger"
                >
                  Credit in Purchase Ledger
                </label>
                <input
                  type="text"
                  name="creditLedger"
                  id="creditLedger"
                  value={
                    debitNote.debitLedgers[1]?.ledgerName || // Use the 1 index for credit ledger
                    "No credit ledger" // Dummy text if not defined
                  }
                  className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
                  readOnly
                />
              </div>
            </>
          )}

          {/* Debit Ledger */}
          <div className="relative flex-1 min-w-[200px]">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
              htmlFor="creditLedger"
            >
              credit in purchase Ledger
            </label>
            <input
              type="text"
              name="creditLedger"
              id="creditLedger"
              value={
                debitNote.creditLedgers?.[0]?.ledgerName ||
                "Please fill in the Debit Ledger"
              }
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                !debitNote.debitLedgers?.[0]?.ledgerName
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
              readOnly={!!selectedVoucherId} // Set readOnly based on selectedVoucherId
              onClick={() => {
                if (!selectedVoucherId) {
                  // Only toggle dropdown if not read-only
                  setTaxDropdownState((prevState) => ({
                    ...prevState,
                    isDropdownOpen: !prevState.isDropdownOpen,
                  }));
                }
              }}
              onChange={(e) =>
                setTaxDropdownState((prevState) => ({
                  ...prevState,
                  searchTerm: e.target.value,
                }))
              }
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                selectedVoucherId ? "cursor-not-allowed" : "cursor-pointer"
              } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
            />
            {taxDropdownState.isDropdownOpen &&
              !selectedVoucherId && ( // Only show dropdown if not read-only
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
        </div>
      </div>
      {/* Submit Button */}
      <div className="my-10">
        {/* Buttons for updating and deleting */}
        <div className="my-10 flex space-x-4">
          {/* Update Button */}
          <button
            type="button"
            onClick={handleUpdate} // Update logic
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDeletePayment} // Delete logic
            className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditNotePreviews;
