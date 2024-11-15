import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPaymasterVoucherByIdQuery,
  useUpdatePaymasterVoucherMutation,
  useDeletePaymasterVoucherMutation,
} from "../store/api/PayMasterApi";
import { useGetLedgerQuery } from "../store/api/LedgerApi";

const PayMasterPreview = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [voucherData, setVoucherData] = useState({
    voucherNumber: "",
    date: "",
    debitLedgers: [{ ledgerId: "", amount: "" }],
    creditLedgers: [{ ledgerId: "", amount: "" }],
    description: "",
    bookSalary: false,
  });
  console.log("voucherData", voucherData);
  const { data: ledgers = [] } = useGetLedgerQuery();
  const { data: existingVoucher } = useGetPaymasterVoucherByIdQuery(
    transactionId,
    {
      skip: !transactionId,
    }
  );

  useEffect(() => {
    if (existingVoucher) {
      console.log("Existing Voucher:", existingVoucher);
      setVoucherData({
        ...existingVoucher,
        debitLedgers: existingVoucher.debitLedgers || [
          { ledgerId: "", amount: "" },
        ],
        creditLedgers: existingVoucher.creditLedgers || [
          { ledgerId: "", amount: "" },
        ],
      });
    }
  }, [existingVoucher]);

  const handleAmountChange = (index, ledgerType, value) => {
    const updatedLedgers = voucherData[ledgerType].map((ledger, i) =>
      i === index ? { ...ledger, amount: value } : ledger
    );
    setVoucherData((prevData) => ({
      ...prevData,
      [ledgerType]: updatedLedgers,
    }));
  };

  const handleLedgerChange = (index, ledgerType, ledgerId) => {
    console.log("Handling Ledger Change:", index, ledgerType, ledgerId);
    const updatedLedgers = [...voucherData[ledgerType]];
    updatedLedgers[index].ledgerId = ledgerId;
    setVoucherData((prevData) => ({
      ...prevData,
      [ledgerType]: updatedLedgers,
    }));
  };

  const [updatePayMaster] = useUpdatePaymasterVoucherMutation();
  const [deletePayMaster] = useDeletePaymasterVoucherMutation();

  // Handle input change for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucherData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePayMaster({ ...voucherData, id: transactionId }).unwrap();
      navigate("/expense/incomemain");
    } catch (error) {
      console.error("Failed to update voucher:", error);
    }
  };

  // Handle voucher deletion
  const handleDelete = async () => {
    try {
      await deletePayMaster(transactionId).unwrap();
      navigate("/expense/incomemain");
    } catch (error) {
      console.error("Failed to delete voucher:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Paymaster Voucher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Voucher Number</label>
          <input
            type="text"
            name="voucherNumber"
            value={voucherData.voucherNumber}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={voucherData.date}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <h3 className="text-lg font-semibold mt-4">Debit Ledgers</h3>
        {voucherData.debitLedgers.map((debitLedger, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <select
              value={debitLedger.ledgerId}
              onChange={(e) =>
                handleLedgerChange(index, "debitLedgers", e.target.value)
              }
              className="border rounded p-2"
            >
              <option value="">Select Ledger</option>
              {ledgers.map((ledger) => (
                <option key={ledger._id} value={ledger._id}>
                  {ledger.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={debitLedger.amount}
              onChange={(e) =>
                handleAmountChange(index, "debitLedgers", e.target.value)
              }
              className="border rounded p-2"
            />
          </div>
        ))}

        <h3 className="text-lg font-semibold mt-4">Credit Ledgers</h3>
        {voucherData.creditLedgers.map((creditLedger, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <select
              value={creditLedger.ledgerId}
              onChange={(e) =>
                handleLedgerChange(index, "creditLedgers", e.target.value)
              }
              className="border rounded p-2"
            >
              <option value="">Select Ledger</option>
              {ledgers.map((ledger) => (
                <option key={ledger._id} value={ledger._id}>
                  {ledger.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={creditLedger.amount}
              onChange={(e) =>
                handleAmountChange(index, "creditLedgers", e.target.value)
              }
              className="border rounded p-2"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={voucherData.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="bookSalary"
            checked={voucherData.bookSalary}
            onChange={() =>
              setVoucherData((prevData) => ({
                ...prevData,
                bookSalary: !prevData.bookSalary,
              }))
            }
            className="mr-2"
          />
          <label htmlFor="bookSalary" className="text-sm font-medium">
            Book Salary
          </label>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          {transactionId && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PayMasterPreview;
