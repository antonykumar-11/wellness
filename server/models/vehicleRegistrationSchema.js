const mongoose = require("mongoose");

const vehicleRegistrationSchema = new mongoose.Schema({
  vehicleRegistrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  rentalStartDate: {
    type: Date,
    required: true,
  },
  ownerAddress: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  gst: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: true,
  },
});
// Create a unique index on the owner field only
vehicleRegistrationSchema.index({ owner: 1 }, { unique: true });
const VehicleRegistration = mongoose.model(
  "VehicleRegistration",
  vehicleRegistrationSchema
);

module.exports = VehicleRegistration;
