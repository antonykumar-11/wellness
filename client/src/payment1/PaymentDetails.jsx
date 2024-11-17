import { useState, useEffect } from "react";
import {
  useCreatePaymentMutation,
  useCheckVoucherNumberQuery,
} from "../store/api/PaymentApi";
import LedgerMiddleWares from "../middlewares/LedgerMiddleWares";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetLedgerQuery } from "../store/api/LedgerApi";
import useTheme from "../context/Theme";

const PaymentDetails = () => {
  const [voucherData, setVoucherData] = useState({
    voucherType: "Payment Voucher",
    voucherNumber: "",
    date: "",
    debitLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    description: "",
  });

  const { data: voucherCheck, refetch: VocherCheckRefecth } =
    useCheckVoucherNumberQuery();
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
  useEffect(() => {
    VocherCheckRefecth();
  }, [VocherCheckRefecth]);
  const [askHelp, setAskHelp] = useState(false); // State to manage modal visibility

  const openModalAsk = () => {
    setAskHelp(true); // Function to open the modal
  };

  const closeModalAsk = () => {
    setAskHelp(false); // Function to close the modal
  };
  const { data: ledgers = [], isLoading, isError } = useGetLedgerQuery();
  const [createJournalVoucher] = useCreatePaymentMutation();
  const { themeMode } = useTheme();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createJournalVoucher(voucherData);
      console.log("response", response);
      if (response?.data?.voucherType === "Payment Voucher") {
        toast.success("Journal created successfully!");
        setVoucherData({
          voucherNumber: "",
          date: "",
          debitLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
          creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
          description: "",
        });
      } else {
        toast.error("Failed to create Journal Voucher");
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
            Create Payment Voucher
          </h2>
          <form className="space-y-6">
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
            <div className="flex justify-end mt-6 gap-4">
              <div
                onClick={openModalAsk} // On button click, open the modal
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Any Help
              </div>
              <div
                onClick={handleSubmit} // Call handleSubmit when the div is clicked
                className={`px-4 py-2 rounded-md font-semibold cursor-pointer ${
                  themeMode === "dark"
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
              >
                Create Voucher
              </div>
            </div>
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
                      ഈ ഭാഗത്തു നിങ്ങൾ കടമായി എന്തെങ്കിലും സാധനം
                      വാങ്ങിയിട്ടുണ്ടെങ്കിൽ അത് തിരികെ കൊടുക്കാൻ മാത്രം ഈ
                      pyament Voucher ഉപയോഗിക്കണം
                    </p>
                    <p className="text-sm mb-4 leading-relaxed tracking-wide">
                      <span className="font-bold mr-2">Debit Ledger:</span>
                      നമ്മൾ സാധനം വാങ്ങിയ സമയം കടമായിട്ടു വാങ്ങിയപ്പോ ആരെ
                      ക്രെഡിറ്റർ ( CreditLedger ) ഭാഗത്തു ക്രെഡിറ്റർ ( Sundry
                      Creditor ) ആയി വച്ചോ അയാളെ ഇപ്പൊ Payment Voucher ൽ Debit
                      Ledger ഭാഗത്തു വയ്ക്കണം .
                    </p>
                    <p className="text-sm mb-4 leading-relaxed tracking-wide">
                      <span className="font-bold mr-2">Credit Ledger:</span>
                      നമ്മൾ Payment ചെയുമ്പോൾ നൽകുന്ന ക്യാഷ് ( Cash ) അല്ലെങ്കിൽ
                      ബാങ്ക് ( Bank Accounts ) വഴി ആണെങ്കിൽ ബാങ്കിനെ ക്രെഡിറ്റ്
                      ( Credit Ledger) ഭാഗത്തു വയ്ക്കണം
                    </p>
                    <p className="text-sm mb-4 leading-relaxed tracking-wide m-4">
                      <span className="font-bold mr-2">Description :</span>ഈ പൈസ
                      എന്തിനു ചിലവായ എന്ന വിവരണം .
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default PaymentDetails;
