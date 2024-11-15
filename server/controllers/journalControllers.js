// const JournalVoucher = require("../models/journalSchema");

// // Create a new Journal Voucher
// exports.createJournalVoucher = async (req, res) => {
//   console.log("journal", req.body);
//   try {
//     const newJournalVoucher = new JournalVoucher(req.body);
//     const savedJournalVoucher = await newJournalVoucher.save();
//     res.status(201).json(savedJournalVoucher);
//     console.log("journal", savedJournalVoucher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all Journal Vouchers
// exports.getAllJournalVouchers = async (req, res) => {
//   try {
//     const journalVouchers = await JournalVoucher.find();
//     res.status(200).json(journalVouchers);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a single Journal Voucher by ID
// exports.getJournalVoucherById = async (req, res) => {
//   try {
//     const journalVoucher = await JournalVoucher.findById(req.params.id);
//     if (!journalVoucher) {
//       return res.status(404).json({ message: "Journal Voucher not found" });
//     }
//     res.status(200).json(journalVoucher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a Journal Voucher by ID
// exports.updateJournalVoucher = async (req, res) => {
//   try {
//     const updatedJournalVoucher = await JournalVoucher.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedJournalVoucher) {
//       return res.status(404).json({ message: "Journal Voucher not found" });
//     }
//     res.status(200).json(updatedJournalVoucher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete a Journal Voucher by ID
// exports.deleteJournalVoucher = async (req, res) => {
//   try {
//     const deletedJournalVoucher = await JournalVoucher.findByIdAndDelete(
//       req.params.id
//     );
//     if (!deletedJournalVoucher) {
//       return res.status(404).json({ message: "Journal Voucher not found" });
//     }
//     res.status(200).json({ message: "Journal Voucher deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const JournalVoucher = require("../models/journalSchema");

// Create a new Journal Voucher
exports.createJournalVoucher = async (req, res) => {
  console.log("journal", req.body);
  try {
    const newJournalVoucher = new JournalVoucher({
      ...req.body,
      owner: req.user._id, // Set the owner to the logged-in user's ID
    });
    const savedJournalVoucher = await newJournalVoucher.save();
    res.status(201).json(savedJournalVoucher);
    console.log("journal", savedJournalVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Journal Vouchers for the logged-in user
exports.getAllJournalVouchers = async (req, res) => {
  try {
    const journalVouchers = await JournalVoucher.find({ owner: req.user._id }); // Fetch only the user's vouchers
    res.status(200).json(journalVouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Journal Voucher by ID
exports.getJournalVoucherById = async (req, res) => {
  try {
    const journalVoucher = await JournalVoucher.findOne({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    });
    if (!journalVoucher) {
      return res
        .status(404)
        .json({ message: "Journal Voucher not found or not authorized" });
    }
    res.status(200).json(journalVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Journal Voucher by ID
exports.updateJournalVoucher = async (req, res) => {
  try {
    const updatedJournalVoucher = await JournalVoucher.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, // Ensure the owner matches
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedJournalVoucher) {
      return res
        .status(404)
        .json({ message: "Journal Voucher not found or not authorized" });
    }
    res.status(200).json(updatedJournalVoucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Journal Voucher by ID
exports.deleteJournalVoucher = async (req, res) => {
  try {
    const deletedJournalVoucher = await JournalVoucher.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id, // Ensure the owner matches
    });
    if (!deletedJournalVoucher) {
      return res
        .status(404)
        .json({ message: "Journal Voucher not found or not authorized" });
    }
    res.status(200).json({ message: "Journal Voucher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
