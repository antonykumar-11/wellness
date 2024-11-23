// routes/invoiceRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const invoiceController = require("../controllers/InvoiceController");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/invoices"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

// Create a new invoice with image upload
router.post(
  "/invoice",
  upload.single("image"),
  isAuthenticatedUser,
  invoiceController.createInvoice
);

// Get all invoices
router.get("/invoice", isAuthenticatedUser, invoiceController.getAllInvoices);

// Get a single invoice by ID
router.get(
  "/invoice/:id",
  isAuthenticatedUser,
  invoiceController.getInvoiceById
);

// Update an invoice by ID
router.put(
  "/invoice/:id",
  upload.single("image"),
  isAuthenticatedUser,
  invoiceController.updateInvoice
);

// Delete an invoice by ID
router.delete(
  "/invoice/:id",
  isAuthenticatedUser,
  invoiceController.deleteInvoice
);

module.exports = router;
