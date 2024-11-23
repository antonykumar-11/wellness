const Payment = require("../models/paymentSchema"); // Adjust to your Payment model path
exports.getAllVoucherNumbers = async (req, res) => {
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
// Create a new Payment
exports.createPayment = async (req, res) => {
  console.log("payment", req.body);
  try {
    const newPayment = new Payment({
      ...req.body,
      owner: req.user._id, // Set the owner to the logged-in user's ID
    });
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
    console.log("payment", savedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Payments for the logged-in user
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ owner: req.user._id }); // Fetch only the user's payments
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    });
    if (!payment) {
      return res
        .status(404)
        .json({ message: "Payment not found or not authorized" });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Payment by ID
exports.updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, // Ensure the owner matches
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPayment) {
      return res
        .status(404)
        .json({ message: "Payment not found or not authorized" });
    }
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    });
    if (!deletedPayment) {
      return res
        .status(404)
        .json({ message: "Payment not found or not authorized" });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
