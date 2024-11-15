const express = require("express");
const {
  addTransection,
  getAllTransection,
  editTransection,
  deleteTransection,
} = require("../controllers/transectionCtrl");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
//router object
const router = express.Router();

//routes
// Add transection POST Method (user-specific)
router.post("/add-transection", isAuthenticatedUser, addTransection);

// Edit transection POST Method (user-specific)
router.post("/edit-transaction", isAuthenticatedUser, editTransection);

// Delete transection POST Method (user-specific)
router.post("/delete-transection", isAuthenticatedUser, deleteTransection);

// Get transections (user-specific)
router.post("/get-transection", isAuthenticatedUser, getAllTransection);

module.exports = router;
