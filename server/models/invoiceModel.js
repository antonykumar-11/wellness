// models/Invoice.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  SerialNumber: { type: String, required: true },
  description: { type: String, required: true },
  hsnCode: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: String, required: true },
  qty: { type: String, required: true },
});

const invoiceSchema = new mongoose.Schema({
  billedTo: {
    line1: String,
    line2: String,
    line3: String,
    line4: String,
    line5: String,
  },
  shippedTo: {
    line1: String,
    line2: String,
    line3: String,
    line4: String,
    line5: String,
  },
  companyAddress: {
    line1: String,
    line2: String,
    line3: String,
    line4: String,
    line5: String,
  },
  companyName: { type: String, required: true },
  image: { type: String }, // Store image URL or path
  imagePosition: { type: String, enum: ["left", "right"], default: "left" },
  taxRate: { type: String },
  declaration: { type: String },
  managingDirector: { type: String },
  signature: { type: String },
  taxInvoice: { type: String },
  items: [itemSchema],
  panNo: { type: String },
  gstNo: { type: String },
  invoiceNo: { type: String, required: true },
  date: { type: Date, required: true },
  bankDetails: {
    name: String,
    accountNumber: String,
    ifsc: String,
    branch: String,
  },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
