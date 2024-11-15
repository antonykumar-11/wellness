// src/calculateLedgerBalances.js

const calculateLedgerBalances = (ledgers = [], transactions = []) => {
  const ledgerBalances = {};

  // Initialize ledger balances with opening balances
  ledgers.forEach((ledger) => {
    ledgerBalances[ledger.name] = {
      openingBalance: parseFloat(ledger.openingBalance) || 0,
      transactions: [],
      balance: parseFloat(ledger.openingBalance) || 0,
      nature: ledger.nature,
    };
  });

  // Process transactions
  transactions.forEach((transaction) => {
    const debitLedgerName = transaction.debitLedgerName;
    const creditLedgerName = transaction.creditLedgerName;
    const debitAmount = parseFloat(transaction.debitAmount) || 0;
    const creditAmount = parseFloat(transaction.creditAmount) || 0;

    if (ledgerBalances[debitLedgerName]) {
      ledgerBalances[debitLedgerName].transactions.push({
        date: transaction.date,
        particulars: transaction.voucherNumber,
        debit: debitAmount,
        credit: null,
        balance: ledgerBalances[debitLedgerName].balance + debitAmount,
      });
      ledgerBalances[debitLedgerName].balance += debitAmount;
    }

    if (ledgerBalances[creditLedgerName]) {
      ledgerBalances[creditLedgerName].transactions.push({
        date: transaction.date,
        particulars: transaction.voucherNumber,
        debit: null,
        credit: creditAmount,
        balance: ledgerBalances[creditLedgerName].balance - creditAmount,
      });
      ledgerBalances[creditLedgerName].balance -= creditAmount;
    }
  });

  // Ensure the balance nature is correctly represented
  Object.keys(ledgerBalances).forEach((ledgerName) => {
    const ledger = ledgerBalances[ledgerName];
    ledger.nature =
      ledger.balance >= 0
        ? ledger.nature
        : ledger.nature === "Credit"
        ? "Debit"
        : "Credit";
    ledger.balance = Math.abs(ledger.balance);
  });

  return ledgerBalances;
};

export default calculateLedgerBalances;
