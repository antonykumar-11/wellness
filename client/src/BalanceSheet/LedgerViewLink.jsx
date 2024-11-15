import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetExpensesQuery } from "../store/api/P&L";
import { useProfitLoss } from "../BalanceSheet/ProfitAndLossProvider";
import BalanceSheet from "../admin/BalanceSheet";
import { useGetSalesVouchersQuery } from "../store/api/SalesServiceApi";
const ProfitAndLoss = () => {
  const navigate = useNavigate();

  const { setProfitOrLoss } = useProfitLoss();

  const { data: { transactions = [], ledgers = [] } = {}, refetch } =
    useGetExpensesQuery();
  const { data: salesServiceData } = useGetSalesVouchersQuery();
  // Initializing variables to handle null or undefined data safely
  const salesService = Array.isArray(salesServiceData) ? salesServiceData : [];
  console.log("salesService", salesService);
  console.log("ledgers ledgers ", ledgers);
  // Initialize variables for totals
  let totalIndirectIncome = 0;
  let totalIndirectIncomeTax = 0;
  let totalDirectIncome = 0;
  let totalDirectIncomeTax = 0;
  let totalDirectExpenses = 0;
  let totalDirectExpensesTax = 0;
  let totalIndirectExpenses = 0;
  let totalIndirectExpensesTax = 0;
  let totalSalesAmount = 0;
  let totalSalesTax = 0;
  let totalPurchaseAmount = 0;
  let totalPurchaseTax = 0;
  let totalSalesReturnAmount = 0;
  let totalSalesReturnTax = 0;
  let totalPurchaseReturnAmount = 0;
  let totalPurchaseReturnTax = 0;
  let totalSaleServiceAmount = 0;
  let openingStock = 0;
  let closingStock = 0;
  // Initialize ledger map
  const ledgerMap = {};

  // Initialize sets for different group IDs
  const stockGroupIds = new Set();
  const taxGroupIds = new Set();
  const indirectIncomeGroupIds = new Set();
  const directIncomeGroupIds = new Set();
  const directExpenseGroupIds = new Set();
  const indirectExpenseGroupIds = new Set();
  const salesAccountGroupIds = new Set(); // Define for Sales Account
  const purchaseGroupIds = new Set(); // Define for Purchase Account
  const salesReturnGroupIds = new Set(); // Define for Sales Return
  const purchaseReturnGroupIds = new Set(); // Define for Purchase Return
  console.log("ledgerMap ", ledgerMap);
  // Map through ledgers to populate the group ID sets
  ledgers.forEach((ledger) => {
    ledgerMap[ledger._id] = {
      name: ledger.name || "",
      group: ledger.group || "",
      openingBalance: ledger.openingBalance || 0,
      totalDebit: ledger.totalDebit || 0,
      totalCredit: ledger.totalCredit || 0,
    };
    console.log("salesAccountGroupIds", salesAccountGroupIds);
    // Add group IDs based on ledger group
    switch (ledger.group) {
      case "Indirect Incomes":
        indirectIncomeGroupIds.add(ledger._id);
        break;
      case "Direct Incomes":
        directIncomeGroupIds.add(ledger._id);
        break;
      case "Direct Expenses":
        directExpenseGroupIds.add(ledger._id);
        break;
      case "Indirect Expenses":
        indirectExpenseGroupIds.add(ledger._id);
        break;
      case "Duties & Taxes":
        taxGroupIds.add(ledger._id);
        break;
      case "Stock-in-Hand":
        stockGroupIds.add(ledger._id);
        break;
      case "Sales Accounts": // Example case for Sales Accounts
        salesAccountGroupIds.add(ledger._id);
        break;
      case "Purchase Accounts": // Example case for Purchase Accounts
        purchaseGroupIds.add(ledger._id);
        break;
      case "Sales Return": // Example case for Sales Returns
        salesReturnGroupIds.add(ledger._id);
        break;
      case "Purchase Return": // Example case for Purchase Returns
        purchaseReturnGroupIds.add(ledger._id);
        break;
      case "Journal Voucher": // Example case for Purchase Returns
        purchaseReturnGroupIds.add(ledger._id);
        break;
      default:
        break;
    }
  });
  // Calculate opening stock from ledgers in stockGroupIds
  stockGroupIds.forEach((id) => {
    if (ledgerMap[id]) {
      openingStock += ledgerMap[id].openingBalance;
    }
  });

  // Process sales service items if salesService is a valid array
  if (Array.isArray(salesService)) {
    salesService.forEach((service) => {
      service.items.forEach((item) => {
        if (salesAccountGroupIds.has(item.stockGroup)) {
          totalSalesAmount += item.amount || 0;
          totalSaleServiceAmount += item.amount || 0;
        }
      });
    });
  }

  // Log results
  console.log("ledgerMap ", ledgerMap);
  console.log("Opening Stock: ", totalSaleServiceAmount);

  // Process transactions
  transactions.forEach((transaction) => {
    const { debitLedgers = [], creditLedgers = [], voucherType } = transaction;

    // Process for Receipt Voucher (Indirect Income)
    if (
      voucherType === "Receipt Voucher" ||
      voucherType === "Journal Voucher" ||
      voucherType === "Purchase Voucher"
    ) {
      let hasRelevantCredit = false;

      // Process credit ledgers for Indirect Income
      creditLedgers.forEach(({ ledgerId, amount }) => {
        const ledger = ledgerMap[ledgerId];

        if (ledger && indirectIncomeGroupIds.has(ledgerId)) {
          totalIndirectIncome += amount || 0;
          hasRelevantCredit = true;
        }
      });

      // If there was any relevant credit, process taxes
      if (hasRelevantCredit) {
        creditLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalIndirectIncomeTax += amount || 0;
          }
        });

        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalIndirectIncomeTax += amount || 0;
          }
        });
      }
    }

    // Process for Sales Voucher
    // Process for Sales Voucher
    // Process for Sales Voucher
    if (voucherType === "Sales Voucher" || voucherType === "Journal Voucher") {
      let hasSalesAccountCredit = false;
      let hasDirectIncomeCredit = false;

      // Process credit ledgers for Sales Account
      creditLedgers.forEach(({ ledgerId, amount }) => {
        console.log("salesAccountGroupIds", salesAccountGroupIds);
        const ledger = ledgerMap[ledgerId];

        // Check if ledgerId is in salesAccountGroupIds
        if (ledger && salesAccountGroupIds.has(ledgerId)) {
          totalSalesAmount += amount || 0;
          hasSalesAccountCredit = true;
        }

        // Process credit ledgers for Direct Income
        if (ledger && directIncomeGroupIds.has(ledgerId)) {
          totalDirectIncome += amount || 0;
          hasDirectIncomeCredit = true;
        }
      });

      // Process taxes if there were any sales account credits or direct income credits
      if (hasSalesAccountCredit || hasDirectIncomeCredit) {
        creditLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            if (hasSalesAccountCredit) {
              totalSalesTax += amount || 0;
            }
            if (hasDirectIncomeCredit) {
              totalDirectIncomeTax += amount || 0;
            }
          }
        });

        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            if (hasSalesAccountCredit) {
              totalSalesTax += amount || 0;
            }
            if (hasDirectIncomeCredit) {
              totalDirectIncomeTax += amount || 0;
            }
          }
        });
      }
    }

    // Process for Sales Return
    // Process for Sales Return
    if (voucherType === "Credit Note") {
      let hasSalesReturnCredit = false;

      // Calculate total sales return amount
      debitLedgers.forEach(({ ledgerId, amount }) => {
        const ledger = ledgerMap[ledgerId];

        if (ledger && salesReturnGroupIds.has(ledgerId)) {
          totalSalesReturnAmount += amount || 0;
          hasSalesReturnCredit = true;
        }
      });

      // If there's a sales return credit, calculate total sales return tax
      if (hasSalesReturnCredit) {
        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalSalesReturnTax += amount || 0;
          }
        });
      }
    }

    // Process for Purchase Voucher
    if (
      voucherType === "Purchase Voucher" ||
      voucherType === "Journal Voucher"
    ) {
      let hasPurchaseAccountDebit = false;
      let hasDirectExpenseDebit = false;

      debitLedgers.forEach(({ ledgerId, amount }) => {
        const ledger = ledgerMap[ledgerId];

        if (ledger && purchaseGroupIds.has(ledgerId)) {
          totalPurchaseAmount += amount || 0;
          hasPurchaseAccountDebit = true;
        }

        if (ledger && directExpenseGroupIds.has(ledgerId)) {
          totalDirectExpenses += amount || 0;
          hasDirectExpenseDebit = true;
        }
      });

      if (hasPurchaseAccountDebit || hasDirectExpenseDebit) {
        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalPurchaseTax += amount || 0;
          }
        });

        creditLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalPurchaseTax += amount || 0;
          }
        });
      }

      if (hasDirectExpenseDebit) {
        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalDirectExpensesTax += amount || 0;
          }
        });

        creditLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalDirectExpensesTax += amount || 0;
          }
        });
      }
    }

    // Process for Purchase Return
    if (voucherType === "Debit Note") {
      let hasPurchaseReturnDebit = false;

      creditLedgers.forEach(({ ledgerId, amount }) => {
        const ledger = ledgerMap[ledgerId];

        if (ledger && purchaseReturnGroupIds.has(ledgerId)) {
          totalPurchaseReturnAmount += amount || 0;
          hasPurchaseReturnDebit = true;
        }
      });

      if (hasPurchaseReturnDebit) {
        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];

          if (ledger && taxGroupIds.has(ledgerId)) {
            totalPurchaseReturnTax += amount || 0;
          }
        });

        creditLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalPurchaseReturnTax += amount || 0;
          }
        });
      }
    }

    // Process for Payment Voucher
    if (
      voucherType === "Payment Voucher" ||
      voucherType === "PayMaster" ||
      voucherType === "Purchase Voucher" ||
      voucherType === "Journal Voucher"
    ) {
      let hasIndirectExpenseDebit = false;

      debitLedgers.forEach(({ ledgerId, amount }) => {
        const ledger = ledgerMap[ledgerId];

        if (ledger && indirectExpenseGroupIds.has(ledgerId)) {
          totalIndirectExpenses += amount || 0;
          hasIndirectExpenseDebit = true;
        }
      });

      if (hasIndirectExpenseDebit) {
        debitLedgers.forEach(({ ledgerId, amount }) => {
          const ledger = ledgerMap[ledgerId];
          if (ledger && taxGroupIds.has(ledgerId)) {
            totalIndirectExpensesTax += amount || 0;
          }
        });
      }
    }
  });
  // Fetch data on mount
  useEffect(() => {
    refetch();
  }, [refetch]);
  console.log("ledger", totalIndirectExpenses);
  let adjustedOpeningStock = openingStock;
  let adjustedTotalPurchase = totalPurchaseAmount - totalPurchaseTax;
  let totalPurchaseReturn = totalPurchaseReturnAmount - totalPurchaseReturnTax;
  let totalDirectExpensess = totalDirectExpenses - totalDirectExpensesTax;
  let totalDebit =
    adjustedOpeningStock +
    adjustedTotalPurchase -
    totalPurchaseReturn +
    totalDirectExpensess;
  let totalSales = totalSalesAmount - totalSalesTax;
  let totalSalesReturn = totalSalesReturnAmount - totalSalesReturnTax;
  let totalDirectIncomes = totalDirectIncome - totalDirectIncomeTax;
  let totalCredit =
    totalSales - totalSalesReturn + totalDirectIncomes + closingStock;
  console.log("totalSales", totalSales);
  let grossProfit = totalCredit - totalDebit;
  let totalIndirectExpensess = totalIndirectExpenses - totalIndirectExpensesTax;
  console.log("totalIndirectIncomeTax", totalIndirectExpenses);
  let totalIndirectIncomes = totalIndirectIncome - totalIndirectIncomeTax;
  let netProfit = grossProfit + totalIndirectIncomes - totalIndirectExpensess;
  console.log("hai", netProfit);
  <BalanceSheet netProfit={netProfit} />;
  useEffect(() => {
    setProfitOrLoss(netProfit);
  }, [netProfit, setProfitOrLoss]);
  // TradingAccount.js

  // Click handler to redirect
  const handlePurchaseClick = () => {
    navigate(`/reports/purchasereport`);
  };

  const handleIndirectExpenses = (groupName) => {
    navigate(`/admin/group-detail/${groupName}`); // Navigate to the details page
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen dark:bg-gray-700 dark:text-gray-200">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center dark:bg-gray-700 dark:text-gray-200">
        Profit and Loss Account
      </h1>
      <div className="flex flex-col md:flex-row dark:bg-gray-700 dark:text-gray-200">
        {/* Debit Side */}
        <div className="flex-1 mb-4 md:mb-0 dark:bg-gray-700 dark:text-gray-2000">
          <h2 className="text-xl font-semibold text-blue-600 mb-2 dark:bg-gray-700 dark:text-gray-200">
            Debit Side
          </h2>
          <div className="bg-white shadow-md rounded-lg p-4 dark:bg-gray-700 dark:text-gray-200">
            <ul className="space-y-2 dark:bg-gray-700 dark:text-gray-200">
              <li className="flex justify-between cursor-pointer dark:bg-gray-700 dark:text-gray-200">
                <span>Opening Stock</span>
                <span className="font-semibold dark:bg-gray-700 dark:text-gray-200">
                  {adjustedOpeningStock}
                </span>
              </li>
              <li
                className="flex justify-between cursor-pointer dark:bg-gray-700 dark:text-gray-200"
                onClick={() => handleIndirectExpenses("Purchase Accounts")}
              >
                <span>Purchase Accounts</span>
                <span className="font-semibold dark:bg-gray-700 dark:text-gray-200">
                  {adjustedTotalPurchase.toFixed(2)}
                </span>
              </li>
              <li
                className="flex justify-between cursor-pointer dark:bg-gray-700 dark:text-gray-200"
                onClick={() => handleIndirectExpenses("Purchase Return")}
              >
                <span>Purchase Return</span>
                <span className="font-semibold dark:bg-gray-700 dark:text-gray-200">
                  {totalPurchaseReturn.toFixed(2)}
                </span>
              </li>
              <li
                className="flex justify-between cursor-pointer dark:bg-gray-700 dark:text-gray-200"
                onClick={() => handleIndirectExpenses("Direct Expenses")}
              >
                <span>Direct Expenses</span>
                <span className="font-semibold">
                  {totalDirectExpensess.toFixed(2)}
                </span>
              </li>

              <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2 dark:bg-gray-700 dark:text-gray-200">
                <span>Total Debit</span>
                <span>{totalDebit.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Credit Side */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-blue-600 mb-2 dark:bg-gray-700 dark:text-gray-200">
            Credit Side
          </h2>
          <div className="bg-white shadow-md rounded-lg p-4 dark:bg-gray-700 dark:text-gray-200">
            <ul className="space-y-2">
              <li
                className="flex justify-between cursor-pointer dark:bg-gray-700 dark:text-gray-200"
                onClick={() => handleIndirectExpenses("Sales Accounts")}
              >
                <span>Sales Accounts</span>
                <span className="font-semibold dark:bg-gray-700 dark:text-gray-200">
                  {totalSales.toFixed(2)}
                </span>
              </li>
              <li
                className="flex justify-between cursor-pointer dark:bg-gray-700 dark:text-gray-200"
                onClick={() => handleIndirectExpenses("Sales Return")}
              >
                <span>Sales Return</span>
                <span className="font-semibold dark:bg-gray-700 dark:text-gray-200">
                  {totalSalesReturn.toFixed(2)}
                </span>
              </li>
              <li
                className="flex justify-between cursor-pointer dark:bg-gray-700 dark:text-gray-200"
                onClick={() => handleIndirectExpenses("Direct Incomes")}
              >
                <span>Direct Income</span>
                <span className="font-semibold dark:bg-gray-700 dark:text-gray-200">
                  {totalDirectIncomes.toFixed(2)}
                </span>
              </li>
              <li className="flex justify-between dark:bg-gray-700 dark:text-gray-200">
                <span>Closing Stock</span>
                <span className="font-semibold dark:bg-gray-700 dark:text-gray-200">
                  0.00
                </span>
              </li>
              <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2 dark:bg-gray-700 dark:text-gray-200">
                <span>Total Credit</span>
                <span>{totalCredit.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Gross Profit / Loss */}
      <div className="mt-6 dark:bg-gray-700 dark:text-gray-200">
        <div className="bg-white shadow-md rounded-lg p-4 dark:bg-gray-700 dark:text-gray-200">
          <div className="flex justify-between font-semibold dark:bg-gray-700 dark:text-gray-200">
            <span>Gross Profit / Loss</span>
            <span
              className={grossProfit >= 0 ? "text-green-600" : "text-red-600"}
            >
              {grossProfit.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      {/* Indirect Expenses and Income */}
      <div className="flex flex-col md:flex-row mt-6 dark:bg-gray-700 dark:text-gray-200">
        {/* Indirect Expenses */}
        <div className="flex-1 mb-4 md:mb-0 dark:bg-gray-700 dark:text-gray-200">
          <h2 className="text-xl font-semibold text-blue-600 mb-2 dark:bg-gray-700 dark:text-gray-200">
            Indirect Expenses
          </h2>
          <div className="bg-white shadow-md rounded-lg p-4 dark:bg-gray-700 dark:text-gray-200">
            <ul className="space-y-2 dark:bg-gray-700 dark:text-gray-200">
              <li
                className="flex justify-between cursor-pointer dark:bg-gray-700 dark:text-gray-200"
                onClick={() => handleIndirectExpenses("Indirect Expenses")}
              >
                <span>Indirect Expenses</span>
                <span className="font-semibold dark:bg-gray-700 dark:text-gray-200">
                  {totalIndirectExpensess.toFixed(2)}
                </span>
              </li>

              <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2 dark:bg-gray-700 dark:text-gray-200">
                <span>Total Debit</span>
                <span>{totalIndirectExpensess.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Indirect Income */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-blue-600 mb-2 dark:bg-gray-700 dark:text-gray-200">
            Indirect Income
          </h2>
          <div className="bg-white shadow-md rounded-lg p-4 dark:bg-gray-700 dark:text-gray-200">
            <ul className="space-y-2 dark:bg-gray-700 dark:text-gray-200">
              <li
                className="flex justify-between cursor-pointer dark:bg-gray-700 dark:text-gray-200"
                onClick={() => handleIndirectExpenses("Indirect Incomes")}
              >
                <span>Indirect Income</span>
                <span className="font-semibold">
                  {totalIndirectIncomes.toFixed(2)}
                </span>
              </li>
              <li className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2 dark:bg-gray-700 dark:text-gray-200">
                <span>Total Credit</span>
                <span>{totalIndirectIncomes.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Net Profit / Loss */}
      <div className="mt-6 dark:bg-gray-700 dark:text-gray-200">
        <div className="bg-white shadow-md rounded-lg p-4 dark:bg-gray-700 dark:text-gray-200">
          <div className="flex justify-between font-semibold dark:bg-gray-700 dark:text-gray-200">
            <span>Net Profit / Loss</span>
            <span
              className={netProfit >= 0 ? "text-green-600" : "text-red-600"}
            >
              {netProfit.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitAndLoss;
