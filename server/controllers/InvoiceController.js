// controllers/invoiceController.js
const Invoice = require("../models/invoiceModel");
const User = require("../models/userModel");
const Sales = require("../models/salesSchema");
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
// exports.getAllInvoices = async (req, res) => {
//   try {
//     const invoices = await Invoice.find();
//     res.status(200).json({ success: true, data: invoices });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

exports.getAllInvoices = async (req, res) => {
  try {
    // Fetch user data for the logged-in user
    const invoices = await User.findById(req.user._id).select({
      avatar: 1,
      companyName: 1,
      invoiceType: 1,
      address1: 1,
      address2: 1,
      address3: 1,
      address4: 1,
      gstNumber: 1,
      bankName: 1,
      accountNumber: 1,
      description: 1,
      ifsc: 1,
      branch: 1,
      email: 1,
      mobileNumber: 1,
      pancardnumber: 1,
    });

    // Fetch sales where the owner matches the logged-in user's ID
    const sales = await Sales.find({ owner: req.user._id }).populate([
      {
        path: "purchasedTo",
        select:
          "companyName street MainArea postOffice ZIPCode City State Country gstNumber companyPanNumber",
      },
      {
        path: "purchasedBy",
        select:
          "companyName street MainArea postOffice ZIPCode City State Country gstNumber companyPanNumber",
      },
    ]);

    res.status(200).json({ success: true, data: { invoices, sales } });
    console.log("invoices", invoices);
    console.log("sales", sales);
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
