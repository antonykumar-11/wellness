const express = require("express");
const router = express.Router();
const vehicleRegistrationController = require("../controllers/vehicleRegistrationController");

// Create a new vehicle registration
router.post(
  "/vehicle-registrations",
  vehicleRegistrationController.createVehicleRegistration
);

// Get all vehicle registrations
router.get(
  "/vehicle-registrations",
  vehicleRegistrationController.getAllVehicleRegistrations
);

// Get a single vehicle registration by ID
router.get(
  "/vehicle-registrations/:id",
  vehicleRegistrationController.getVehicleRegistrationById
);

// Update a vehicle registration by ID
router.put(
  "/vehicle-registrations/:id",
  vehicleRegistrationController.updateVehicleRegistration
);

// Delete a vehicle registration by ID
router.delete(
  "/vehicle-registrations/:id",
  vehicleRegistrationController.deleteVehicleRegistration
);

module.exports = router;
