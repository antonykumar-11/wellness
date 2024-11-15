const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/aaaTransaction");

router.post("/create", transactionController.createTransaction);

module.exports = router;
