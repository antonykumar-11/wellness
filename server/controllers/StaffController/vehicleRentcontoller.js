// controllers/vehicleRentController.js
const VehicleRent = require("../../models/vehicleRentSchema");

// Create a new Vehicle Rent (assign logged-in user as owner)
exports.createVehicleRent = async (req, res) => {
  try {
    const newRent = new VehicleRent({
      ...req.body,
      owner: req.user._id, // Set owner to the logged-in user
    });

    const savedRent = await newRent.save();
    res.status(201).json(savedRent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all Vehicle Rents of the logged-in user
exports.getAllVehicleRents = async (req, res) => {
  try {
    const rents = await VehicleRent.find({ owner: req.user._id }); // Only get rents of the logged-in user
    res.status(200).json(rents);
    console.log("rentsrentsrentsrentsrentsrents", rents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a Vehicle Rent by ID (check if logged-in user is the owner)
exports.getVehicleRentById = async (req, res) => {
  try {
    const rent = await VehicleRent.findOne({
      _id: req.params.id,
      owner: req.user._id,
    }); // Ensure the rent belongs to the user
    if (!rent)
      return res.status(404).json({ message: "Vehicle Rent not found" });
    res.status(200).json(rent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a Vehicle Rent (check if logged-in user is the owner)
exports.updateVehicleRent = async (req, res) => {
  try {
    const updatedRent = await VehicleRent.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, // Ensure the rent belongs to the user
      req.body,
      { new: true }
    );

    if (!updatedRent) {
      return res.status(404).json({ message: "Vehicle Rent not found" });
    }

    res.status(200).json(updatedRent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a Vehicle Rent (check if logged-in user is the owner)
exports.deleteVehicleRent = async (req, res) => {
  try {
    const rent = await VehicleRent.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    }); // Ensure the rent belongs to the user
    if (!rent)
      return res.status(404).json({ message: "Vehicle Rent not found" });
    res.status(200).json({ message: "Vehicle Rent deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
