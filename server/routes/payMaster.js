// const express = require("express");
// const router = express.Router();
// const paymasterVoucherController = require("../controllers/StaffController/payMaster");

// // Create a new Journal Voucher
// router.post("/", paymasterVoucherController.createPayMasterVoucher);

// // Get all Journal Vouchers
// router.get("/", paymasterVoucherController.getAllPayMasterVouchers);

// // Get a single Journal Voucher by ID
// router.get("/:id", paymasterVoucherController.getPayMasterVoucherById);

// // Update a Journal Voucher by ID
// router.put("/:id", paymasterVoucherController.updatePayMasterVoucher);

// // Delete a Journal Voucher by ID
// router.delete("/:id", paymasterVoucherController.deletePayMasterVoucher);

// module.exports = router;
const express = require("express");
const router = express.Router();
const paymasterVoucherController = require("../controllers/StaffController/payMaster");
const { isAuthenticatedUser } = require("../middlewares/authenticate"); // Import authentication middleware

// Create a new PayMaster Voucher
router.post(
  "/",
  isAuthenticatedUser,
  paymasterVoucherController.createPayMasterVoucher
);
// Get all PayMaster Vouchers
router.get(
  "/check",
  isAuthenticatedUser,
  paymasterVoucherController.getAllVoucherNumbers
);
// Get all PayMaster Vouchers
router.get(
  "/",
  isAuthenticatedUser,
  paymasterVoucherController.getAllPayMasterVouchers
);

// Get a single PayMaster Voucher by ID
router.get(
  "/:id",
  isAuthenticatedUser,
  paymasterVoucherController.getPayMasterVoucherById
);

// Update a PayMaster Voucher by ID
router.put(
  "/:id",
  isAuthenticatedUser,
  paymasterVoucherController.updatePayMasterVoucher
);

// Delete a PayMaster Voucher by ID
router.delete(
  "/:id",
  isAuthenticatedUser,
  paymasterVoucherController.deletePayMasterVoucher
);

module.exports = router;
