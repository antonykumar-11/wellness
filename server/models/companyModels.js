// models/companyModel.js
const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: false,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
    registrationType: {
      type: String,
      required: false,
    },
    registrationUnder: {
      type: String,
      required: false,
    },
    street: {
      type: String,
      required: false,
    },
    MainArea: {
      type: String,
      required: false,
    },
    postOffice: {
      type: String,
      required: false,
    },
    ZIPCode: {
      type: String,
      required: false,
    },
    City: {
      type: String,
      required: false,
    },
    State: {
      type: String,
      required: false,
    },
    Country: {
      type: String,
      required: false,
    },
    companyMobile: {
      type: String,
      required: false,
    },
    companyEmail: {
      type: String,
      required: false,
    },
    gstNumber: {
      type: String,
      required: false,
    },
    companyPanNumber: {
      type: String,
      required: false,
    },
    companyAdarNumber: {
      type: String,
    },
    bankName: {
      type: String,
      required: false,
    },
    branch: {
      type: String,
      required: false,
    },
    accountNumber: {
      type: String,
      required: false,
    },
    ifscCode: {
      type: String,
      required: false,
    },
    authorizedByName: {
      type: String,
      required: false,
    },
    authorizedByDesignation: {
      type: String,
      required: false,
    },
    authorizedBySignature: {
      type: String,
      required: false,
    },
    tanNumber: {
      type: String,
    },
    tdsDeductionNo: {
      type: String,
    },
    image: {
      type: String,
    },
  },

  {
    timestamps: false, // Adds createdAt and updatedAt fields
  }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
