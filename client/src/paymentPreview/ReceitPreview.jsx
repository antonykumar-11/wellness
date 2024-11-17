import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetReceiptVoucherByIdQuery,
  useUpdateReceiptVoucherMutation,
  useDeleteReceiptVoucherMutation,
} from "../store/api/RecieptVoucher";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetLedgerQuery } from "../store/api/LedgerApi";
import LedgerMiddleWares from "../middlewares/LedgerMiddleWares";
import useTheme from "../context/Theme";

const ReceiptPreview = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [voucherData, setVoucherData] = useState({
    voucherType: "Receipt Voucher",
    voucherNumber: "",
    date: "",
    debitLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    description: "",
  });

  const {
    data: ledgers = [],
    isLoading: ledgersLoading,
    isError: ledgersError,
  } = useGetLedgerQuery();
  const {
    data: journalVoucher,
    isLoading: voucherLoading,
    isError: voucherError,
    refetch: refetchVoucherData,
  } = useGetReceiptVoucherByIdQuery(transactionId || "", {
    skip: !transactionId,
  });
  const [updateJournalVoucher] = useUpdateReceiptVoucherMutation();
  const [deleteJournalVoucher] = useDeleteReceiptVoucherMutation();
  const { themeMode } = useTheme();

  useEffect(() => {
    if (journalVoucher) {
      setVoucherData({
        ...journalVoucher,
        date: new Date(journalVoucher.date).toISOString().split("T")[0],
      });
    }
  }, [journalVoucher]);

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

  const handleAmountChange = ({ index, ledgerType, value }) => {
    const updatedLedgers = [...voucherData[ledgerType]];
    const amount = value ? parseFloat(value) : "";
    updatedLedgers[index] = {
      ...updatedLedgers[index],
      amount: amount,
    };
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

    if (!transactionId) {
      console.error("No transactionId provided!");
      return;
    }

    try {
      await updateJournalVoucher({ transactionId, ...voucherData });
      refetchVoucherData();
      // Get current date and format for navigation
      const currentDate = new Date();
      const monthString = currentDate.toLocaleString("default", {
        month: "long",
      });
      const currentYear = currentDate.getFullYear();
      const currentMonthYear = `${monthString} ${currentYear}`;

      navigate(`/reports/receiptreport/${currentMonthYear}`); // Redirect after update
    } catch (error) {
      console.error("Failed to update journal voucher:", error);
    }
  };

  const handleDelete = async () => {
    if (transactionId) {
      try {
        await deleteJournalVoucher(transactionId);
        // Get current date and format for navigation
        const currentDate = new Date();
        const monthString = currentDate.toLocaleString("default", {
          month: "long",
        });
        const currentYear = currentDate.getFullYear();
        const currentMonthYear = `${monthString} ${currentYear}`;

        navigate(`/reports/receiptreport/${currentMonthYear}`); // Redirect after delete
      } catch (error) {
        console.error("Failed to delete journal voucher:", error);
      }
    }
  };

  if (ledgersLoading || voucherLoading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (ledgersError || voucherError)
    return <div className="text-center text-red-500">Error fetching data</div>;

  const containerClass = `max-w-4xl mx-auto p-6 shadow-lg rounded-lg ${
    themeMode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
  }`;
  const inputClass = `mt-1 block w-full rounded-md border-2 ${
    themeMode === "dark"
      ? "bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
      : "bg-white text-black border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
  } h-12`;
  const buttonClass = `inline-flex items-center px-4 py-2 rounded-md ${
    themeMode === "dark"
      ? "text-white bg-blue-600 hover:bg-blue-700"
      : "text-white bg-blue-500 hover:bg-blue-600"
  }`;

  return (
    <div className="flex flex-col min-h-screen -mt-[72px]">
      <main className="flex-grow flex justify-center items-center p-4">
        <div className={containerClass}>
          <h2 className="text-3xl font-bold mb-6 text-center">
            {transactionId ? "Edit Receipt Voucher" : "Create Receipt Voucher"}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 items-center">
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
                  readOnly={!transactionId}
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
                  readOnly={!transactionId}
                />
              </div>
            </div>

            {/* Debit Ledger Section */}
            <h3 className="text-lg font-semibold mt-6">Debit Ledger</h3>
            {voucherData.debitLedgers.map((debitLedger, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 items-center">
                <LedgerMiddleWares
                  options={ledgers} // Pass the list of ledgers as options
                  selectedLedger={ledgers.find(
                    (l) => l._id === debitLedger.ledgerId
                  )}
                  onChange={(ledger) =>
                    handleLedgerChange(index, "debitLedgers", ledger)
                  } // Ensure ledger change is handled
                  themeMode={themeMode}
                  disabled={!transactionId}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={debitLedger.amount}
                  onChange={(e) =>
                    handleAmountChange({
                      index: index,
                      ledgerType: "debitLedgers",
                      value: e.target.value,
                    })
                  }
                  className={inputClass}
                  readOnly={!transactionId}
                />
                {transactionId && (
                  <>
                    <button
                      type="button"
                      className={buttonClass}
                      onClick={() => handleAddLedger("debitLedgers")}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className={buttonClass}
                      onClick={() => handleRemoveLedger(index, "debitLedgers")}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            ))}

            {/* Credit Ledger Section */}
            <h3 className="text-lg font-semibold mt-6">Credit Ledger</h3>
            {voucherData.creditLedgers.map((creditLedger, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 items-center">
                <LedgerMiddleWares
                  options={ledgers}
                  selectedLedger={ledgers.find(
                    (l) => l._id === creditLedger.ledgerId
                  )}
                  onChange={(ledger) =>
                    handleLedgerChange(index, "creditLedgers", ledger)
                  }
                  themeMode={themeMode}
                  disabled={!transactionId}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={creditLedger.amount}
                  onChange={(e) =>
                    handleAmountChange({
                      index: index,
                      ledgerType: "creditLedgers",
                      value: e.target.value,
                    })
                  }
                  className={inputClass}
                  readOnly={!transactionId}
                />
                {transactionId && (
                  <>
                    <button
                      type="button"
                      className={buttonClass}
                      onClick={() => handleAddLedger("creditLedgers")}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className={buttonClass}
                      onClick={() => handleRemoveLedger(index, "creditLedgers")}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={voucherData.description}
                onChange={handleChange}
                className={`${inputClass} h-auto`}
              />
            </div>

            <div className="flex justify-between">
              <button type="submit" className={buttonClass}>
                {transactionId ? "Update Voucher" : "Create Voucher"}
              </button>
              {transactionId && (
                <button
                  type="button"
                  className={`ml-4 ${buttonClass}`}
                  onClick={handleDelete}
                >
                  Delete Voucher
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ReceiptPreview;
