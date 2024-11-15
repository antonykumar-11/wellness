const mongoose = require("mongoose");
const Payment = require("../models/paymentSchema");
// Get all voucher numbers from purchases
const getAllVoucherNumbers = async (req, res) => {
  console.log("req.body", req.body);
  try {
    // Fetch all voucher numbers from the Purchase collection for the authenticated user
    const vouchers = await Payment.find(
      { owner: req.user._id }, // Filter by the authenticated user's ID
      { voucherNumber: 1, _id: 0 } // Select only the voucherNumber field
    ).sort({ voucherNumber: 1 });

    if (vouchers.length > 0) {
      // If vouchers exist, return them
      return res.status(200).json(vouchers);
    } else {
      // No vouchers exist, return a default value to set the first voucher number as 0
      return res.status(200).json([{ voucherNumber: 0 }]);
    }
  } catch (error) {
    // Handle any errors that might occur during the database operation
    res.status(500).json({ message: error.message });
  }
};
// Create a new payment
const createPayment = async (req, res) => {
  console.log("journal", req.body);
  try {
    const newPaymentVoucher = new Payment({
      ...req.body,
      owner: req.user._id, // Set the owner to the logged-in user's ID
    });
    const savednewPaymentVoucher = await newPaymentVoucher.save();
    res.status(201).json(savednewPaymentVoucher);
    console.log("journal", savednewPaymentVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a payment by ID
const updatePayment = async (req, res) => {
  const { id } = req.params; // Get purchase ID from request parameters

  try {
    // Find the purchase by ID and update it with the data from the request body
    const updatedPurchase = await Payment.findByIdAndUpdate(
      id,
      {
        ...req.body, // Spread the updated fields from the request body
      },
      { new: true } // This option returns the updated document
    );

    // Check if the purchase was found and updated
    if (!updatedPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json(updatedPurchase); // Respond with the updated purchase
  } catch (error) {
    console.error("Error updating purchase:", error); // Log the error for debugging
    res.status(500).json({ message: error.message }); // Respond with an error message
  }
};
// Fetch all payments for the logged-in user
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ owner: req.user._id }) // Fetch only the user's payments
      .populate("purchasedTo") // Populate the purchasedTo field with Company details
      .populate("purchasedBy"); // Populate the purchasedBy field with Company details

    res.status(200).json(payments); // Sends the fetched payments as JSON
    console.log("Fetched Payments:", payments);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Sends an error message if something goes wrong
  }
};

// Get a single payment by ID
const getPaymentById = async (req, res) => {
  try {
    const paymentVoucher = await Payment.findOne({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    })
      .populate("purchasedTo") // Populate the purchasedTo field with Company details
      .populate("purchasedBy"); // Populate the purchasedBy field with Company details

    if (!paymentVoucher) {
      return res
        .status(404)
        .json({ message: "Payment Voucher not found or not authorized" });
    }

    res.status(200).json(paymentVoucher);
    console.log("Fetched Payment:", paymentVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a payment by ID
const deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    });
    if (!deletedPayment)
      return res
        .status(404)
        .json({ message: "Payment not found or not authorized" });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getAllVoucherNumbers,
};
