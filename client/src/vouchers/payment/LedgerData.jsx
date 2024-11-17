// ledgerData.js

export const groups = [
  "Capital Account",
  "Current Assets",
  "Current Liabilities",
  "Bank Accounts",
  "Cash-in-Hand",
  "Sundry Debtors",
  "Purchase Return",
  "Sundry Creditors",
  "Direct Incomes",
  "Indirect Incomes",
  "Direct Expenses",
  "Indirect Expenses",
  "Duties & Taxes",
  "Provisions",
  "Loans & Advances (Asset)",
  "Sales Accounts",
  "Purchase Accounts",
  "Loans (Liability)",
  "Sales Return",
  "Stock-in-Hand",
  "Indirect Purchase Return",
];

// export const groupTypes = {
//   "Capital Account": { type: "Equity", nature: "Credit" },
//   "Current Assets": { type: "Assets", nature: "Debit" },
//   "Loans (Liability)": { type: "Liabilities", nature: "Credit" },
//   "Current Liabilities": { type: "Liabilities", nature: "Credit" },

//   "Sales Accounts": { type: "Income", nature: "Credit" },
//   "Purchase Accounts": { type: "Expenses", nature: "Debit" },
//   "Direct Incomes": { type: "Income", nature: "Credit" },
//   "Indirect Incomes": { type: "Income", nature: "Credit" },
//   "Direct Expenses": { type: "Expenses", nature: "Debit" },
//   "Indirect Expenses": { type: "Expenses", nature: "Debit" },
//   "Sundry Creditors": { type: "Liabilities", nature: "Credit" },
//   "Sundry Debtors": { type: "Assets", nature: "Debit" },
//   "Cash-in-Hand": { type: "Assets", nature: "Debit" },
//   "Bank Accounts": { type: "Assets", nature: "Debit" },

//   "Duties & Taxes": { type: "Liabilities", nature: "Credit" },
//   Provisions: { type: "Liabilities", nature: "Credit" },
//   "Loans & Advances (Asset)": { type: "Assets", nature: "Debit" },
// };

export const groupTypes = {
  "Capital Account": { type: "Equity", nature: "Credit" },
  "Current Assets": { type: "Assets", nature: "Debit" },
  "Loans (Liability)": { type: "Liabilities", nature: "Credit" },
  "Current Liabilities": { type: "Liabilities", nature: "Credit" },

  "Sales Accounts": { type: "Income", nature: "Credit" },
  "Purchase Accounts": { type: "Expenses", nature: "Debit" },
  "Direct Incomes": { type: "Income", nature: "Credit" },
  "Indirect Incomes": { type: "Income", nature: "Credit" },
  "Direct Expenses": { type: "Expenses", nature: "Debit" },
  "Indirect Expenses": { type: "Expenses", nature: "Debit" },
  "Sundry Creditors": { type: "Liabilities", nature: "Credit" },
  "Sundry Debtors": { type: "Assets", nature: "Debit" },
  "Cash-in-Hand": { type: "Assets", nature: "Debit" },
  "Bank Accounts": { type: "Assets", nature: "Debit" },
  "Sales Return": { type: "Income", nature: "Debit" },
  "Purchase Return": { type: "Expenses", nature: "Credit" },
  "Indirect Purchase Return": { type: "Expenses", nature: "Credit" },
  "Duties & Taxes": { type: "Liabilities", nature: "Credit" },
  Provisions: { type: "Liabilities", nature: "Credit" },
  "Loans & Advances (Asset)": { type: "Assets", nature: "Debit" },
  "Stock-in-Hand": { type: "Assets", nature: "Debit" },
  // New entries for Sales Return and Purchase Return
};
