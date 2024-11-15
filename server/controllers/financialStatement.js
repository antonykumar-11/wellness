const calculateTradingAccount = async () => {
  try {
    // Fetch relevant ledger entries from Ledger schema
    const sales = await Ledger.find({ group: "Sales Accounts" });
    const purchases = await Ledger.find({ group: "Purchase Account" });

    // Fetch relevant ledger entries from LedgerSecondary schema
    const secondarySales = await LedgerSecondary.find({
      group: "Sales Account",
    });
    const secondaryPurchases = await LedgerSecondary.find({
      group: "Purchase Account",
    });

    // Calculate total sales and purchases from Ledger schema
    const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPurchases = purchases.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    // Calculate total sales and purchases from LedgerSecondary schema
    const totalSecondarySales = secondarySales.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    const totalSecondaryPurchases = secondaryPurchases.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    // Calculate gross profit including both Ledger and LedgerSecondary entries
    const grossProfit =
      totalSales +
      totalSecondarySales -
      totalPurchases -
      totalSecondaryPurchases;

    return {
      totalSales: totalSales + totalSecondarySales, // Include secondary sales in total sales
      totalPurchases: totalPurchases + totalSecondaryPurchases, // Include secondary purchases in total purchases
      grossProfit,
    };
  } catch (error) {
    throw new Error(`Error calculating Trading Account: ${error.message}`);
  }
};

module.exports = {
  calculateTradingAccount,
};

const calculateProfitLossAccount = async () => {
  try {
    // Fetch relevant ledger entries from Ledger schema
    const sales = await Ledger.find({ group: "Sales Account" });
    const purchases = await Ledger.find({ group: "Purchase Account" });
    const expenses = await Ledger.find({ type: "Indirect-Expenses" });

    // Fetch relevant ledger entries from LedgerSecondary schema
    const secondaryExpenses = await LedgerSecondary.find({
      type: "Indirect-Expenses",
    });

    // Calculate total sales, purchases, and expenses from Ledger schema
    const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPurchases = purchases.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    // Calculate total expenses from LedgerSecondary schema
    const totalSecondaryExpenses = secondaryExpenses.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    // Calculate net profit
    const netProfit =
      totalSales - totalPurchases - totalExpenses - totalSecondaryExpenses;

    // Prepare detailed items for affected items in balance sheet
    const affectedItems = {
      sales: sales.map((entry) => ({ name: entry.name, amount: entry.amount })),
      purchases: purchases.map((entry) => ({
        name: entry.name,
        amount: entry.amount,
      })),
      expenses: expenses.map((entry) => ({
        name: entry.name,
        amount: entry.amount,
      })),
      secondaryExpenses: secondaryExpenses.map((entry) => ({
        name: entry.name,
        amount: entry.amount,
      })),
    };

    return {
      totalSales,
      totalPurchases,
      totalExpenses: totalExpenses + totalSecondaryExpenses, // Include secondary expenses in total expenses
      netProfit,
      affectedItems,
    };
  } catch (error) {
    throw new Error(
      `Error calculating Profit and Loss Account: ${error.message}`
    );
  }
};

module.exports = {
  calculateProfitLossAccount,
};

const Ledger = require("../models/ledgerSchema");

const LedgerSecondary = require("../models/LedgerSchemaSecondary");

const calculateBalanceSheet = async () => {
  try {
    // Fetch relevant ledger entries from Ledger schema
    const currentAssets = await Ledger.find({ type: "Current Asset" });
    const fixedAssets = await Ledger.find({ group: "Fixed Assets" });
    const currentLiabilities = await Ledger.find({
      group: "Current Liabilities",
    });
    const longTermLiabilities = await Ledger.find({
      group: "Long Term Liabilities",
    });
    const capital = await Ledger.find({ group: "Capital Account" });
    const retainedEarnings = await Ledger.find({ group: "Reserves & Surplus" });

    // Fetch relevant ledger entries from LedgerSecondary schema
    const sundryDebtors = await LedgerSecondary.find({
      group: "Sundry Debtors",
    });
    const sundryCreditors = await LedgerSecondary.find({
      group: "Sundry Creditors",
    });

    // Calculate totals for each category from Ledger schema
    const totalCurrentAssets = currentAssets.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    const totalFixedAssets = fixedAssets.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    const totalCurrentLiabilities = currentLiabilities.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    const totalLongTermLiabilities = longTermLiabilities.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    const totalCapital = capital.reduce((acc, curr) => acc + curr.amount, 0);
    const totalRetainedEarnings = retainedEarnings.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    // Calculate totals for each category from LedgerSecondary schema
    const totalSundryDebtors = sundryDebtors.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    const totalSundryCreditors = sundryCreditors.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    // Prepare Balance Sheet data including all items
    const balanceSheet = {
      currentAssets: {
        total: totalCurrentAssets,
        items: currentAssets.map((asset) => ({
          name: asset.name,
          amount: asset.amount,
        })),
      },
      fixedAssets: {
        total: totalFixedAssets,
        items: fixedAssets.map((asset) => ({
          name: asset.name,
          amount: asset.amount,
        })),
      },
      currentLiabilities: {
        total: totalCurrentLiabilities,
        items: currentLiabilities.map((liability) => ({
          name: liability.name,
          amount: liability.amount,
        })),
      },
      longTermLiabilities: {
        total: totalLongTermLiabilities,
        items: longTermLiabilities.map((liability) => ({
          name: liability.name,
          amount: liability.amount,
        })),
      },
      capital: {
        total: totalCapital,
        items: capital.map((capital) => ({
          name: capital.name,
          amount: capital.amount,
        })),
      },
      retainedEarnings: {
        total: totalRetainedEarnings,
        items: retainedEarnings.map((earnings) => ({
          name: earnings.name,
          amount: earnings.amount,
        })),
      },
      sundryDebtors: {
        total: totalSundryDebtors,
        items: sundryDebtors.map((debtor) => ({
          name: debtor.name,
          amount: debtor.amount,
        })),
      },
      sundryCreditors: {
        total: totalSundryCreditors,
        items: sundryCreditors.map((creditor) => ({
          name: creditor.name,
          amount: creditor.amount,
        })),
      },
    };

    return balanceSheet;
  } catch (error) {
    throw new Error(`Error calculating Balance Sheet: ${error.message}`);
  }
};

module.exports = {
  calculateBalanceSheet,
};

module.exports = {
  calculateBalanceSheet,
};

module.exports = {
  calculateTradingAccount,
  calculateProfitLossAccount,
  calculateBalanceSheet,
};
