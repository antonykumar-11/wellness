// models/companyModel.js
const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
    registrationType: {
      type: String,
      required: true,
    },
    registrationUnder: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    MainArea: {
      type: String,
      required: true,
    },
    postOffice: {
      type: String,
      required: true,
    },
    ZIPCode: {
      type: String,
      required: true,
    },
    City: {
      type: String,
      required: true,
    },
    State: {
      type: String,
      required: true,
    },
    Country: {
      type: String,
      required: true,
    },
    companyMobile: {
      type: String,
      required: true,
    },
    companyEmail: {
      type: String,
      required: true,
    },
    gstNumber: {
      type: String,
      required: true,
    },
    companyPanNumber: {
      type: String,
      required: true,
    },
    companyAdarNumber: {
      type: String,
    },
    bankName: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    ifscCode: {
      type: String,
      required: true,
    },
    authorizedByName: {
      type: String,
      required: true,
    },
    authorizedByDesignation: {
      type: String,
      required: true,
    },
    authorizedBySignature: {
      type: String,
      required: true,
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
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
