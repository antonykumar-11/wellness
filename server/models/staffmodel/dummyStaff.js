// // models/staffmodel/dummyStaff.js
// const mongoose = require("mongoose");

// const operationSchema = new mongoose.Schema({
//   operator: {
//     type: String,
//     enum: ["add", "subtract", "multiply", "divide"],
//     required: true,
//   },
//   item: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "PayHead", // Assuming 'PayHead' is the model name for the ledgers
//     required: true,
//   },
// });

// const operationsSchema = new mongoose.Schema({
//   operations: {
//     type: [operationSchema],
//     required: true,
//   },
// });

// const Operation = mongoose.model("Operation", operationsSchema);

// module.exports = Operation;
// models/Product.js
// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  basePrice: Number,
  discount: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
