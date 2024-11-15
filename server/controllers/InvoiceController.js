// controllers/invoiceController.js
const Invoice = require("../models/invoiceModel");
const path = require("path");

// Create a new invoice
exports.createInvoice = async (req, res) => {
  console.log("req", req.body);
  try {
    let imageURL;

    if (req.file) {
      const BASE_URL =
        process.env.NODE_ENV === "production"
          ? `${req.protocol}://${req.get("host")}`
          : "http://localhost:8000"; // Adjust according to your environment

      imageURL = `${BASE_URL}/uploads/invoices/${req.file.filename}`;
    }

    const invoice = new Invoice({
      ...req.body,
      image: imageURL || null,
    });

    await invoice.save();
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get a single invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update an invoice by ID
exports.updateInvoice = async (req, res) => {
  try {
    let imageURL;

    if (req.file) {
      const BASE_URL =
        process.env.NODE_ENV === "production"
          ? `${req.protocol}://${req.get("host")}`
          : "http://localhost:5000"; // Adjust according to your environment

      imageURL = `${BASE_URL}/uploads/invoices/${req.file.filename}`;
    }

    const updatedData = {
      ...req.body,
      image: imageURL || req.body.image, // Keep the old image URL if no new image is uploaded
    };

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete an invoice by ID
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
