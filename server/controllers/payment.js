const PrimaryLedger = require("../models/primaryLedger");
const SecondaryLedger = require("../models/secondaryLedger");
const PaymentTransaction = require("../models/payments");

exports.createPaymentTransaction = async (req, res) => {
  console.log("payment", req.body);
  const {
    debitLedgerName,
    debitLedgerType,
    creditLedgerName,
    creditLedgerType,
    amount,
    description,
  } = req.body;

  try {
    // Find the Primary Ledger (debit ledger)
    let debitLedger;
    if (debitLedgerType === "PrimaryLedger") {
      debitLedger = await PrimaryLedger.findOne({ name: debitLedgerName });
    } else if (debitLedgerType === "SecondaryLedger") {
      debitLedger = await SecondaryLedger.findOne({ name: debitLedgerName });
    }

    if (!debitLedger) {
      return res.status(404).json({ message: "Debit ledger not found" });
    }

    // Find the Secondary Ledger (credit ledger)
    let creditLedger;
    if (creditLedgerType === "PrimaryLedger") {
      creditLedger = await PrimaryLedger.findOne({ name: creditLedgerName });
    } else if (creditLedgerType === "SecondaryLedger") {
      creditLedger = await SecondaryLedger.findOne({ name: creditLedgerName });
    }

    if (!creditLedger) {
      return res.status(404).json({ message: "Credit ledger not found" });
    }

    // Create the Payment Transaction
    const newPaymentTransaction = new PaymentTransaction({
      debitLedger: {
        type: debitLedger._id,
        debitLedgerType,
      },
      creditLedger: {
        type: creditLedger._id,
        creditLedgerType,
      },
      amount,
      description,
    });

    // Save the payment transaction
    await newPaymentTransaction.save();

    res.status(201).json(newPaymentTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
