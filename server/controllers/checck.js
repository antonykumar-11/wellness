// const ContraVoucher = require("../models/contaSchema");
// const DebitNote = require("../models/debitNoteSchema");
// const Payment = require("../models/paymentSchema");
// const CreditNote = require("../models/creditNoteSchema");
// const Ledger = require("../models/ledgerSchema");
// const Receipt = require("../models/recieptVoucherSchema");
// const Sales = require("../models/salesSchema");
// const Purchase = require("../models/purchaseScheema");
// const Journal = require("../models/journalSchema");

// const fetchLedgersWithTransactions = async () => {
//   try {
//     const ledgers = await Ledger.aggregate([
//       {
//         $lookup: {
//           from: "payments",
//           localField: "_id",
//           foreignField: "debitLedger",
//           as: "paymentDebitTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "payments",
//           localField: "_id",
//           foreignField: "creditLedger",
//           as: "paymentCreditTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "purchases",
//           localField: "_id",
//           foreignField: "debitLedger",
//           as: "purchaseDebitTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "purchases",
//           localField: "_id",
//           foreignField: "creditLedger",
//           as: "purchaseCreditTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "sales",
//           localField: "_id",
//           foreignField: "debitLedger",
//           as: "salesDebitTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "sales",
//           localField: "_id",
//           foreignField: "creditLedger",
//           as: "salesCreditTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "receipts",
//           localField: "_id",
//           foreignField: "debitLedger",
//           as: "receiptDebitTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "receipts",
//           localField: "_id",
//           foreignField: "creditLedger",
//           as: "receiptCreditTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "journals",
//           localField: "_id",
//           foreignField: "debitLedger",
//           as: "journalDebitTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "journals",
//           localField: "_id",
//           foreignField: "creditLedger",
//           as: "journalCreditTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "contravouchers",
//           localField: "_id",
//           foreignField: "debitLedger",
//           as: "contraDebitTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "contravouchers",
//           localField: "_id",
//           foreignField: "creditLedger",
//           as: "contraCreditTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "debitnotes",
//           localField: "_id",
//           foreignField: "debitLedger",
//           as: "debitNoteDebitTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "debitnotes",
//           localField: "_id",
//           foreignField: "creditLedger",
//           as: "debitNoteCreditTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "creditnotes",
//           localField: "_id",
//           foreignField: "debitLedger",
//           as: "creditNoteDebitTransactions",
//         },
//       },
//       {
//         $lookup: {
//           from: "creditnotes",
//           localField: "_id",
//           foreignField: "creditLedger",
//           as: "creditNoteCreditTransactions",
//         },
//       },
//     ]);

//     console.log(JSON.stringify(ledgers, null, 2));
//   } catch (error) {
//     console.error("Error fetching ledgers with transactions:", error);
//   }
// };

// fetchLedgersWithTransactions();
// controllers/ledgerController.js

const Ledger = require("../models/ledgerSchema");

const fetchLedgersWithTransactions = async (req, res) => {
  try {
    const ledgers = await Ledger.aggregate([
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "debitLedger",
          as: "paymentDebitTransactions",
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "creditLedger",
          as: "paymentCreditTransactions",
        },
      },
      {
        $lookup: {
          from: "purchases",
          localField: "_id",
          foreignField: "debitLedger",
          as: "purchaseDebitTransactions",
        },
      },
      {
        $lookup: {
          from: "purchases",
          localField: "_id",
          foreignField: "creditLedger",
          as: "purchaseCreditTransactions",
        },
      },
      {
        $lookup: {
          from: "sales",
          localField: "_id",
          foreignField: "debitLedger",
          as: "salesDebitTransactions",
        },
      },
      {
        $lookup: {
          from: "sales",
          localField: "_id",
          foreignField: "creditLedger",
          as: "salesCreditTransactions",
        },
      },
      {
        $lookup: {
          from: "receipts",
          localField: "_id",
          foreignField: "debitLedger",
          as: "receiptDebitTransactions",
        },
      },
      {
        $lookup: {
          from: "receipts",
          localField: "_id",
          foreignField: "creditLedger",
          as: "receiptCreditTransactions",
        },
      },
      {
        $lookup: {
          from: "journals",
          localField: "_id",
          foreignField: "debitLedger",
          as: "journalDebitTransactions",
        },
      },
      {
        $lookup: {
          from: "journals",
          localField: "_id",
          foreignField: "creditLedger",
          as: "journalCreditTransactions",
        },
      },
      {
        $lookup: {
          from: "contravouchers",
          localField: "_id",
          foreignField: "debitLedger",
          as: "contraDebitTransactions",
        },
      },
      {
        $lookup: {
          from: "contravouchers",
          localField: "_id",
          foreignField: "creditLedger",
          as: "contraCreditTransactions",
        },
      },
      {
        $lookup: {
          from: "debitnotes",
          localField: "_id",
          foreignField: "debitLedger",
          as: "debitNoteDebitTransactions",
        },
      },
      {
        $lookup: {
          from: "debitnotes",
          localField: "_id",
          foreignField: "creditLedger",
          as: "debitNoteCreditTransactions",
        },
      },
      {
        $lookup: {
          from: "creditnotes",
          localField: "_id",
          foreignField: "debitLedger",
          as: "creditNoteDebitTransactions",
        },
      },
      {
        $lookup: {
          from: "creditnotes",
          localField: "_id",
          foreignField: "creditLedger",
          as: "creditNoteCreditTransactions",
        },
      },
    ]);

    res.status(200).json(ledgers);
  } catch (error) {
    console.error("Error fetching ledgers with transactions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { fetchLedgersWithTransactions };
