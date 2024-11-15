const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const employeeCreateSchema = new Schema({
  registrationType: {
    type: String,
    enum: ["employee", "vehicle"],
    required: true,
    default: "employee", // Default to "employee"
  },
  employeeId: {
    type: Number,
    unique: true,
    sparse: false,
  },
  underEmployee: {
    type: String,
    required: true, // Ensure name is required
  },
  name: {
    type: String,
    required: true, // Ensure name is required
  },
  designation: String,
  address: String,
  under: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employeegroup",
    default: null,
  },
  gender: {
    type: String,
    enum: ["male", "female", "Other"],
  },
  dateOfBirth: Date,
  bloodGroup: String,
  familyDetails: {
    fatherOrMotherName: String,
    spouseName: String,
  },
  contact: {
    phone: String,
    email: String,
  },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    branchName: String,
  },
  incomeTaxPAN: String,
  aadhaarCard: String,
  pfAccountNumber: String,
  prAccountNumber: String,
  esiNumber: String,
  dateOfHire: Date,
  salary: Number,
  status: String,
  attendance: {
    type: String,
    enum: ["Present", "Absent", "Overtime"],
  },
  avatar: String, // Profile picture URL
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Reference to User model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for name and owner to enforce uniqueness per user
employeeCreateSchema.index({ name: 1, owner: 1 }, { unique: true });

// Add auto-increment plugin for employee IDs
employeeCreateSchema.plugin(AutoIncrement, { inc_field: "employeeId" });

const Staff = mongoose.model("EmployeeAdVehicle", employeeCreateSchema);

module.exports = Staff;
