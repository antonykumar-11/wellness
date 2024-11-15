const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VehicleRentSchema = new Schema({
  vehicleNumber: {
    type: String,
    required: true,
  },
  vehicleName: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  openingTime: {
    type: String,
    default: "",
  },
  closingTime: {
    type: String,
    default: "",
  },
  totalHMR: {
    type: Number,
    default: 0,
  },
  otHours: {
    type: Number,
    default: 0,
  },
  bdHours: {
    type: Number,
    default: 0,
  },
  openingKm: {
    type: Number,
    default: 0,
  },
  closingKm: {
    type: Number,
    default: 0,
  },
  totalKm: {
    type: Number,
    default: 0,
  },
  diesel: {
    type: Number,
    default: 0,
  },
  remarks: {
    type: String,
    default: "",
  },
  totalHours: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
});

// Unique index to prevent duplicate entries
VehicleRentSchema.index(
  { vehicleNumber: 1, owner: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("VehicleRent", VehicleRentSchema);
