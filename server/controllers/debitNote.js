// const DebitNote = require("../models/debitNoteSchema");
// const Ledger = require("../models/ledgerSchema");

// exports.createDebitNote = async (req, res) => {
//   try {
//     const newDebitNote = new DebitNote(req.body); // Use the DebitNote model to create a new instance
//     const savedDebitNote = await newDebitNote.save();
//     res.status(201).json(savedDebitNote);
//     console.log("journal", savedDebitNote);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all Debit Notes
// exports.getAllDebitNotes = async (req, res) => {
//   try {
//     const debitNotes = await DebitNote.find();
//     res.status(200).json(debitNotes);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get a single Debit Note by ID
// exports.getDebitNoteById = async (req, res) => {
//   try {
//     const debitNote = await DebitNote.findById(req.params.id);
//     if (!debitNote) {
//       return res.status(404).json({ error: "Debit Note not found" });
//     }
//     res.status(200).json(debitNote);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Update a Debit Note

// exports.updateDebitNote = async (req, res) => {
//   const { id } = req.params; // Extract the ID from the request parameters

//   try {
//     // Log the entire request body
//     console.log("Request Body:", req.body);

//     // Check if the request body contains the updated receipt
//     const update = req.body.updatedDebitNote;

//     if (!update) {
//       // If update is undefined or null, return a 400 Bad Request error
//       return res.status(400).json({ message: "No update data provided" });
//     }

//     // Find the existing receipt by ID and update it with the new data
//     const updatedDebitNote = await DebitNote.findByIdAndUpdate(
//       id,
//       { $set: update },
//       {
//         new: true, // Return the updated document
//         runValidators: true, // Ensure that validation is run on the updated data
//       }
//     );

//     // If no receipt is found with the provided ID, return a 404 error
//     if (!updatedDebitNote) {
//       return res.status(404).json({ message: "Debit Note not found" });
//     }

//     // Send the updated receipt as a response
//     res.status(200).json(updatedDebitNote);
//     console.log("Updated Receipt:", updatedDebitNote);
//   } catch (error) {
//     // Handle errors, e.g., validation errors, database errors, etc.
//     res.status(500).json({ message: error.message });
//   }
// };
// // Delete a Debit Note
// exports.deleteDebitNote = async (req, res) => {
//   try {
//     const deletedDebitNote = await DebitNote.findByIdAndDelete(req.params.id);
//     if (!deletedDebitNote) {
//       return res.status(404).json({ error: "Debit Note not found" });
//     }
//     res.json({ message: "Debit Note deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting debit note:", error);
//     res.status(500).json({ error: "Failed to delete debit note" });
//   }
// };
const DebitNote = require("../models/debitNoteSchema");
const Ledger = require("../models/ledgerSchema");

exports.createDebitNote = async (req, res) => {
  try {
    // Create a new debit note and set the owner
    const newDebitNote = new DebitNote({
      ...req.body,
      owner: req.user._id, // Assuming req.user contains the authenticated user's info
    });
    const savedDebitNote = await newDebitNote.save();
    res.status(201).json(savedDebitNote);
    console.log("Saved Debit Note:", savedDebitNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Debit Notes
exports.getAllDebitNotes = async (req, res) => {
  try {
    const debitNotes = await DebitNote.find({ owner: req.user._id }); // Filter by owner
    res.status(200).json(debitNotes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single Debit Note by ID
exports.getDebitNoteById = async (req, res) => {
  try {
    const paymentVoucher = await DebitNote.findOne({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    })
      .populate("purchasedTo") // Populate the purchasedTo field with Company details
      .populate("purchasedBy"); // Populate the purchasedBy field with Company details

    if (!paymentVoucher) {
      return res
        .status(404)
        .json({ message: "Payment Voucher not found or not authorized" });
    }

    res.status(200).json(paymentVoucher);
    console.log("Fetched Payment:", paymentVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Debit Note
exports.updateDebitNote = async (req, res) => {
  const { id } = req.params; // Get the debit note ID from the URL parameters

  try {
    // Find the debit note by ID and update it with the new data from the request body
    const updatedDebitNote = await DebitNote.findOneAndUpdate(
      { _id: id, owner: req.user._id }, // Ensure the user owns the debit note
      {
        ...req.body, // Spread the updated fields from the request body
      },
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    // If the debit note was not found, return a 404 response
    if (!updatedDebitNote) {
      return res
        .status(404)
        .json({ message: "Debit Note not found or not authorized" });
    }

    // Respond with the updated debit note
    res.status(200).json(updatedDebitNote);
    console.log("Updated Debit Note:", updatedDebitNote);
  } catch (error) {
    // Catch and respond with an error message in case of failure
    console.error("Error updating Debit Note:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a Debit Note
exports.deleteDebitNote = async (req, res) => {
  try {
    const debitNote = await DebitNote.findOne({
      _id: req.params.id,
      owner: req.user._id, // Ensure the user is the owner
    });

    if (!debitNote) {
      return res.status(404).json({ error: "Debit Note not found" });
    }

    await DebitNote.findByIdAndDelete(req.params.id);
    res.json({ message: "Debit Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting debit note:", error);
    res.status(500).json({ error: "Failed to delete debit note" });
  }
};
