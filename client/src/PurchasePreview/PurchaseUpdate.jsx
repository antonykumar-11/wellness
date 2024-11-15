import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetPurchaseByIdQuery,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} from "../store/api/PurchaseApi";
import { useGetAllStocksQuery } from "../store/api/StockApi";
import { useGetLedgerQuery } from "../store/api/LedgerApi";
import { useGetTaxesQuery } from "../store/api/TaxApi";
import shortid from "shortid"; // Import shortid
import PurchaseTo from "./PurchaseTo";
import PurchaseBy from "./PurchaseBy";
import PurchaseAccount from "./PurchaseAccount";
import { useGetLedgerBalanceQuery } from "../store/api/AllLedgerApi";
import ButtonLedger from "../vouchers/payment/ButtonLedger";
const PurchaseForm = () => {
  const { id } = useParams(); // Get id from URL params
  const navigate = useNavigate();

  const [updatePurchase] = useUpdatePurchaseMutation();
  const [deletePurchase] = useDeletePurchaseMutation();
  const { data: stocks } = useGetAllStocksQuery();
  const { data: taxes } = useGetTaxesQuery();

  const [ledgerBalances, setLedgerBalances] = useState({});
  const [selectedLedger, setSelectedLedger] = useState(null);
  console.log("selectedledger", selectedLedger);

  const { data: ledgerData = [] } = useGetLedgerQuery();
  const [filteredLedgers, setFilteredLedgers] = useState([]);

  useEffect(() => {
    if (ledgerData.length > 0) {
      setFilteredLedgers(ledgerData);
    }
  }, [ledgerData]);

  console.log("filtered", filteredLedgers);
  const [purchaseData, setPurchaseData] = useState({
    voucherNumber: "",
    paymentDate: "",
    amountPaid: 0,

    purposeOfPayment: "",
    authorizedBy: {
      name: "",
      designation: "",
      signature: "",
    },
    departmentCostCenter: "",
    remarks: "",
    purchaseTo: {
      companyName: "",
      companyddress: "",
      gstNumber: "",
      state: "",
      stateCode: "",
      invoiceNumber: "",
      invoiceDate: "",
      deliveryNote: "",
      modeTermsOfPayment: "",
      buyersOrderNumber: "",
      companyEmail: "",
      companyMobile: "",
      companyPanNumber: "",
      panCard: "",
      date: "",
      bankName: "",
      accountNumber: "",
      branch: "",
      registrationType: "",
    },
    purchaseBy: {
      state: "",
      stateCode: "",
      invoiceNumber: "",
      invoiceDate: "",
      voucherNumber: "",
      deliveryNote: "",
      modeTermsOfPayment: "",
      buyersOrderNumber: "",
      companyName: "ALPHA CRANE SERVICE",
      currentDate: new Date().toLocaleDateString(),
      companyAddress:
        "VIZHINJAM SEA PORT , THIRUVANANTHAPURAM , KERALA , INDIA",
      companyEmail: "alphacranesalpha@gmail.com",
      companyMobile: "9995265576",
      companyPanNumber: "HPZPS9891L",
      panCard: "",

      gstNumber: "32HPZPS981L1ZB",
      date: "",
      bankName: "",
      accountNumber: "",
      branch: "",
      ifcecode: "",
      registrationType: "",
    },
    balanceBillByBill: false,
    defaultCreditPeriod: 0,
    checkCreditDays: false,
    panItNo: "",

    gstinUin: "",
    transactionType: "",
    subTotal: 0,
    total: 0,
    taxId: "",
    taxRate: 0,
    taxAmount: 0,
    items: [
      {
        id: shortid.generate(),
        serialNumber: 1,
        description: "",
        price: 0,
        unit: "5678",
        hsnCode: "",
        rate: 0,
        quantity: 0,
        amount: "500",
        stockLedger: "",
        stockName: "",
      },
    ],
    debitLedger: "",

    debitLedgerName: "",
    debitAmount: 0,
    creditLedger: "",

    creditLedgerName: "",
    creditAmount: 0,
    totalInWords: "",
    isCredit: false,
    creditDetails: {
      creditPeriod: 0,
      creditAmount: 0,
      creditDueDate: "",
    },
  });
  const { data: purchase } = useGetPurchaseByIdQuery(id);
  console.log("purchaseserver", purchase);
  useEffect(() => {
    console.log("Purchase data received useEffect:", purchase);
    if (purchase) {
      setPurchaseData((prevData) => ({
        ...prevData,
        items: purchase.items || prevData.items, // Ensure items are updated if available
        purchaseTo: {
          ...prevData.purchaseTo,
          ...purchase.purchaseTo,
        },
        purchaseBy: {
          ...prevData.purchaseBy,
          ...purchase.purchaseBy,
        },
        balanceBillByBill:
          purchase.balanceBillByBill !== undefined
            ? purchase.balanceBillByBill
            : prevData.balanceBillByBill,
        defaultCreditPeriod:
          purchase.defaultCreditPeriod !== undefined
            ? purchase.defaultCreditPeriod
            : prevData.defaultCreditPeriod,
        checkCreditDays:
          purchase.checkCreditDays !== undefined
            ? purchase.checkCreditDays
            : prevData.checkCreditDays,
        panItNo: purchase.panItNo || prevData.panItNo,
        gstinUin: purchase.gstinUin || prevData.gstinUin,
        transactionType: purchase.transactionType || prevData.transactionType,
        subTotal:
          purchase.subTotal !== undefined
            ? purchase.subTotal
            : prevData.subTotal,
        total: purchase.total !== undefined ? purchase.total : prevData.total,
        taxId: purchase.taxId || prevData.taxId,
        taxRate:
          purchase.taxRate !== undefined ? purchase.taxRate : prevData.taxRate,
        taxAmount:
          purchase.taxAmount !== undefined
            ? purchase.taxAmount
            : prevData.taxAmount,
        debitLedger: purchase.debitLedger || prevData.debitLedger,
        debitLedgerName: purchase.debitLedgerName || prevData.debitLedgerName,
        debitAmount:
          purchase.debitAmount !== undefined
            ? purchase.debitAmount
            : prevData.debitAmount,
        creditLedger: purchase.creditLedger || prevData.creditLedger,
        creditLedgerName:
          purchase.creditLedgerName || prevData.creditLedgerName,
        creditAmount:
          purchase.creditAmount !== undefined
            ? purchase.creditAmount
            : prevData.creditAmount,
        totalInWords: purchase.totalInWords || prevData.totalInWords,
        isCredit:
          purchase.isCredit !== undefined
            ? purchase.isCredit
            : prevData.isCredit,
        creditDetails: {
          creditPeriod:
            purchase.creditDetails?.creditPeriod !== undefined
              ? purchase.creditDetails.creditPeriod
              : prevData.creditDetails.creditPeriod,
          creditAmount:
            purchase.creditDetails?.creditAmount !== undefined
              ? purchase.creditDetails.creditAmount
              : prevData.creditDetails.creditAmount,
          creditDueDate:
            purchase.creditDetails?.creditDueDate ||
            prevData.creditDetails.creditDueDate,
        },
      }));
    }
  }, [purchase]);

  // ithu tax rate nammal edit cheyyunnathu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchaseData({
      ...purchaseData,
      [name]: value,
    });
  };
  const handleChangee = (option, itemId) => {
    console.log("licked here", option);
    stockLedgerSelect(option, itemId);
  };
  // ivide hsn code and unit

  const handleInputChange = (itemId, name, value) => {
    console.log("item", itemId, name, value);
    setPurchaseData((prevPurchaseData) => {
      const updatedItems = prevPurchaseData.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [name]: value,
              amount:
                (name === "quantity" ? value : item.quantity) *
                  (name === "rate" ? value : item.rate) || 0,
            }
          : item
      );
      return {
        ...prevPurchaseData,
        items: updatedItems,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ID:", id);
    console.log("Purchase data:", purchaseData);
    try {
      await updatePurchase({ updatedPurchase: purchaseData, id }).unwrap();
      alert("Purchase updated successfully!");
    } catch (error) {
      console.error("Failed to update purchase: ", error);
      alert("Failed to update purchase.");
    }
  };

  // purchaseTo section paranjayachu field editing cheyyunnu
  const handleNestedChange11 = (e) => {
    const { name, value } = e.target;

    setPurchaseData((prevpurchaseData) => ({
      ...prevpurchaseData,
      purchaseTo: {
        ...prevpurchaseData.purchaseTo,
        [name]: value,
      },
    }));
  };
  // purchaseBy section paranjayachu editu cheyyunnu
  const handleNestedChange = (e) => {
    const { name, value } = e.target;

    setPurchaseData((prevpurchaseData) => ({
      ...prevpurchaseData,
      purchaseBy: {
        ...prevpurchaseData.purchaseBy,
        [name]: value,
      },
    }));
  };

  //ippo ivide purchaseby and purchaseto vileku authorize fieldnu vendi vidunnu
  const handleNestedChange22 = (e) => {
    const { name, value } = e.target;
    setPurchaseData((prevPurchaseData) => ({
      ...prevPurchaseData,
      authorizedBy: {
        ...prevPurchaseData.authorizedBy,
        [name]: value,
      },
    }));
  };

  // nammal select cheyyunna ledger ivide varunnu
  const handleLedgerSelect = (ledger, ledgerType) => {
    console.log("Selected Ledger ID:", ledger._id);
    setPurchaseData((prevFormData) => ({
      ...prevFormData,
      [ledgerType]: ledger._id,
      [`${ledgerType}Name`]: ledger.name,
    }));
    setSelectedLedger({ id: ledger._id, type: ledgerType });
  };
  const handleLedgerSelect3 = (ledger, ledgerType) => {
    console.log("Selected Ledger ID:", ledger._id);
    setPurchaseData((prevFormData) => ({
      ...prevFormData,
      [`${ledgerType}Id`]: ledger._id,
    }));
  };

  const stockLedgerSelect = (ledger, itemId) => {
    console.log("Selected stock Ledger ID:", ledger._id);
    setPurchaseData((prevPurchaseData) => {
      const updatedItems = prevPurchaseData.items.map((item) =>
        item.id === itemId
          ? { ...item, stockLedger: ledger._id, stockName: ledger.stockItem }
          : item
      );
      return {
        ...prevPurchaseData,
        items: updatedItems,
      };
    });
    setSelectedLedger({ id: ledger._id, type: "stockLedger" });
  };
  const taxIdSelect = (tax) => {
    setPurchaseData((prevPurchaseData) => ({
      ...prevPurchaseData,
      taxId: tax._id,
    }));
  };

  const { data: balanceData, error: balanceError } = useGetLedgerBalanceQuery(
    selectedLedger?.id,
    { skip: !selectedLedger }
  );

  useEffect(() => {
    if (balanceData && selectedLedger) {
      setLedgerBalances((prevBalances) => ({
        ...prevBalances,
        [selectedLedger.type]: balanceData.balance,
      }));
    }
    if (balanceError) {
      console.error("Error fetching ledger balance:", balanceError);
    }
  }, [balanceData, balanceError, selectedLedger]);

  const handleItemChange = (itemId, data) => {
    console.log("data", itemId);
    setPurchaseData((prevPurchaseData) => {
      const updatedItems = prevPurchaseData.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...data,
              amount:
                (data.quantity !== undefined ? data.quantity : item.quantity) *
                  (data.rate !== undefined ? data.rate : item.rate) || 0,
            }
          : item
      );
      return {
        ...prevPurchaseData,
        items: updatedItems,
      };
    });
  };

  const handleDeleted = async () => {
    try {
      await deletePurchase(id).unwrap(); // Call delete API
      alert("Purchase deleted successfully!");
      // Optionally update state or navigate
      // Example: dispatch(fetchPurchases()); // Refetch or update the list of purchases
    } catch (error) {
      console.error("Failed to delete purchase:", error);
      alert("Failed to delete purchase.");
    }
  };
  const handleDeleteItem = (itemId) => {
    console.log("Item ID to delete:", itemId);
    setPurchaseData((prevPurchaseData) => {
      const updatedItems = prevPurchaseData.items.filter(
        (item) => item.id !== itemId
      );
      return {
        ...prevPurchaseData,
        items: updatedItems,
      };
    });
  };

  const handleCalculateTotal = () => {
    let subTotal = purchaseData.items
      .reduce(
        (acc, item) => acc + parseFloat(item.rate) * parseInt(item.quantity),
        0
      )
      .toFixed(2);

    const taxAmount = (
      parseFloat(subTotal) *
      (parseFloat(purchaseData.taxRate) / 100)
    ).toFixed(2);
    const total = (parseFloat(subTotal) + parseFloat(taxAmount)).toFixed(2);

    setPurchaseData((prevState) => ({
      ...prevState,
      subTotal: parseFloat(subTotal),
      taxAmount: parseFloat(taxAmount),
      total: parseFloat(total),
      creditAmount: parseFloat(subTotal),
      debitAmount: parseFloat(subTotal),
    }));
  };

  useEffect(() => {
    handleCalculateTotal();
  }, [
    purchaseData.items.rate,
    purchaseData.items.quantity,
    purchaseData.taxRate,
  ]);

  const handleAddEvent = () => {
    const newItem = {
      id: shortid.generate(),
      serialNumber: purchaseData.items.length + 1,
      stockLedger: "",
      hsnCode: "",
      unit: "", // Changed to lower case 'u' for consistency
      quantity: 0,
      rate: 0, // Changed to lower case 'r' for consistency
      amount: 0,
    };

    setPurchaseData((prevPurchaseData) => ({
      ...prevPurchaseData,
      items: [...prevPurchaseData.items, newItem],
    }));
  };

  //   const [postInvoice, { isLoading }] = useCreatePurchaseMutation();

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const invoiceData = { ...purchaseData };
  //       await postInvoice(invoiceData).unwrap();
  //       alert("Invoice submitted successfully!");
  //       // Reset form data if needed
  //     } catch (error) {
  //       console.error("Failed to submit invoice: ", error);
  //       alert("Failed to submit invoice.");
  //     }
  //   };
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };
  return (
    <div className="w-[95%] mx-auto mt-8 bg-red-200 shadow-md rounded-lg p-6">
      <div className="flex justify-around ">
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
          <PurchaseBy
            allState={purchaseData}
            allLedgers={filteredLedgers}
            handleNestedChange={handleNestedChange}
            setPurchaseData={setPurchaseData}
            handleNestedChange22={handleNestedChange22}
          />

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
          <PurchaseTo
            allState={purchaseData}
            allLedgers={filteredLedgers}
            handleNestedChange11={handleNestedChange11}
            setPurchaseData={setPurchaseData}
            handleNestedChange22={handleNestedChange22}
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
          <PurchaseAccount
            allState={purchaseData}
            allLedgers={filteredLedgers}
            handleNestedChange={handleNestedChange}
            setPurchaseData={setPurchaseData}
            handleItemChange={handleItemChange}
            handleDeleteItem={handleDeleteItem}
            handleChange={handleChange}
            items1={purchaseData.items}
            handleInputChange={handleInputChange}
            selectedLedger={purchaseData.items.debitLedger}
            stockLedger={(ledger) => stockLedgerSelect(ledger, ledger)}
            hello={(ledger) => handleLedgerSelect(ledger, "debitLedger")}
            hello2={(ledger) => handleLedgerSelect(ledger, "creditLedger")}
            hello3={(ledger) => handleLedgerSelect3(ledger, "tax")}
            onChange={(ledger) => handleLedgerSelect(ledger, "debitLedger")}
            handleChangee={handleChangee}
            stocks={stocks}
            taxes={taxes}
            buttonLedger={<ButtonLedger />}
            // taxId={(ledger) => taxIdSelect(ledger, ledger)}
          />

          <div className=" ml-10 mt-2">
            <button
              onClick={prevStep}
              className="bg-gray-500 text-white px-4  py-2 rounded mt-4"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-4 mt-4 ml-2"
            >
              Next
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4 "
              onClick={handleAddEvent}
            >
              Add Item
            </button>
            <button onClick={handleDeleted} className="btn btn-danger">
              Delete Purchase
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 mr-4 ml-2"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h1>Vimal kumar</h1>
          <button
            onClick={prevStep}
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseForm;
