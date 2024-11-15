// routes/ledgerRoutes.js
const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledgerController");
const { isAuthenticatedUser } = require("../middlewares/authenticate");

router.post("/ledger", isAuthenticatedUser, ledgerController.createLedger);
router.get("/ledger", isAuthenticatedUser, ledgerController.getAllLedgers);
router.get("/ledger/:id", isAuthenticatedUser, ledgerController.getLedgerById);
router.put("/ledger/:id", isAuthenticatedUser, ledgerController.updateLedger);
router.delete(
  "/ledger/:id",
  isAuthenticatedUser,
  ledgerController.deleteLedger
);

module.exports = router;
