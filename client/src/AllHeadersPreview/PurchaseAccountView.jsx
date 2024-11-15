import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetExpensesQuery } from "../store/api/ExpenseExpenseApi";

const GroupDetails = () => {
  const navigate = useNavigate();
  const { data: { transactions = [], ledgers = [] } = {}, refetch } =
    useGetExpensesQuery();
  const [details, setDetails] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  useEffect(() => {
    refetch();
  }, [refetch]);
  useEffect(() => {
    if (transactions.length > 0 && ledgers.length > 0) {
      const ledgerMap = {};
      let debitSum = 0;
      let creditSum = 0;

      // Initialize ledgerMap with ledgers data for the "Purchase Accounts" group
      ledgers
        .filter((ledger) => ledger.group === "Purchase Accounts") // Filter for "Purchase Accounts"
        .forEach((ledger) => {
          ledgerMap[ledger._id] = {
            ledgerId: ledger._id,
            name: ledger.name || "",
            group: ledger.group || "",
            openingBalance: ledger.openingBalance || 0,
            totalDebit: 0,
            totalCredit: 0,
            closingBalance: ledger.openingBalance || 0,
            entries: [],
          };
        });

      // Process each transaction
      transactions.forEach((transaction) => {
        const {
          debitLedger: debitLedgerId,
          debitLedgerName,
          debitAmount,
          creditLedger: creditLedgerId,
          creditLedgerName,
          creditAmount,
          date,
          description,
          voucherType,
          _id: transactionId, // Assume _id is the transaction ID
        } = transaction;

        const formattedDebitAmount =
          typeof debitAmount === "number" ? debitAmount : 0;
        const formattedCreditAmount =
          typeof creditAmount === "number" ? creditAmount : 0;

        // Update debit ledger if it's part of the "Purchase Accounts" group
        if (ledgerMap[debitLedgerId]) {
          ledgerMap[debitLedgerId].totalDebit += formattedDebitAmount;
          debitSum += formattedDebitAmount;
          ledgerMap[debitLedgerId].entries.push({
            date: date ? new Date(date).toLocaleDateString() : "",
            name: debitLedgerName,
            openingBalance: ledgerMap[debitLedgerId].openingBalance,
            debit: formattedDebitAmount,
            credit: 0,
            closingBalance:
              ledgerMap[debitLedgerId].openingBalance -
              ledgerMap[debitLedgerId].totalDebit +
              ledgerMap[debitLedgerId].totalCredit,
            description: description || "No description",
            ledgerId: debitLedgerId,
            transactionId,
            voucherType,
          });
        }

        // Update credit ledger if it's part of the "Purchase Accounts" group
        if (ledgerMap[creditLedgerId]) {
          ledgerMap[creditLedgerId].totalCredit += formattedCreditAmount;
          creditSum += formattedCreditAmount;
          ledgerMap[creditLedgerId].entries.push({
            date: date ? new Date(date).toLocaleDateString() : "",
            name: creditLedgerName,
            openingBalance: ledgerMap[creditLedgerId].openingBalance,
            debit: 0,
            credit: formattedCreditAmount,
            closingBalance:
              ledgerMap[creditLedgerId].openingBalance +
              ledgerMap[creditLedgerId].totalCredit -
              ledgerMap[creditLedgerId].totalDebit,
            description: description || "No description",
            ledgerId: creditLedgerId,
            transactionId,
            voucherType,
          });
        }
      });

      // Convert ledgerMap to an array of ledger details
      const groupDetails = Object.values(ledgerMap);

      setDetails(groupDetails);
      setTotalDebit(debitSum);
      setTotalCredit(creditSum);
    }
  }, [transactions, ledgers]);

  const handleRowClick = (ledgerId, transactionId, voucherType) => {
    navigate(
      `/previewAll/${voucherType
        .toLowerCase()
        .replace(/ /g, "-")}/${ledgerId}/transaction/${transactionId}`,
      { state: { preserveData: true } }
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold mb-4">
        Group Details: Purchase Accounts
      </h1>
      <div className="space-y-4">
        {details.length > 0 ? (
          <>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">Total Amounts</h2>
              <p className="text-lg">
                <strong>Total Debit:</strong>{" "}
                <span className="text-green-600">{totalDebit.toFixed(2)}</span>
              </p>
              <p className="text-lg">
                <strong>Total Credit:</strong>{" "}
                <span className="text-red-600">{totalCredit.toFixed(2)}</span>
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Opening Balance
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Debit
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Credit
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Closing Balance
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {details.map((ledger) =>
                      ledger.entries.map((entry, index) => (
                        <tr
                          key={index}
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() =>
                            handleRowClick(
                              entry.ledgerId,
                              entry.transactionId,
                              entry.voucherType
                            )
                          }
                        >
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {entry.date}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {entry.openingBalance.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {entry.name}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {entry.debit.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {entry.credit.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {Math.abs(entry.closingBalance).toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {entry.description}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No details available for this group.</p>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;
