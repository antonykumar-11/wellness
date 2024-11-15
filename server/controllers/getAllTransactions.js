const Payment = require("../models/paymentSchema");
const SalesVoucher = require("../models/salesSchema");
const ReceiptVoucher = require("../models/recieptVoucherSchema");
const PurchaseVoucher = require("../models/purchaseScheema");
const JournalVoucher = require("../models/journalSchema");
const DebitNote = require("../models/debitNoteSchema");
const CreditNote = require("../models/creditNoteSchema");
const ContraVoucher = require("../models/contaSchema.js");

const getAllTransactions = async () => {
  try {
    // Fetch transactions from each model
    const payments = await Payment.find({});
    const sales = await SalesVoucher.find({});
    const receipts = await ReceiptVoucher.find({});
    const purchases = await PurchaseVoucher.find({});
    const journals = await JournalVoucher.find({});
    const debitNotes = await DebitNote.find({});
    const creditNotes = await CreditNote.find({});
    const contraVouchers = await ContraVoucher.find({});

    // Combine all transactions into a single array
    const allTransactions = [
      ...payments,
      ...sales,
      ...receipts,
      ...purchases,
      ...journals,
      ...debitNotes,
      ...creditNotes,
      ...contraVouchers,
    ];

    return allTransactions;
  } catch (error) {
    throw new Error(`Error fetching transactions: ${error.message}`);
  }
};

const getAllTransactionsHandler = async (req, res) => {
  try {
    const transactions = await getAllTransactions();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllTransactions,
  getAllTransactionsHandler,
};
