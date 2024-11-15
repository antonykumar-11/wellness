const VehicleRegistration = require("../models/vehicleRegistrationSchema");

// Create a new vehicle registration
exports.createVehicleRegistration = async (req, res) => {
  try {
    const vehicleRegistration = new VehicleRegistration(req.body);
    await vehicleRegistration.save();
    res.status(201).json(vehicleRegistration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all vehicle registrations
exports.getAllVehicleRegistrations = async (req, res) => {
  try {
    const vehicleRegistrations = await VehicleRegistration.find();
    res.status(200).json(vehicleRegistrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single vehicle registration by ID
exports.getVehicleRegistrationById = async (req, res) => {
  try {
    const vehicleRegistration = await VehicleRegistration.findById(
      req.params.id
    );
    if (!vehicleRegistration) {
      return res
        .status(404)
        .json({ message: "Vehicle registration not found" });
    }
    res.status(200).json(vehicleRegistration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a vehicle registration by ID
exports.updateVehicleRegistration = async (req, res) => {
  try {
    const vehicleRegistration = await VehicleRegistration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!vehicleRegistration) {
      return res
        .status(404)
        .json({ message: "Vehicle registration not found" });
    }
    res.status(200).json(vehicleRegistration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a vehicle registration by ID
exports.deleteVehicleRegistration = async (req, res) => {
  try {
    const vehicleRegistration = await VehicleRegistration.findByIdAndDelete(
      req.params.id
    );
    if (!vehicleRegistration) {
      return res
        .status(404)
        .json({ message: "Vehicle registration not found" });
    }
    res
      .status(200)
      .json({ message: "Vehicle registration deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
