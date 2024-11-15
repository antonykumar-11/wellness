// src/processJournalEntries.js

export const processJournalEntries = (journalEntries) => {
  const ledgerAccounts = {};

  journalEntries.forEach((entry) => {
    const { date, particulars, debit, credit, ledger } = entry;

    if (!ledgerAccounts[ledger]) {
      ledgerAccounts[ledger] = [];
    }

    ledgerAccounts[ledger].push({
      date,
      particulars,
      debit,
      credit,
      balance: 0, // This will be calculated later
    });
  });

  return ledgerAccounts;
};

export default processJournalEntries;
