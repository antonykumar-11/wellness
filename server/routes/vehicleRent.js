// routes/vehicleRentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createVehicleRent,
  getAllVehicleRents,
  getVehicleRentById,
  updateVehicleRent,
  deleteVehicleRent,
} = require("../controllers/StaffController/vehicleRentcontoller");

const { isAuthenticatedUser } = require("../middlewares/authenticate");
// Create a new Vehicle Rent /(protected)
router.post("/", isAuthenticatedUser, createVehicleRent);

// Get all Vehicle Rents of the logged-in user (protected)
router.get("/", isAuthenticatedUser, getAllVehicleRents);

// Get a specific Vehicle Rent by ID (protected)
router.get("/:id", isAuthenticatedUser, getVehicleRentById);

// Update a specific Vehicle Rent by ID (protected)
router.put("/:id", isAuthenticatedUser, updateVehicleRent);

// Delete a specific Vehicle Rent by ID (protected)
router.delete("/:id", isAuthenticatedUser, deleteVehicleRent);

module.exports = router;
