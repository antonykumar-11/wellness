const Ledger = require("../models/ledgerSchema"); // Adjust the path as needed
const Tax = require("../models/taxScheema"); // Adjust the path as needed

const findTaxRelatedLedger = async (req, res) => {
  console.log("tax", req.body);
  try {
    // Find the ledger with the group "Duties & Taxes"
    const ledger = await Ledger.findOne({ group: "Duties & Taxes" });

    if (!ledger) {
      return res
        .status(404)
        .json({ message: "Ledger with group 'Duties & Taxes' not found." });
    }

    // Check if there's a Tax entry with this ledger's ID
    const taxExists = await Tax.find({ taxId: ledger._id });

    if (!taxExists || taxExists.length === 0) {
      return res.status(404).json({
        message: "No Tax entry associated with the specified ledger ID.",
      });
    }

    // Send the tax entries as JSON response
    res.status(200).json(taxExists);
  } catch (error) {
    console.error("Error finding tax-related ledger:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  findTaxRelatedLedger,
};
