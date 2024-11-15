// // controllers/operationController.js
// const Operation = require("../../models/staffmodel/dummyStaff");

// const PayHead = require("../../models/staffmodel/payheadModel"); // Assuming PayHead is the model name for the ledgers

// const addOperations = async (req, res) => {
//   console.log("req", req.body);
//   const { operations } = req.body;

//   if (!operations || operations.length === 0) {
//     return res.status(400).json({ message: "Operations are required" });
//   }

//   try {
//     // Convert item names to ObjectIds
//     const operationsWithObjectIds = await Promise.all(
//       operations.map(async (op) => {
//         const payHead = await PayHead.findOne({ name: op.item });
//         if (!payHead) {
//           throw new Error(`Item not found: ${op.item}`);
//         }
//         return { operator: op.operator, item: payHead._id };
//       })
//     );

//     const newOperations = new Operation({
//       operations: operationsWithObjectIds,
//     });
//     await newOperations.save();
//     res
//       .status(201)
//       .json({ message: "Operations saved successfully", data: newOperations });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to save operations", error: error.message });
//   }
// };

// module.exports = {
//   addOperations,
// };

// controllers/productController.js
const Product = require("../../models/staffmodel/dummyStaff");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
