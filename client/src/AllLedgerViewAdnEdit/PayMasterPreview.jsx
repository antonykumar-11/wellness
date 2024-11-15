import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPaymasterVoucherByIdQuery,
  useUpdatePaymasterVoucherMutation,
  useDeletePaymasterVoucherMutation,
} from "../store/api/PayMasterApi";

import { useGetLedgerQuery } from "../store/api/LedgerApi";
import useTheme from "../context/Theme";

import LedgerMiddleWares from "../middlewares/LedgerMiddleWares";
import moment from "moment";

const PayMasterPreview = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [voucherData, setVoucherData] = useState({
    voucherType: "payMaster",
    voucherNumber: "",
    date: moment().format("YYYY-MM-DD"),
    debitLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    creditLedgers: [{ ledgerId: "", ledgerName: "", amount: "" }],
    description: "",
    bookSalary: false, // Added field for booking salary
  });
  console.log("voucherData", voucherData);
  const { data: ledgers = [] } = useGetLedgerQuery();
  const [updatePayMaster] = useUpdatePaymasterVoucherMutation();
  const [deletePayMaster] = useDeletePaymasterVoucherMutation();

  const { themeMode } = useTheme();

  const { data: existingVoucher = {} } = useGetPaymasterVoucherByIdQuery(
    transactionId,
    {
      skip: !transactionId,
    }
  );

  useEffect(() => {
    if (existingVoucher) {
      setVoucherData({
        ...existingVoucher,
        debitLedgers: existingVoucher.debitLedgers || [],
        creditLedgers: existingVoucher.creditLedgers || [],
      });
    }
  }, [existingVoucher]);

  const handleAmountChange = (index, ledgerType, value) => {
    const updatedLedgers = [...voucherData[ledgerType]];
    updatedLedgers[index].amount = value;
    setVoucherData((prevData) => ({
      ...prevData,
      [ledgerType]: updatedLedgers,
    }));
  };

  const handleAddLedger = (ledgerType) => {
    const updatedLedgers = [
      ...voucherData[ledgerType],
      { ledgerId: "", ledgerName: "", amount: "" },
    ];
    setVoucherData((prevData) => ({
      ...prevData,
      [ledgerType]: updatedLedgers,
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

  const handleLedgerChange = (index, ledgerType, ledger) => {
    if (!ledger || !ledgerType || index === undefined) {
      console.error("Invalid parameters:", { index, ledgerType, ledger });
      return;
    }

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucherData({
      ...voucherData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      await updatePayMaster({
        ...voucherData,
        id: transactionId,
      }).unwrap();
      navigate("/expense/incomemain");
    } catch (error) {
      console.error("Failed to update voucher:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePayMaster(transactionId).unwrap();
      navigate("/expense/incomemain");
    } catch (error) {
      console.error("Failed to delete voucher:", error);
    }
  };

  const handleSalaryBooking = () => {
    setVoucherData((prevData) => ({
      ...prevData,
      bookSalary: !prevData.bookSalary,
    }));
  };

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
    <>
      {/* PayMaster */}
      <div className="flex flex-col min-h-screen -mt-[72px]">
        <main className="flex-grow flex justify-center items-center p-4">
          <div className={containerClass}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Create Journal Voucher
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
                  <LedgerMiddleWares
                    options={ledgers}
                    value={debitLedger.ledgerName}
                    mani={debitLedger.ledgerName}
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
              {voucherData.creditLedgers.length === 0 && (
                <div className="text-gray-500">
                  No credit ledgers available. Please add a ledger.
                </div>
              )}
              {voucherData.creditLedgers.map((creditLedger, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
                >
                  <LedgerMiddleWares
                    options={ledgers}
                    value={creditLedger.ledgerName}
                    mani={creditLedger.ledgerName}
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

              {/* Add an empty credit ledger if none exist */}
              {voucherData.creditLedgers.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <LedgerMiddleWares
                    options={ledgers}
                    value=""
                    mani=""
                    onChange={(ledger) =>
                      handleLedgerChange(0, "creditLedgers", ledger)
                    }
                    selectedLedger={null}
                    themeMode={themeMode}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value=""
                    onChange={(e) =>
                      handleAmountChange(0, "creditLedgers", e.target.value)
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
                </div>
              )}

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

              {/* Book Salary Section */}
              <div className="flex items-center mt-6">
                <input
                  id="bookSalary"
                  type="checkbox"
                  checked={voucherData.bookSalary}
                  onChange={handleSalaryBooking}
                  className="mr-2"
                />
                <label htmlFor="bookSalary" className="text-sm font-medium">
                  Book Salary
                </label>
              </div>

              {/* Buttons Section */}
              <div className="flex justify-between mt-6">
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
                {transactionId && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className={`px-4 py-2 rounded-md font-semibold ${
                      themeMode === "dark"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default PayMasterPreview;
