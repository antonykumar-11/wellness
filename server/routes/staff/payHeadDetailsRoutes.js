const express = require("express");
const router = express.Router();
const payHeadDetailsController = require("../../controllers/StaffController/payHeadDetailsController");

const { isAuthenticatedUser } = require("../../middlewares/authenticate");
router.post(
  "/",
  isAuthenticatedUser,
  payHeadDetailsController.createPayHeadDetails
);

// Get all PayHeadDetails
router.get(
  "/",
  isAuthenticatedUser,
  payHeadDetailsController.getAllPayHeadDetails
);

// Get PayHeadDetails by employeeId
router.get(
  "/:employeeId",
  isAuthenticatedUser,
  payHeadDetailsController.getPayHeadDetailsById
);

// Update PayHeadDetails by employeeId
router.put(
  "/:employeeId",
  isAuthenticatedUser,
  payHeadDetailsController.updatePayHeadDetails
);

// Delete PayHeadDetails by employeeId
router.delete(
  "/:employeeId",
  isAuthenticatedUser,
  payHeadDetailsController.deletePayHeadDetailsById
);

module.exports = router;
