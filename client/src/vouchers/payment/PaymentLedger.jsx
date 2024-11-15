import { useState, useEffect } from "react";
import {
  useGetAllLedgersWithTransactionsQuery,
  useGetLedgerBalanceQuery,
} from "../../store/api/AllLedgerApi";
import { useCreatePaymentMutation } from "../../store/api/PaymentApi";

import SearchableDropdown from "./SearchableDropdown";

const PaymentVoucher = () => {
  const [formData, setFormData] = useState({
    voucherNumber: "",
    date: "",
    debitLedger: null,
    debitAmount: "",
    creditLedger: null,
    creditAmount: "",
  });

  const { data: ledgerData = [] } = useGetAllLedgersWithTransactionsQuery();
  const [createPayment] = useCreatePaymentMutation();
  const [ledgers, setLedgers] = useState([]);
  const [filteredLedgers, setFilteredLedgers] = useState([]);
  const [ledgerBalances, setLedgerBalances] = useState({});

  const { primaryLedgers = [], secondaryLedgers = [] } = ledgerData;

  useEffect(() => {
    if (primaryLedgers.length > 0 || secondaryLedgers.length > 0) {
      const allLedgers = [...primaryLedgers, ...secondaryLedgers];
      setLedgers(allLedgers);
      setFilteredLedgers(allLedgers);
    }
  }, [primaryLedgers, secondaryLedgers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "debitLedger" || name === "creditLedger") {
      fetchLedgerBalance(value, name);
    }
  };

  const fetchLedgerBalance = async (ledgerId, ledgerType) => {
    if (!ledgerId) {
      setLedgerBalances((prevBalances) => ({
        ...prevBalances,
        [ledgerType]: null,
      }));
      return;
    }
    try {
      const response = await useGetLedgerBalanceQuery(ledgerId);
      setLedgerBalances((prevBalances) => ({
        ...prevBalances,
        [ledgerType]: response.data.balance,
      }));
    } catch (error) {
      console.error("Error fetching ledger balance:", error);
      setError("Failed to fetch ledger balance");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.debitLedger || !formData.creditLedger) {
      setError("Please select both debit and credit ledgers.");
      return;
    }

    try {
      await createPayment({
        ...formData,
        debitLedger: formData.debitLedger._id,
        creditLedger: formData.creditLedger._id,
      }).unwrap();

      setFormData({
        voucherNumber: "",
        date: "",
        debitLedger: null,
        debitAmount: "",
        creditLedger: null,
        creditAmount: "",
      });

      setLedgerBalances({});
      setError(null);

      alert("Payment created successfully!");
    } catch (error) {
      console.error("Error creating payment:", error);
      setError("An error occurred while creating the payment.");
    }
  };

  const handleSearchChange = (query) => {
    setFilteredLedgers(
      ledgers.filter((ledger) =>
        ledger.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleLedgerSelect = (ledger, ledgerType) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [ledgerType]: ledger,
    }));
    fetchLedgerBalance(ledger._id, ledgerType);
  };

  return (
    <div className="max-w-5xl mx-auto shadow-md rounded-md relative p-6">
      <div className="flex items-center gap-6">
        <div className="mb-4">
          <label className="block text-gray-700">Debit Ledger</label>
          <SearchableDropdown
            ledgers={filteredLedgers}
            selectedLedger={formData.debitLedger}
            onSelectLedger={(ledger) =>
              handleLedgerSelect(ledger, "debitLedger")
            }
            placeholder="Search Debit Ledger..."
            onSearchChange={handleSearchChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Debit Amount</label>
          <input
            type="number"
            name="debitAmount"
            value={formData.debitAmount}
            onChange={handleChange}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            placeholder="Amount"
          />
        </div>
        <div className="flex items-center gap-6">
          <div>
            <label className="block text-gray-700">Credit Ledger</label>
            <SearchableDropdown
              ledgers={filteredLedgers}
              selectedLedger={formData.creditLedger}
              onSelectLedger={(ledger) =>
                handleLedgerSelect(ledger, "creditLedger")
              }
              placeholder="Search Credit Ledger..."
              onSearchChange={handleSearchChange}
            />
          </div>
          <div>
            <label className="block text-gray-700">Credit Amount</label>
            <input
              type="number"
              name="creditAmount"
              value={formData.creditAmount}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              placeholder="Amount"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVoucher;
