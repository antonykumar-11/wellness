// routes/operations.js
// const express = require("express");
// const {
//   addOperations,
// } = require("../../controllers/StaffController/dummyStaff");

// const router = express.Router();

// router.post("/add", addOperations);

// module.exports = router;
// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../../controllers/StaffController/dummyStaff");

// Route to create a product
router.post("/products", productController.createProduct);

// Route to get all products
router.get("/products", productController.getProducts);

module.exports = router;
