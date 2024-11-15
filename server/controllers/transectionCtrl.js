const transectionModel = require("../models/transectionSchema");
const moment = require("moment");
const mongoose = require("mongoose");
const getAllTransection = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const { frequency, selectedDate, type } = req.body;

    // Build the query based on the conditions
    const query = {
      owner: req.user._id, // Fetch only the transactions of the authenticated user
    };

    // Apply date filters if frequency is not "all"
    if (frequency !== "all") {
      if (frequency === "custom") {
        // Use the "from" and "to" dates provided in selectedDate
        query.date = {
          $gte: new Date(selectedDate[0]), // Start date
          $lte: new Date(selectedDate[1]), // End date
        };
      } else {
        // For predefined ranges like "last 7 days"
        query.date = {
          $gt: moment().subtract(Number(frequency), "days").toDate(),
        };
      }
    }

    // Filter by type (if not "all")
    if (type !== "all") {
      query.type = type;
    }

    // Fetch the transactions with the constructed query
    const transections = await transectionModel.find(query);

    // Send the response with the filtered transactions
    res.status(200).json(transections);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteTransection = async (req, res) => {
  try {
    const transaction = await transectionModel.findOne({
      _id: req.body.transacationId,
      owner: req.user._id, // Check ownership
    });

    if (!transaction) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this transaction" });
    }

    await transectionModel.findOneAndDelete({ _id: req.body.transacationId });
    res.status(200).send("Transaction Deleted!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const editTransection = async (req, res) => {
  console.log("body", req.body);
  console.log("user", req.user);

  try {
    // Convert req.user._id to ObjectId for proper comparison
    const transaction = await transectionModel.findOne({
      _id: req.body.transactionId,
      owner: new mongoose.Types.ObjectId(req.user._id), // Ensure ObjectId comparison
    });

    // Log to verify ownership comparison
    console.log("Transaction found:", transaction);
    console.log("User ID:", req.user._id);
    console.log(
      "Transaction Owner:",
      transaction ? transaction.owner : "No transaction found"
    );

    if (!transaction) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this transaction" });
    }

    // Update the transaction with the provided payload
    const mani = await transectionModel.findOneAndUpdate(
      { _id: req.body.transactionId },
      req.body.payload
    );
    console.log("mani", mani);
    res.status(200).send(mani);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const addTransection = async (req, res) => {
  console.log("req.bodyketta", req.user);
  try {
    // Assign the authenticated user as the owner
    const newTransection = new transectionModel({
      ...req.body,
      owner: req.user._id,
    });
    await newTransection.save();
    res.status(201).send(newTransection);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAllTransection,
  addTransection,
  editTransection,
  deleteTransection,
};
