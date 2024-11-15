// const mongoose = require("mongoose");

// // Schema for the individual operations
// const operationSchema = new mongoose.Schema({
//   operands: {
//     type: [String], // Array to store multiple operands
//     required: false,
//     default: [], // Default to an empty array if not provided
//   },
//   operator: {
//     type: String,
//     required: false, // Operator is not mandatory
//   },
// });

// // Main schema for PayHead
// const payHeadSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true }, // 'name' is unique
//   displayNameInPayslip: { type: String, required: true }, // Non-unique
//   under: { type: mongoose.Schema.Types.ObjectId, ref: "Ledger" }, // Can be null or ObjectId
//   operations: {
//     type: [operationSchema],
//     required: false,
//     default: [], // Default to an empty array if not provided
//   },
//   payHeadType: {
//     type: String,
//     required: false,
//     default: null, // Allow null
//   },
//   calculationType: {
//     type: String,
//     required: false,
//     default: null, // Allow null
//   },
//   days: {
//     type: Number,
//     required: false,
//     default: null, // Allow null
//   },
// });

// const PayHead = mongoose.model("PayHead", payHeadSchema);

// module.exports = PayHead;
const mongoose = require("mongoose");

// Schema for the individual operations
const operationSchema = new mongoose.Schema({
  operands: {
    type: [String], // Array to store multiple operands
    required: false,
    default: [], // Default to an empty array if not provided
  },
  operator: {
    type: String,
    required: false, // Operator is not mandatory
  },
});

// Main schema for PayHead
const payHeadSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // 'name' is unique
  displayNameInPayslip: { type: String, required: true }, // Non-unique
  under: { type: mongoose.Schema.Types.ObjectId, ref: "Ledger", default: null }, // Can be null or ObjectId
  operations: {
    type: [operationSchema],
    required: false,
    default: [], // Default to an empty array if not provided
  },
  payHeadType: {
    type: String,
    required: false,
    default: null, // Allow null
  },
  calculationType: {
    type: String,
    required: false,
    default: null, // Allow null
  },
  category: {
    type: String, // Add category field
    required: false,
    default: null, // Allow null
  },
  group: {
    type: String, // Add group field
    required: false,
    default: null, // Allow null
  },
  nature: {
    type: String, // Add nature field
    required: false,
    default: null, // Allow null
  },
  days: {
    type: Number,
    required: false,
    default: null, // Allow null
  },
});

const PayHead = mongoose.model("PayHead", payHeadSchema);

module.exports = PayHead;
