// const Payment = require("../models/paymentSchema");
// const SalesVoucher = require("../models/salesSchema");
// const ReceiptVoucher = require("../models/recieptVoucherSchema");
// const PurchaseVoucher = require("../models/purchaseScheema");
// const JournalVoucher = require("../models/journalSchema");
// const DebitNote = require("../models/debitNoteSchema");
// const CreditNote = require("../models/creditNoteSchema");
// const ContraVoucher = require("../models/contaSchema.js");
// const Ledger = require("../models/ledgerSchema");
// const PayHeadDetailsModel = require("../models/staffmodel/payHeadDetailsSchema");
// const PayMaster = require("../models/staffmodel/payMaster");
// exports.getAllTransactions = async (req, res) => {
//   try {
//     const userId = req.user._id; // Get the owner ID

//     // Fetch only transactions belonging to the logged-in user
//     const payments = await Payment.find({ owner: userId });
//     const salesVouchers = await SalesVoucher.find({ owner: userId });
//     const receiptVouchers = await ReceiptVoucher.find({ owner: userId });
//     const purchaseVouchers = await PurchaseVoucher.find({ owner: userId });
//     console.log("purchaseVouchers", purchaseVouchers);
//     const journalVouchers = await JournalVoucher.find({ owner: userId });
//     const debitNotes = await DebitNote.find({ owner: userId });
//     const creditNotes = await CreditNote.find({ owner: userId });
//     const contraVouchers = await ContraVoucher.find({ owner: userId });
//     const payHeadDetails = await PayHeadDetailsModel.find({ owner: userId });
//     const payMasterVouchers = await PayMaster.find({ owner: userId });
//     const ledgers = await Ledger.find({ owner: userId });

//     // Transform Payment vouchers
//     const transformedPayments = payments.flatMap((payment) => {
//       const debitEntries = payment.debitLedgers.map((debit) => ({
//         _id: payment._id,
//         voucherType: "Payment Voucher",
//         voucherNumber: payment.voucherNumber,
//         date: payment.transactionDate,
//         debitLedger: debit.ledgerId,
//         debitLedgerName: debit.ledgerName,
//         debitAmount: debit.amount,
//         creditLedger: null,
//         creditLedgerName: null,
//         creditAmount: 0,
//         description: payment.description,
//       }));

//       const creditEntries = payment.creditLedgers.map((credit) => ({
//         _id: payment._id,
//         voucherType: "Payment Voucher",
//         voucherNumber: payment.voucherNumber,
//         date: payment.transactionDate,
//         debitLedger: null,
//         debitLedgerName: null,
//         debitAmount: 0,
//         creditLedger: credit.ledgerId,
//         creditLedgerName: credit.ledgerName,
//         creditAmount: credit.amount,
//         description: payment.description,
//       }));

//       return [...debitEntries, ...creditEntries];
//     });

//     // Transform journal vouchers
//     const transformedJournalVouchers = journalVouchers.flatMap((voucher) => {
//       const debitEntries = voucher.debitLedgers.map((debit) => ({
//         _id: voucher._id,
//         voucherType: voucher.voucherType,
//         voucherNumber: voucher.voucherNumber,
//         date: voucher.date,
//         debitLedger: debit.ledgerId,
//         debitLedgerName: debit.ledgerName,
//         debitAmount: debit.amount,
//         creditLedger: null,
//         creditLedgerName: null,
//         creditAmount: 0,
//         description: voucher.description,
//       }));

//       const creditEntries = voucher.creditLedgers.map((credit) => ({
//         _id: voucher._id,
//         voucherType: voucher.voucherType,
//         voucherNumber: voucher.voucherNumber,
//         date: voucher.date,
//         debitLedger: null,
//         debitLedgerName: null,
//         debitAmount: 0,
//         creditLedger: credit.ledgerId,
//         creditLedgerName: credit.ledgerName,
//         creditAmount: credit.amount,
//         description: voucher.description,
//       }));

//       return [...debitEntries, ...creditEntries];
//     });

//     // Transform purchase vouchers
//     const transformedPurchaseVouchers = purchaseVouchers.flatMap((voucher) => {
//       const debitEntries = voucher.debitLedgers.map((debit) => ({
//         _id: voucher._id,
//         voucherType: "Purchase Voucher",
//         voucherNumber: voucher.voucherNumber,
//         date: voucher.transactionDate,
//         debitLedger: debit.ledgerId,
//         debitLedgerName: debit.ledgerName,
//         debitAmount: debit.amount,
//         creditLedger: null,
//         creditLedgerName: null,
//         creditAmount: 0,
//         description: voucher.description,
//       }));

//       const creditEntries = voucher.creditLedgers.map((credit) => ({
//         _id: voucher._id,
//         voucherType: "Purchase Voucher",
//         voucherNumber: voucher.voucherNumber,
//         date: voucher.transactionDate,
//         debitLedger: null,
//         debitLedgerName: null,
//         debitAmount: 0,
//         creditLedger: credit.ledgerId,
//         creditLedgerName: credit.ledgerName,
//         creditAmount: credit.amount,
//         description: voucher.description,
//       }));

//       return [...debitEntries, ...creditEntries];
//     });

//     // Transform sales vouchers
//     const transformedSalesVouchers = salesVouchers.flatMap((voucher) => {
//       const debitEntries = voucher.debitLedgers.map((debit) => ({
//         _id: voucher._id,
//         voucherType: "Sales Voucher",
//         voucherNumber: voucher.voucherNumber,
//         date: voucher.transactionDate,
//         debitLedger: debit.ledgerId,
//         debitLedgerName: debit.ledgerName,
//         debitAmount: debit.amount,
//         creditLedger: null,
//         creditLedgerName: null,
//         creditAmount: 0,
//         description: voucher.description,
//       }));

//       const creditEntries = voucher.creditLedgers.map((credit) => ({
//         _id: voucher._id,
//         voucherType: "Sales Voucher",
//         voucherNumber: voucher.voucherNumber,
//         date: voucher.transactionDate,
//         debitLedger: null,
//         debitLedgerName: null,
//         debitAmount: 0,
//         creditLedger: credit.ledgerId,
//         creditLedgerName: credit.ledgerName,
//         creditAmount: credit.amount,
//         description: voucher.description,
//       }));

//       return [...debitEntries, ...creditEntries];
//     });
//     // transform credit note
//     const transformedCreditNotes = creditNotes.flatMap((creditNote) => {
//       const debitEntries = creditNote.debitLedgers.map((debit) => ({
//         _id: creditNote._id,
//         voucherType: "Credit Note",
//         voucherNumber: creditNote.voucherNumber,
//         date: creditNote.transactionDate,
//         debitLedger: debit.ledgerId,
//         debitLedgerName: debit.ledgerName,
//         debitAmount: debit.amount,
//         creditLedger: null,
//         creditLedgerName: null,
//         creditAmount: 0,
//         description: creditNote.description,
//       }));

//       const creditEntries = creditNote.creditLedgers.map((credit) => ({
//         _id: creditNote._id,
//         voucherType: "Credit Note",
//         voucherNumber: creditNote.voucherNumber,
//         date: creditNote.transactionDate,
//         debitLedger: null,
//         debitLedgerName: null,
//         debitAmount: 0,
//         creditLedger: credit.ledgerId,
//         creditLedgerName: credit.ledgerName,
//         creditAmount: credit.amount,
//         description: creditNote.description,
//       }));

//       return [...debitEntries, ...creditEntries];
//     });
//     // Transform Debit Notes
//     const transformedDebitNotes = debitNotes.flatMap((debitNote) => {
//       const debitEntries = debitNote.debitLedgers.map((debit) => ({
//         _id: debitNote._id,
//         voucherType: "Debit Note",
//         taxAmount: debitNote.taxAmount,
//         voucherNumber: debitNote.voucherNumber,
//         date: debitNote.transactionDate,
//         debitLedger: debit.ledgerId,
//         debitLedgerName: debit.ledgerName,
//         debitAmount: debit.amount,
//         creditLedger: null,
//         creditLedgerName: null,
//         creditAmount: 0,
//         description: debitNote.description,
//       }));

//       const creditEntries = debitNote.creditLedgers.map((credit) => ({
//         _id: debitNote._id,
//         voucherType: "Debit Note",
//         voucherNumber: debitNote.voucherNumber,
//         date: debitNote.transactionDate,
//         debitLedger: null,
//         debitLedgerName: null,
//         debitAmount: 0,
//         creditLedger: credit.ledgerId,
//         creditLedgerName: credit.ledgerName,
//         creditAmount: credit.amount,
//         description: debitNote.description,
//       }));

//       return [...debitEntries, ...creditEntries];
//     });
//     // Transform Receipt Vouchers
//     const transformedReceiptVouchers = receiptVouchers.flatMap((receipt) => {
//       const debitEntries = receipt.debitLedgers.map((debit) => ({
//         _id: receipt._id,
//         voucherType: "Receipt Voucher",
//         voucherNumber: receipt.voucherNumber,
//         date: receipt.transactionDate,
//         debitLedger: debit.ledgerId,
//         debitLedgerName: debit.ledgerName,
//         debitAmount: debit.amount,
//         creditLedger: null,
//         creditLedgerName: null,
//         creditAmount: 0,
//         description: receipt.description,
//       }));

//       const creditEntries = receipt.creditLedgers.map((credit) => ({
//         _id: receipt._id,
//         voucherType: "Receipt Voucher",
//         voucherNumber: receipt.voucherNumber,
//         date: receipt.transactionDate,
//         debitLedger: null,
//         debitLedgerName: null,
//         debitAmount: 0,
//         creditLedger: credit.ledgerId,
//         creditLedgerName: credit.ledgerName,
//         creditAmount: credit.amount,
//         description: receipt.description,
//       }));

//       return [...debitEntries, ...creditEntries];
//     });
//     // Transform contra Vouchers
//     const transformedContraVouchers = contraVouchers.flatMap((contra) => {
//       const debitEntries = contra.debitLedgers.map((debit) => ({
//         _id: contra._id,
//         voucherType: "Contra Voucher",
//         voucherNumber: contra.voucherNumber,
//         date: contra.transactionDate,
//         debitLedger: debit.ledgerId,
//         debitLedgerName: debit.ledgerName,
//         debitAmount: debit.amount,
//         creditLedger: null,
//         creditLedgerName: null,
//         creditAmount: 0,
//         description: contra.description,
//       }));

//       const creditEntries = contra.creditLedgers.map((credit) => ({
//         _id: contra._id,
//         voucherType: "Contra Voucher",
//         voucherNumber: contra.voucherNumber,
//         date: contra.transactionDate,
//         debitLedger: null,
//         debitLedgerName: null,
//         debitAmount: 0,
//         creditLedger: credit.ledgerId,
//         creditLedgerName: credit.ledgerName,
//         creditAmount: credit.amount,
//         description: contra.description,
//       }));

//       return [...debitEntries, ...creditEntries];
//     });
//     // Transform PayMaster vouchers
//     const transformedPayMasterVouchers = payMasterVouchers.flatMap(
//       (payMaster) => {
//         const debitEntries = payMaster.debitLedgers.map((debit) => ({
//           _id: payMaster._id,
//           voucherType: "Pay Master",
//           voucherNumber: payMaster.voucherNumber,
//           date: payMaster.date,
//           debitLedger: debit.ledgerId,
//           debitLedgerName: debit.ledgerName,
//           debitAmount: debit.amount,
//           creditLedger: null,
//           creditLedgerName: null,
//           creditAmount: 0,
//           description: payMaster.description,
//         }));

//         const creditEntries = payMaster.creditLedgers.map((credit) => ({
//           _id: payMaster._id,
//           voucherType: "Pay Master",
//           voucherNumber: payMaster.voucherNumber,
//           date: payMaster.date,
//           debitLedger: null,
//           debitLedgerName: null,
//           debitAmount: 0,
//           creditLedger: credit.ledgerId,
//           creditLedgerName: credit.ledgerName,
//           creditAmount: credit.amount,
//           description: payMaster.description,
//         }));

//         return [...debitEntries, ...creditEntries];
//       }
//     );

//     // Combine all transactions
//     const allTransactions = [
//       ...transformedPayments,
//       ...transformedSalesVouchers,
//       ...transformedPurchaseVouchers,
//       ...transformedJournalVouchers,
//       ...transformedCreditNotes,
//       ...transformedDebitNotes,
//       ...transformedReceiptVouchers,
//       ...transformedContraVouchers,
//       ...transformedPayMasterVouchers, // Include PayMaster vouchers here
//       ...payHeadDetails,
//     ];

//     res.status(200).json({ transactions: allTransactions, ledgers });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

const Payment = require("../models/paymentSchema");
const SalesVoucher = require("../models/salesSchema");
const ReceiptVoucher = require("../models/recieptVoucherSchema");
const PurchaseVoucher = require("../models/purchaseScheema");
const JournalVoucher = require("../models/journalSchema");
const DebitNote = require("../models/debitNoteSchema");
const CreditNote = require("../models/creditNoteSchema");
const ContraVoucher = require("../models/contaSchema.js");
const Ledger = require("../models/ledgerSchema");
const PayHeadDetailsModel = require("../models/staffmodel/payHeadDetailsSchema");
const PayMaster = require("../models/staffmodel/payMaster");
exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.user._id; // Get the owner ID

    // Fetch only transactions belonging to the logged-in user
    const payments = await Payment.find({ owner: userId });
    const salesVouchers = await SalesVoucher.find({ owner: userId });
    const receiptVouchers = await ReceiptVoucher.find({ owner: userId });
    const purchaseVouchers = await PurchaseVoucher.find({ owner: userId });
    console.log("purchaseVouchers", purchaseVouchers);
    const journalVouchers = await JournalVoucher.find({ owner: userId });
    const debitNotes = await DebitNote.find({ owner: userId });
    const creditNotes = await CreditNote.find({ owner: userId });
    const contraVouchers = await ContraVoucher.find({ owner: userId });
    const payHeadDetails = await PayHeadDetailsModel.find({ owner: userId });
    const payMasterVouchers = await PayMaster.find({ owner: userId });
    const ledgers = await Ledger.find({ owner: userId });

    // Transform Payment vouchers
    const transformedPayments = payments.flatMap((payment) => {
      const debitEntries = payment.debitLedgers.map((debit) => ({
        _id: payment._id,
        voucherType: "Payment Voucher",
        voucherNumber: payment.voucherNumber,
        date: payment.transactionDate,
        debitLedger: debit.ledgerId,
        debitLedgerName: debit.ledgerName,
        debitAmount: debit.amount,
        creditLedger: null,
        creditLedgerName: null,
        creditAmount: 0,
        description: payment.description,
      }));

      const creditEntries = payment.creditLedgers.map((credit) => ({
        _id: payment._id,
        voucherType: "Payment Voucher",
        voucherNumber: payment.voucherNumber,
        date: payment.transactionDate,
        debitLedger: null,
        debitLedgerName: null,
        debitAmount: 0,
        creditLedger: credit.ledgerId,
        creditLedgerName: credit.ledgerName,
        creditAmount: credit.amount,
        description: payment.description,
      }));

      return [...debitEntries, ...creditEntries];
    });

    // Transform journal vouchers
    const transformedJournalVouchers = journalVouchers.flatMap((voucher) => {
      const debitEntries = voucher.debitLedgers.map((debit) => ({
        _id: voucher._id,
        voucherType: voucher.voucherType,
        voucherNumber: voucher.voucherNumber,
        date: voucher.date,
        debitLedger: debit.ledgerId,
        debitLedgerName: debit.ledgerName,
        debitAmount: debit.amount,
        creditLedger: null,
        creditLedgerName: null,
        creditAmount: 0,
        description: voucher.description,
      }));

      const creditEntries = voucher.creditLedgers.map((credit) => ({
        _id: voucher._id,
        voucherType: voucher.voucherType,
        voucherNumber: voucher.voucherNumber,
        date: voucher.date,
        debitLedger: null,
        debitLedgerName: null,
        debitAmount: 0,
        creditLedger: credit.ledgerId,
        creditLedgerName: credit.ledgerName,
        creditAmount: credit.amount,
        description: voucher.description,
      }));

      return [...debitEntries, ...creditEntries];
    });

    // Transform purchase vouchers
    const transformedPurchaseVouchers = purchaseVouchers.flatMap((voucher) => {
      console.log(
        "voucher.....................................................",
        voucher
      );
      const debitEntries = voucher.debitLedgers.map((debit) => ({
        _id: voucher._id,
        voucherType: "Purchase Voucher",
        voucherNumber: voucher.voucherNumber,
        date: voucher.transactionDate,
        debitLedger: debit.ledgerId,
        debitLedgerName: debit.ledgerName,
        debitAmount: debit.amount,
        creditLedger: null,
        creditLedgerName: null,
        creditAmount: 0,
        description: voucher.description,
      }));

      const creditEntries = voucher.creditLedgers.map((credit) => ({
        _id: voucher._id,
        voucherType: "Purchase Voucher",
        voucherNumber: voucher.voucherNumber,
        date: voucher.transactionDate,
        debitLedger: null,
        debitLedgerName: null,
        debitAmount: 0,
        creditLedger: credit.ledgerId,
        creditLedgerName: credit.ledgerName,
        creditAmount: credit.amount,
        description: voucher.description,
      }));

      return [...debitEntries, ...creditEntries];
    });

    // Transform sales vouchers
    const transformedSalesVouchers = salesVouchers.flatMap((voucher) => {
      const debitEntries = voucher.debitLedgers.map((debit) => ({
        _id: voucher._id,
        voucherType: "Sales Voucher",
        voucherNumber: voucher.voucherNumber,
        date: voucher.transactionDate,
        debitLedger: debit.ledgerId,
        debitLedgerName: debit.ledgerName,
        debitAmount: debit.amount,
        creditLedger: null,
        creditLedgerName: null,
        creditAmount: 0,
        description: voucher.description,
      }));

      const creditEntries = voucher.creditLedgers.map((credit) => ({
        _id: voucher._id,
        voucherType: "Sales Voucher",
        voucherNumber: voucher.voucherNumber,
        date: voucher.transactionDate,
        debitLedger: null,
        debitLedgerName: null,
        debitAmount: 0,
        creditLedger: credit.ledgerId,
        creditLedgerName: credit.ledgerName,
        creditAmount: credit.amount,
        description: voucher.description,
      }));

      return [...debitEntries, ...creditEntries];
    });
    // transform credit note
    const transformedCreditNotes = creditNotes.flatMap((creditNote) => {
      const debitEntries = creditNote.debitLedgers.map((debit) => ({
        _id: creditNote._id,
        voucherType: "Credit Note",
        voucherNumber: creditNote.voucherNumber,
        date: creditNote.transactionDate,
        debitLedger: debit.ledgerId,
        debitLedgerName: debit.ledgerName,
        debitAmount: debit.amount,
        creditLedger: null,
        creditLedgerName: null,
        creditAmount: 0,
        description: creditNote.description,
      }));

      const creditEntries = creditNote.creditLedgers.map((credit) => ({
        _id: creditNote._id,
        voucherType: "Credit Note",
        voucherNumber: creditNote.voucherNumber,
        date: creditNote.transactionDate,
        debitLedger: null,
        debitLedgerName: null,
        debitAmount: 0,
        creditLedger: credit.ledgerId,
        creditLedgerName: credit.ledgerName,
        creditAmount: credit.amount,
        description: creditNote.description,
      }));

      return [...debitEntries, ...creditEntries];
    });
    // Transform Debit Notes
    const transformedDebitNotes = debitNotes.flatMap((debitNote) => {
      const debitEntries = debitNote.debitLedgers.map((debit) => ({
        _id: debitNote._id,
        voucherType: "Debit Note",
        taxAmount: debitNote.taxAmount,
        voucherNumber: debitNote.voucherNumber,
        date: debitNote.transactionDate,
        debitLedger: debit.ledgerId,
        debitLedgerName: debit.ledgerName,
        debitAmount: debit.amount,
        creditLedger: null,
        creditLedgerName: null,
        creditAmount: 0,
        description: debitNote.description,
      }));

      const creditEntries = debitNote.creditLedgers.map((credit) => ({
        _id: debitNote._id,
        voucherType: "Debit Note",
        voucherNumber: debitNote.voucherNumber,
        date: debitNote.transactionDate,
        debitLedger: null,
        debitLedgerName: null,
        debitAmount: 0,
        creditLedger: credit.ledgerId,
        creditLedgerName: credit.ledgerName,
        creditAmount: credit.amount,
        description: debitNote.description,
      }));

      return [...debitEntries, ...creditEntries];
    });
    // Transform Receipt Vouchers
    const transformedReceiptVouchers = receiptVouchers.flatMap((receipt) => {
      const debitEntries = receipt.debitLedgers.map((debit) => ({
        _id: receipt._id,
        voucherType: "Receipt Voucher",
        voucherNumber: receipt.voucherNumber,
        date: receipt.transactionDate,
        debitLedger: debit.ledgerId,
        debitLedgerName: debit.ledgerName,
        debitAmount: debit.amount,
        creditLedger: null,
        creditLedgerName: null,
        creditAmount: 0,
        description: receipt.description,
      }));

      const creditEntries = receipt.creditLedgers.map((credit) => ({
        _id: receipt._id,
        voucherType: "Receipt Voucher",
        voucherNumber: receipt.voucherNumber,
        date: receipt.transactionDate,
        debitLedger: null,
        debitLedgerName: null,
        debitAmount: 0,
        creditLedger: credit.ledgerId,
        creditLedgerName: credit.ledgerName,
        creditAmount: credit.amount,
        description: receipt.description,
      }));

      return [...debitEntries, ...creditEntries];
    });
    // Transform contra Vouchers
    const transformedContraVouchers = contraVouchers.flatMap((contra) => {
      const debitEntries = contra.debitLedgers.map((debit) => ({
        _id: contra._id,
        voucherType: "Contra Voucher",
        voucherNumber: contra.voucherNumber,
        date: contra.transactionDate,
        debitLedger: debit.ledgerId,
        debitLedgerName: debit.ledgerName,
        debitAmount: debit.amount,
        creditLedger: null,
        creditLedgerName: null,
        creditAmount: 0,
        description: contra.description,
      }));

      const creditEntries = contra.creditLedgers.map((credit) => ({
        _id: contra._id,
        voucherType: "Contra Voucher",
        voucherNumber: contra.voucherNumber,
        date: contra.transactionDate,
        debitLedger: null,
        debitLedgerName: null,
        debitAmount: 0,
        creditLedger: credit.ledgerId,
        creditLedgerName: credit.ledgerName,
        creditAmount: credit.amount,
        description: contra.description,
      }));

      return [...debitEntries, ...creditEntries];
    });
    // Transform PayMaster vouchers
    const transformedPayMasterVouchers = payMasterVouchers.flatMap(
      (payMaster) => {
        const debitEntries = payMaster.debitLedgers.map((debit) => ({
          _id: payMaster._id,
          voucherType: "Pay Master",
          voucherNumber: payMaster.voucherNumber,
          date: payMaster.date,
          debitLedger: debit.ledgerId,
          debitLedgerName: debit.ledgerName,
          debitAmount: debit.amount,
          creditLedger: null,
          creditLedgerName: null,
          creditAmount: 0,
          description: payMaster.description,
        }));

        const creditEntries = payMaster.creditLedgers.map((credit) => ({
          _id: payMaster._id,
          voucherType: "Pay Master",
          voucherNumber: payMaster.voucherNumber,
          date: payMaster.date,
          debitLedger: null,
          debitLedgerName: null,
          debitAmount: 0,
          creditLedger: credit.ledgerId,
          creditLedgerName: credit.ledgerName,
          creditAmount: credit.amount,
          description: payMaster.description,
        }));

        return [...debitEntries, ...creditEntries];
      }
    );

    // Combine all transactions
    const allTransactions = [
      ...transformedPayments,
      ...transformedSalesVouchers,
      ...transformedPurchaseVouchers,
      ...transformedJournalVouchers,
      ...transformedCreditNotes,
      ...transformedDebitNotes,
      ...transformedReceiptVouchers,
      ...transformedContraVouchers,
      ...transformedPayMasterVouchers, // Include PayMaster vouchers here
      ...payHeadDetails,
    ];

    res.status(200).json({ transactions: allTransactions, ledgers });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getAllTransactionsAssets = async (req, res) => {
  try {
    const userId = req.user._id; // Get the owner ID

    // Fetch only transactions belonging to the logged-in user

    const payMasterVouchers = await PayMaster.find({ owner: userId });
    const ledgers = await Ledger.find({ owner: userId });

    // Transform PayMaster vouchers
    const transformedPayMasterVouchers = payMasterVouchers.flatMap(
      (payMaster) => {
        const debitEntries = payMaster.debitLedgers.map((debit) => ({
          _id: payMaster._id,
          voucherType: "Pay Master",
          voucherNumber: payMaster.voucherNumber,
          date: payMaster.date,
          debitLedger: debit.ledgerId,
          debitLedgerName: debit.ledgerName,
          debitAmount: debit.amount,
          creditLedger: null,
          creditLedgerName: null,
          creditAmount: 0,
          description: payMaster.description,
        }));

        const creditEntries = payMaster.creditLedgers.map((credit) => ({
          _id: payMaster._id,
          voucherType: "Pay Master",
          voucherNumber: payMaster.voucherNumber,
          date: payMaster.date,
          debitLedger: null,
          debitLedgerName: null,
          debitAmount: 0,
          creditLedger: credit.ledgerId,
          creditLedgerName: credit.ledgerName,
          creditAmount: credit.amount,
          description: payMaster.description,
        }));

        return [...debitEntries, ...creditEntries];
      }
    );

    // Combine all transactions
    const allTransactions = [
      ...transformedPayMasterVouchers, // Include PayMaster vouchers here
    ];

    res.status(200).json({ transactions: allTransactions, ledgers });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
