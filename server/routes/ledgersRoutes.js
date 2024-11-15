// routes/ledgerRoutes.js
const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledgerController");
const { isAuthenticatedUser } = require("../middlewares/authenticate");

router.post("/", isAuthenticatedUser, ledgerController.createLedger);

router.get("/", isAuthenticatedUser, ledgerController.getAllLedgers);
router.get("/pay", isAuthenticatedUser, ledgerController.getAllLedgersPay);
router.get("/all", isAuthenticatedUser, ledgerController.getAllLedgersall);
router.get(
  "/allPurchase",
  isAuthenticatedUser,
  ledgerController.getAllLedgersallPurchase
);
router.get("/:id", isAuthenticatedUser, ledgerController.getLedgerById);
router.put("/:id", isAuthenticatedUser, ledgerController.updateLedger);
router.delete("/:id", isAuthenticatedUser, ledgerController.deleteLedger);

module.exports = router;
