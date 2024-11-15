// const CreditNote = require("../models/creditNoteSchema");

// const mongoose = require("mongoose");

// // Create a new credit note
// const createCreditNote = async (req, res) => {
//   console.log("Credit Note Data:", req.body);
//   try {
//     const newCreditNote = new CreditNote(req.body);
//     const savedCreditNote = await newCreditNote.save();
//     res.status(201).json(savedCreditNote);
//     console.log("Saved Credit Note:", savedCreditNote);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a credit note by ID
// const updateCreditNote = async (req, res) => {
//   const { id } = req.params; // Extract the ID from the request parameters

//   try {
//     // Log the entire request body
//     console.log("Request Body:", req.body);

//     // Check if the request body contains the updated receipt
//     const update = req.body.updatedCreditNote;

//     if (!update) {
//       // If update is undefined or null, return a 400 Bad Request error
//       return res.status(400).json({ message: "No update data provided" });
//     }

//     // Find the existing receipt by ID and update it with the new data
//     const updatedCreditNote = await CreditNote.findByIdAndUpdate(
//       id,
//       { $set: update },
//       {
//         new: true, // Return the updated document
//         runValidators: true, // Ensure that validation is run on the updated data
//       }
//     );

//     // If no receipt is found with the provided ID, return a 404 error
//     if (!updatedCreditNote) {
//       return res.status(404).json({ message: "Credit Note not found" });
//     }

//     // Send the updated receipt as a response
//     res.status(200).json(updatedCreditNote);
//     console.log("Updated credit:", updatedCreditNote);
//   } catch (error) {
//     // Handle errors, e.g., validation errors, database errors, etc.
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all credit notes
// const getAllCreditNotes = async (req, res) => {
//   try {
//     const creditNotes = await CreditNote.find()
//       .populate("purchasedTo") // Populate the purchasedTo field with Company details
//       .populate("purchasedBy"); // Populate the purchasedBy field with Company details

//     res.status(200).json(creditNotes); // Sends the fetched credit notes as JSON
//     console.log("Fetched Credit Notes:", creditNotes);
//   } catch (error) {
//     res.status(500).json({ message: error.message }); // Sends an error message if something goes wrong
//   }
// };

// // Get a single credit note by ID
// const getCreditNoteById = async (req, res) => {
//   try {
//     const creditNote = await CreditNote.findById(req.params.id)
//       .populate("purchasedTo") // Populate the purchasedTo field with Company details
//       .populate("purchasedBy"); // Populate the purchasedBy field with Company details

//     if (!creditNote) {
//       return res.status(404).json({ message: "Credit note not found" });
//     }

//     res.status(200).json(creditNote);
//     console.log("Fetched Credit Note:", creditNote);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete a credit note by ID
// const deleteCreditNote = async (req, res) => {
//   try {
//     const deletedCreditNote = await CreditNote.findByIdAndDelete(req.params.id);
//     if (!deletedCreditNote)
//       return res.status(404).json({ message: "Credit note not found" });
//     res.status(200).json({ message: "Credit note deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   createCreditNote,
//   getAllCreditNotes,
//   getCreditNoteById,
//   updateCreditNote,
//   deleteCreditNote,
// };
const CreditNote = require("../models/creditNoteSchema");
const mongoose = require("mongoose");

// Create a new credit note
const createCreditNote = async (req, res) => {
  console.log("Credit Note Data:", req.body);
  try {
    // Assuming the owner is passed in the request body
    const newCreditNote = new CreditNote({
      ...req.body,
      owner: req.user._id, // Assuming req.user is set with the authenticated user's data
    });
    const savedCreditNote = await newCreditNote.save();
    res.status(201).json(savedCreditNote);
    console.log("Saved Credit Note:", savedCreditNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a credit note by ID
const updateCreditNote = async (req, res) => {
  const { id } = req.params; // Get purchase ID from request parameters

  try {
    // Find the purchase by ID and update it with the data from the request body
    const updatedPurchase = await CreditNote.findByIdAndUpdate(
      id,
      {
        ...req.body, // Spread the updated fields from the request body
      },
      { new: true } // This option returns the updated document
    );

    // Check if the purchase was found and updated
    if (!updatedPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json(updatedPurchase); // Respond with the updated purchase
  } catch (error) {
    console.error("Error updating purchase:", error); // Log the error for debugging
    res.status(500).json({ message: error.message }); // Respond with an error message
  }
};

// Get all credit notes
const getAllCreditNotes = async (req, res) => {
  try {
    const creditNotes = await CreditNote.find({ owner: req.user._id }) // Filter by owner
      .populate("purchasedTo")
      .populate("purchasedBy");

    res.status(200).json(creditNotes);
    console.log("Fetched Credit Notes:", creditNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single credit note by ID
const getCreditNoteById = async (req, res) => {
  try {
    const creditNote = await CreditNote.findOne({
      _id: req.params.id,
      owner: req.user._id, // Ensure the user is the owner
    })
      .populate("purchasedTo")
      .populate("purchasedBy");

    if (!creditNote) {
      return res.status(404).json({ message: "Credit note not found" });
    }

    res.status(200).json(creditNote);
    console.log("Fetched Credit Note:", creditNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a credit note by ID
const deleteCreditNote = async (req, res) => {
  try {
    const creditNote = await CreditNote.findOne({
      _id: req.params.id,
      owner: req.user._id, // Ensure the user is the owner
    });

    if (!creditNote) {
      return res.status(404).json({ message: "Credit note not found" });
    }

    await CreditNote.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Credit note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCreditNote,
  getAllCreditNotes,
  getCreditNoteById,
  updateCreditNote,
  deleteCreditNote,
};
