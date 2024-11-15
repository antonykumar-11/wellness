const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true }, // Ensuring phone number is unique
    last_called: { type: Date, default: null },
    next_call: { type: Date, default: null },
  },
  { timestamps: true }
);

// If you want a compound index for 'name' and 'phone_number'
CustomerSchema.index({ phone_number: 1 }, { unique: true });

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
