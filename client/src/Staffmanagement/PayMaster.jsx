import { useState, useEffect } from "react";

import LedgerMiddleWares from "../middlewares/LedgerMiddleWares";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useTheme from "../context/Theme";
import {
  useCreatePaymasterVoucherMutation,
  useCheckVoucherNumberQuery,
} from "../store/api/PayMasterApi";
import { FaBook } from "react-icons/fa";
import {
  useGetLedgerPayQuery,
  useCreateLedgerMutation,
} from "../store/api/LedgerApi";
import Ledger from "../vouchers/dummy2/Ledger5";
const JournalVoucher = () => {
  const [voucherData, setVoucherData] = useState({
    voucherType: "PayMaster",
    voucherNumber: "",
    date: "",
    debitLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    description: "",
  });
  const [localLedgerData, setLocalLedgerData] = useState([]); // Local ledger state for dropdown
  const openLedgerModal = () => setIsLedgerModalOpen(true);
  const closeLedgerModal = () => setIsLedgerModalOpen(false);
  const {
    data: ledgers = [],
    isLoading,
    isError,
    refetch,
  } = useGetLedgerPayQuery();
  const { data: voucherCheck, refetch: VocherCheckRefecth } =
    useCheckVoucherNumberQuery();
  console.log("voucherCheck ", voucherCheck);

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
      setVoucherData((prevData) => ({
        ...prevData,
        voucherNumber: newVoucherNumber, // Set the incremented voucher number
      }));
    }
  }, [voucherCheck]);

  const [createLedger] = useCreateLedgerMutation();
  const [createJournalVoucher] = useCreatePaymasterVoucherMutation();
  const { themeMode } = useTheme();
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const handleLedgerChange = (index, ledgerType, ledger) => {
    const updatedLedgers = [...voucherData[ledgerType]];
    updatedLedgers[index] = {
      ...updatedLedgers[index],
      ledgerId: ledger._id,
      ledgerName: ledger.name,
    };
    setVoucherData((prevData) => ({
      ...prevData,
      [ledgerType]: updatedLedgers,
    }));
  };

  const handleAmountChange = (index, ledgerType, value) => {
    const updatedLedgers = [...voucherData[ledgerType]];
    updatedLedgers[index].amount = value;
    setVoucherData((prevData) => ({
      ...prevData,
      [ledgerType]: updatedLedgers,
    }));
  };

  const handleAddLedger = (ledgerType) => {
    setVoucherData((prevData) => ({
      ...prevData,
      [ledgerType]: [
        ...prevData[ledgerType],
        { ledgerId: "", ledgerName: "", amount: "" },
      ],
    }));
  };

  const handleRemoveLedger = (index, ledgerType) => {
    const updatedLedgers = [...voucherData[ledgerType]];
    if (updatedLedgers.length > 1) {
      updatedLedgers.splice(index, 1);
      setVoucherData((prevData) => ({
        ...prevData,
        [ledgerType]: updatedLedgers,
      }));
    }
  };

  const handleChange = (e) => {
    setVoucherData({
      ...voucherData,
      [e.target.name]: e.target.value,
    });
  };
  // Handle ledger creation
  const handleLedgerCreation = async (newLedgerData) => {
    console.log("newLedgerData", newLedgerData);
    try {
      const newLedger = await createLedger(newLedgerData).unwrap();
      setLocalLedgerData([...localLedgerData, newLedger]);
      refetch();
      setIsLedgerModalOpen(false); // Close modal after creation
    } catch (error) {
      console.error("Failed to create ledger:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createJournalVoucher(voucherData);
      console.log("response", response);
      if (response?.data?.voucherType === "PayMaster") {
        toast.success("PayMaster created successfully!");
        VocherCheckRefecth();
        setVoucherData({
          voucherType: "PayMaster",
          voucherNumber: "",
          date: "",
          debitLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
          creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
          description: "",
        });
      } else {
        toast.error("Failed to create PayMaster");
      }
    } catch (error) {
      console.error("API call error:", error);
      toast.error("An error occurred while creating the voucher", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching voucher data</div>;

  const containerClass = `max-w-4xl mx-auto p-6 shadow-lg rounded-lg ${
    themeMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
  }`;

  const inputClass = `mt-1 block w-full rounded-md border-2 ${
    themeMode === "dark"
      ? "bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
      : "bg-white text-black border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
  } h-12`;

  const buttonClassAdd = `inline-flex items-center px-3 py-1 rounded-md ${
    themeMode === "dark"
      ? "text-white bg-green-600 hover:bg-green-700"
      : "text-white bg-green-500 hover:bg-green-600"
  }`;

  const buttonClassRemove = `inline-flex items-center px-3 py-1 rounded-md ${
    themeMode === "dark"
      ? "text-white bg-red-600 hover:bg-red-700"
      : "text-white bg-red-500 hover:bg-red-600"
  }`;

  return (
    <div className="flex flex-col min-h-screen -mt-[72px]">
      <ToastContainer />
      <main className="flex-grow flex justify-center items-center p-4">
        <div className={containerClass}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Create PayMaster
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium">
                  Voucher Number
                </label>
                <input
                  type="text"
                  name="voucherNumber"
                  value={voucherData.voucherNumber}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  value={voucherData.date}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Debit Ledger Section */}
            <h3 className="text-lg font-semibold mt-6">Debit Ledger</h3>
            {voucherData.debitLedgers.map((debitLedger, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
              >
                {console.log("debitLedger", debitLedger)}
                <LedgerMiddleWares
                  options={ledgers}
                  value={debitLedger.ledgerName}
                  onChange={(ledger) =>
                    handleLedgerChange(index, "debitLedgers", ledger)
                  }
                  selectedLedger={ledgers.find(
                    (l) => l._id === debitLedger.ledgerId
                  )}
                  themeMode={themeMode}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={debitLedger.amount}
                  onChange={(e) =>
                    handleAmountChange(index, "debitLedgers", e.target.value)
                  }
                  className={inputClass}
                />
                <button
                  type="button"
                  className={buttonClassAdd}
                  onClick={() => handleAddLedger("debitLedgers")}
                >
                  Add
                </button>
                <button
                  type="button"
                  className={buttonClassRemove}
                  onClick={() => handleRemoveLedger(index, "debitLedgers")}
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Credit Ledger Section */}
            <h3 className="text-lg font-semibold mt-6">Credit Ledger</h3>
            {voucherData.creditLedgers.map((creditLedger, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
              >
                <LedgerMiddleWares
                  options={ledgers}
                  value={creditLedger.ledgerName}
                  onChange={(ledger) =>
                    handleLedgerChange(index, "creditLedgers", ledger)
                  }
                  selectedLedger={ledgers.find(
                    (l) => l._id === creditLedger.ledgerId
                  )}
                  themeMode={themeMode}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={creditLedger.amount}
                  onChange={(e) =>
                    handleAmountChange(index, "creditLedgers", e.target.value)
                  }
                  className={inputClass}
                />
                <button
                  type="button"
                  className={buttonClassAdd}
                  onClick={() => handleAddLedger("creditLedgers")}
                >
                  Add
                </button>
                <button
                  type="button"
                  className={buttonClassRemove}
                  onClick={() => handleRemoveLedger(index, "creditLedgers")}
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Description Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={voucherData.description}
                onChange={handleChange}
                className={`${inputClass} h-auto`}
                style={{ minHeight: "4rem" }} // Initially small
                rows={1} // Default row size
                onInput={(e) => {
                  e.target.style.height = "auto"; // Reset height
                  e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on content
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className={`px-4 py-2 rounded-md font-semibold ${
                  themeMode === "dark"
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
              >
                Create Voucher
              </button>
            </div>
          </form>
          {isLedgerModalOpen && (
            <Ledger
              closeModal={closeLedgerModal}
              onLedgerCreate={handleLedgerCreation}
            />
          )}

          <button
            type="button" // Prevent form submission
            onClick={(e) => {
              e.preventDefault(); // Prevent potential form submission (if not needed)
              openLedgerModal(e); // Open the modal for adding a ledger
            }}
            className="flex items-center px-5 mt-5 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 mr-4"
          >
            <FaBook className="mr-2" /> {/* Add icon */}
            Add Ledger
          </button>
        </div>
      </main>
    </div>
  );
};

export default JournalVoucher;
