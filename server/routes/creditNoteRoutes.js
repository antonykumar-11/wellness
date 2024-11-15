const express = require("express");
const router = express.Router();
const creditNoteController = require("../controllers/creditNoteController");
const { isAuthenticatedUser } = require("../middlewares/authenticate"); // Import the authentication middleware
router.post(
  "/credit-notes",
  isAuthenticatedUser,
  creditNoteController.createCreditNote
);
router.post(
  "/credit-notes",
  isAuthenticatedUser,
  creditNoteController.createCreditNote
);
router.get(
  "/credit-notes",
  isAuthenticatedUser,
  creditNoteController.getAllCreditNotes
);
router.get(
  "/credit-notes/:id",
  isAuthenticatedUser,
  creditNoteController.getCreditNoteById
);
router.put(
  "/credit-notes/:id",
  isAuthenticatedUser,
  creditNoteController.updateCreditNote
);
router.delete(
  "/credit-notes/:id",
  isAuthenticatedUser,
  creditNoteController.deleteCreditNote
);

module.exports = router;
