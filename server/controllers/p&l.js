const SalesVoucher = require("../models/salesSchema");

const PurchaseVoucher = require("../models/purchaseScheema");
const Ledger = require("../models/ledgerSchema");
const SaleVoucher = require("../models/salesSchema");
const Payment = require("../models/paymentSchema");
const ReceiptVoucher = require("../models/recieptVoucherSchema");
const JournalVoucher = require("../models/journalSchema");
const DebitNote = require("../models/debitNoteSchema");
const CreditNote = require("../models/creditNoteSchema");
const ContraVoucher = require("../models/contaSchema.js");
const PayHeadDetailsModel = require("../models/staffmodel/payHeadDetailsSchema");
const PayMaster = require("../models/staffmodel/payMaster");

const getAllTransactionssinsle = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all related vouchers and ledgers for the logged-in user
    const [
      purchaseVouchers,
      saleVouchers,
      payments,
      receipts,
      journals,
      debitNotes,
      creditNotes,
      contraVouchers,
      PayMasters,
      ledgers,
    ] = await Promise.all([
      PurchaseVoucher.find({ owner: userId }),
      SaleVoucher.find({ owner: userId }),
      Payment.find({ owner: userId }),
      ReceiptVoucher.find({ owner: userId }),
      JournalVoucher.find({ owner: userId }),
      DebitNote.find({ owner: userId }),
      CreditNote.find({ owner: userId }),
      ContraVoucher.find({ owner: userId }),
      PayMaster.find({ owner: userId }),
      Ledger.find({ owner: userId }),
    ]);

    let totalPurchaseAmount = 0;
    let totalPurchaseTax = 0;
    let totalSalesAmount = 0;
    let totalSalesTax = 0;
    let totalIndirectreturnAmount = 0;
    let totalIndirectreturnTax = 0;

    // Additional variables for the new categories
    let totalDirectIncome = 0;
    let totalIndirectIncome = 0;
    let totalDirectExpense = 0;
    let totalIndirectExpense = 0;
    let totalIndirectExpenseTax = 0;
    let totalSalesReturn = 0;
    let totalPurchaseReturn = 0;
    let totalPurchaseReturnTax = 0; // Variable to hold total purchase return tax
    let totalSalesReturnTax = 0; // Variable to hold total sales return tax
    // Initialize sets for different group IDs
    const purchaseGroupIds = new Set();
    const taxGroupIds = new Set();
    const salesGroupIds = new Set();
    const directIncomeGroupIds = new Set();
    const indirectIncomeGroupIds = new Set();
    const directExpenseGroupIds = new Set();
    const indirectExpenseGroupIds = new Set();
    const salesReturnGroupIds = new Set();
    const purchaseReturnGroupIds = new Set();
    const indirectPurchaseReturnGroupIds = new Set();
    // Populate group IDs based on ledgers
    ledgers.forEach((ledger) => {
      switch (ledger.group.trim()) {
        case "Duties & Taxes":
          taxGroupIds.add(ledger._id.toString());
          break;
        case "Purchase Accounts":
          purchaseGroupIds.add(ledger._id.toString());
          break;
        case "Sales Accounts":
          salesGroupIds.add(ledger._id.toString());
          break;
        case "Direct Incomes":
          directIncomeGroupIds.add(ledger._id.toString());
          break;
        case "Indirect Incomes":
          indirectIncomeGroupIds.add(ledger._id.toString());
          break;
        case "Direct Expenses":
          directExpenseGroupIds.add(ledger._id.toString());
          break;
        case "Indirect Expenses":
          indirectExpenseGroupIds.add(ledger._id.toString());
          break;
        case "Sales Return":
          salesReturnGroupIds.add(ledger._id.toString());
          break;
        case "Purchase Return":
          purchaseReturnGroupIds.add(ledger._id.toString());
          break;
        case "Indirect Purchase Return":
          indirectPurchaseReturnGroupIds.add(ledger._id.toString());
          break;
        default:
          break;
      }
    });

    // Process purchase vouchers to calculate total amounts

    purchaseVouchers.forEach((voucher) => {
      const { debitLedgers = [] } = voucher;

      debitLedgers.forEach(({ ledgerId, amount }) => {
        const ledgerIdStr = ledgerId.toString(); // Define ledgerIdStr

        if (purchaseGroupIds.has(ledgerIdStr)) {
          totalPurchaseAmount += amount || 0; // Sum total purchase amount
        }
        if (taxGroupIds.has(ledgerIdStr) && purchaseGroupIds.has(ledgerIdStr)) {
          totalPurchaseTax += amount || 0; // Sum total tax
        }
      });
    });

    console.log("purchaseReturnGroupIds", purchaseReturnGroupIds);

    // Process sale vouchers to calculate total amounts
    saleVouchers.forEach((voucher) => {
      const { creditLedgers = [] } = voucher;

      creditLedgers.forEach(({ ledgerId, amount }) => {
        if (salesGroupIds.has(ledgerId.toString())) {
          totalSalesAmount += amount || 0;
        }
        if (taxGroupIds.has(ledgerId.toString())) {
          totalSalesTax += amount || 0;
        }
        if (salesReturnGroupIds.has(ledgerId.toString())) {
          totalSalesReturn += amount || 0;
        }
        if (directIncomeGroupIds.has(ledgerId.toString())) {
          totalDirectIncome += amount || 0;
        }
      });
    });

    // Process payments to calculate total direct and indirect expenses
    payments.forEach((payment) => {
      const { creditLedgers = [] } = payment;

      creditLedgers.forEach(({ ledgerId, amount }) => {
        if (directExpenseGroupIds.has(ledgerId.toString())) {
          totalDirectExpense += amount || 0;
        }
        if (indirectExpenseGroupIds.has(ledgerId.toString())) {
          totalIndirectExpense += amount || 0;
        }
      });
    });

    // Process purchase vouchers to calculate total direct expenses from debit ledgers
    purchaseVouchers.forEach((voucher) => {
      const { debitLedgers = [] } = voucher;

      debitLedgers.forEach(({ ledgerId, amount }) => {
        if (directExpenseGroupIds.has(ledgerId.toString())) {
          totalDirectExpense += amount || 0; // Add to total direct expense
        }
        // If you also want to track indirect expenses from purchase vouchers
        if (indirectExpenseGroupIds.has(ledgerId.toString())) {
          totalIndirectExpense += amount || 0; // Add to total indirect expense if needed
        }
        if (taxGroupIds.has(ledgerId.toString())) {
          totalIndirectExpenseTax += amount || 0;
        }
      });
    });

    // Process receipts to calculate direct and indirect income (from creditLedgers)
    receipts.forEach((receipt) => {
      const { creditLedgers = [] } = receipt;

      creditLedgers.forEach(({ ledgerId, amount }) => {
        if (directIncomeGroupIds.has(ledgerId.toString())) {
          totalDirectIncome += amount || 0;
        }
        if (indirectIncomeGroupIds.has(ledgerId.toString())) {
          totalIndirectIncome += amount || 0;
        }
      });
    });
    saleVouchers.forEach((receipt) => {
      const { debitLedgers = [] } = receipt;

      debitLedgers.forEach(({ ledgerId, amount }) => {
        if (directIncomeGroupIds.has(ledgerId.toString())) {
          totalDirectIncome += amount || 0;
        }
        if (indirectIncomeGroupIds.has(ledgerId.toString())) {
          totalIndirectIncome += amount || 0;
        }
      });
    });

    // Process journal vouchers to calculate direct and indirect income (from creditLedgers)
    journals.forEach((journalVoucher) => {
      const { creditLedgers = [] } = journalVoucher;

      // Process credit ledgers for income calculations
      creditLedgers.forEach(({ ledgerId, amount }) => {
        if (directIncomeGroupIds.has(ledgerId.toString())) {
          totalDirectIncome += amount || 0;
        }
        if (indirectIncomeGroupIds.has(ledgerId.toString())) {
          totalIndirectIncome += amount || 0;
        }
      });
    });
    PayMasters.forEach((PayMaster) => {
      const { debitLedgers = [] } = PayMaster;

      // Process debit ledgers for expense calculations
      debitLedgers.forEach(({ ledgerId, amount }) => {
        if (directExpenseGroupIds.has(ledgerId.toString())) {
          totalDirectExpense += amount || 0;
        }
        if (indirectExpenseGroupIds.has(ledgerId.toString())) {
          totalIndirectExpense += amount || 0;
        }
      });
    });

    // Process journal vouchers to calculate direct and indirect expenses (from debitLedgers)
    journals.forEach((journalVoucher) => {
      const { debitLedgers = [] } = journalVoucher;

      // Process debit ledgers for expense calculations
      debitLedgers.forEach(({ ledgerId, amount }) => {
        if (directExpenseGroupIds.has(ledgerId.toString())) {
          totalDirectExpense += amount || 0;
        }
        if (indirectExpenseGroupIds.has(ledgerId.toString())) {
          totalIndirectExpense += amount || 0;
        }
      });
    });
    // Process debit notes to calculate total purchase returns and their taxes
    debitNotes.forEach((debitNote) => {
      const { creditLedgers = [], voucherType } = debitNote; // Assuming debit ledgers hold return details

      // Loop through each credit ledger in the debit note
      creditLedgers.forEach(({ ledgerId, amount }) => {
        if (purchaseReturnGroupIds.has(ledgerId.toString())) {
          totalPurchaseReturn += amount || 0; // Sum total purchase return
        }
        if (indirectPurchaseReturnGroupIds.has(ledgerId.toString())) {
          totalIndirectreturnAmount += amount || 0; // Sum total indirect purchase return
        }
        if (taxGroupIds.has(ledgerId.toString())) {
          totalPurchaseReturnTax += amount || 0; // Sum tax amount on the purchase return
        }
        if (
          taxGroupIds.has(ledgerId.toString()) &&
          voucherType === "Indirect Debit Note"
        ) {
          totalIndirectreturnTax += amount || 0; // Sum tax amount on the purchase return only for 'Indirect Debit Note'
        }
      });
    });

    // Check if ledger ID is part of tax groups

    // Process credit notes to calculate total sales returns and their taxes
    // Process credit notes to calculate total sales returns and their taxes
    creditNotes.forEach((creditNote) => {
      const { debitLedgers = [], creditLedgers = [] } = creditNote; // Defaults to empty arrays if not present

      // Calculate total sales returns from credit ledgers
      debitLedgers.forEach(({ ledgerId, amount = 0 }) => {
        // Check if the ledger ID is part of the sales return group
        if (salesReturnGroupIds.has(ledgerId.toString())) {
          totalSalesReturn += amount; // Accumulate total sales return
        }
      });

      // Calculate total sales return tax from debit ledgers
      debitLedgers.forEach(({ ledgerId, amount = 0 }) => {
        // Check if the ledger ID is part of the tax groups
        if (taxGroupIds.has(ledgerId.toString())) {
          totalSalesReturnTax += amount; // Accumulate total sales return tax
        }
      });
    });

    // Add similar processing for debitNotes, creditNotes, contraVouchers as needed
    console.log("totalIndirectExpenseTax", totalIndirectExpenseTax);
    // Return the calculated values
    return res.status(200).json({
      totalPurchaseAmount,
      totalPurchaseTax,
      totalSalesAmount,
      totalSalesTax,
      totalDirectIncome,
      totalIndirectIncome,
      totalDirectExpense,
      totalIndirectExpense,
      totalIndirectExpenseTax,
      totalSalesReturn,
      totalPurchaseReturn,
      totalPurchaseReturnTax,
      totalSalesReturnTax,
      totalIndirectreturnAmount,
      totalIndirectreturnTax,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving transactions" });
  }
};
const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user._id; // Get the owner's ID from the request
    console.log("userId", userId);
    // Fetch all vouchers and notes for the logged-in user
    const [
      purchaseVouchers,
      debitNotes,
      paymentVouchers,
      salesVouchers,
      receiptVouchers,
      journalVouchers,
      creditNotes,
      contraVouchers,
      paymasterVouchers,
      ledgers,
    ] = await Promise.all([
      PurchaseVoucher.find({ owner: userId }),
      DebitNote.find({ owner: userId }),
      Payment.find({ owner: userId }),
      SalesVoucher.find({ owner: userId }),
      ReceiptVoucher.find({ owner: userId }),
      JournalVoucher.find({ owner: userId }),
      CreditNote.find({ owner: userId }),
      ContraVoucher.find({ owner: userId }),
      PayMaster.find({ owner: userId }),
      Ledger.find({ owner: userId }),
    ]);

    // Create a ledger map for quick lookup
    const ledgerMap = new Map(
      ledgers.map((ledger) => [ledger._id.toString(), ledger])
    );

    // Helper function to process transactions
    const processTransaction = (transaction, transactionType) => {
      const processLedgers = (ledgers) =>
        (ledgers || []).map((entry) => {
          const ledger = ledgerMap.get(entry.ledgerId.toString());
          return {
            ledgerId: entry.ledgerId,
            ledgerName: ledger ? ledger.name : "Unknown",
            amount: entry.amount,
            _id: entry._id,
          };
        });

      return {
        ...transaction.toObject(),
        debitLedgers: processLedgers(transaction.debitLedgers),
        creditLedgers: processLedgers(transaction.creditLedgers),
        transactionType,
      };
    };

    // Process all vouchers and notes
    const allTransactions = [
      ...purchaseVouchers.map((voucher) =>
        processTransaction(voucher, "Purchase Voucher")
      ),
      ...debitNotes.map((note) => processTransaction(note, "Debit Note")),
      ...paymentVouchers.map((voucher) =>
        processTransaction(voucher, "Payment Voucher")
      ),
      ...salesVouchers.map((voucher) =>
        processTransaction(voucher, "Sales Voucher")
      ),
      ...receiptVouchers.map((voucher) =>
        processTransaction(voucher, "Receipt Voucher")
      ),
      ...journalVouchers.map((voucher) =>
        processTransaction(voucher, "Journal Voucher")
      ),
      ...creditNotes.map((note) => processTransaction(note, "Credit Note")),
      ...contraVouchers.map((voucher) =>
        processTransaction(voucher, "Contra Voucher")
      ),
      ...paymasterVouchers.map((voucher) =>
        processTransaction(voucher, "PayMaster Voucher")
      ),
    ];

    // Send response with combined transactions
    res.status(200).json({ transactions: allTransactions, ledgers });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports = {
  getAllTransactionssinsle,
  getAllTransactions,
};
