const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    maxlength: [6, "Password cannot exceed 6 characters"],
    select: false,
  },
  avatar: {
    type: String,
  },
  companyName: {
    type: String,
  },
  mobileNumber: {
    type: String,
    required: false,
    unique: false,
  },
  invoiceType: {
    type: String,
  },
  address1: {
    type: String,
  },
  address2: {
    type: String,
  },
  address3: {
    type: String,
  },
  address4: {
    type: String,
  },
  gstNumber: {
    type: String,
  },
  role: {
    type: String,
  },
  bankName: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  description: {
    type: String,
  },
  ifsc: {
    type: String,
  },
  branch: {
    type: String,
  },
  pancardnumber: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// Validate entered password
userSchema.methods.isValidPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate reset password token
userSchema.methods.getResetToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
