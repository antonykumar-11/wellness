const express = require("express");
const router = express.Router();
const debitNoteController = require("../controllers/debitNote");
const { isAuthenticatedUser } = require("../middlewares/authenticate"); // Import the authentication middleware
router.post(
  "/debit-notes",
  isAuthenticatedUser,
  debitNoteController.createDebitNote
);
router.get(
  "/debit-notes",
  isAuthenticatedUser,
  debitNoteController.getAllDebitNotes
);
router.get(
  "/debit-notes/:id",
  isAuthenticatedUser,
  debitNoteController.getDebitNoteById
);
router.put(
  "/debit-notes/:id",
  isAuthenticatedUser,
  debitNoteController.updateDebitNote
);
router.delete(
  "/debit-notes/:id",
  isAuthenticatedUser,
  debitNoteController.deleteDebitNote
);

module.exports = router;
