const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getAllCustomers,
  getCustomerByPhone,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/Customer");

// Routes
router.post("/", createCustomer); // Create
router.get("/", getAllCustomers); // Read all
router.get("/:phone_number", getCustomerByPhone); // Read one
router.put("/:id", updateCustomer); // Update
router.delete("/:id", deleteCustomer); // Delete

module.exports = router;
