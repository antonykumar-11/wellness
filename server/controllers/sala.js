const mongoose = require("mongoose");
const Salesi = require("../models/salaSales");
const Ledgeri = require("../models/salaLedger");
const Stocki = require("../models/salaStock");

exports.createTransaction = async (req, res) => {
  const { item, quantity, amount, transactionType } = req.body;

  try {
    // Check if sufficient stock is available
    const stockEntry = await Stocki.findOne({ item });

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create Sales entry
      const sale = new Salesi({ item, quantity, amount });
      await sale.save({ session });

      // Create Ledger entry
      const ledgerEntry = new Ledgeri({ transactionType, amount });
      await ledgerEntry.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.status(201).send({ sale, ledgerEntry });
    } catch (error) {
      // Abort transaction if any error occurs
      await session.abortTransaction();
      session.endSession();
      throw error; // Rethrow the error to be caught by outer catch block
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
