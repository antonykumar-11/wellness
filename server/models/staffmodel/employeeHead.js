const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  date: {
    type: Date,
    required: true,
  },
});
// Create a compound index for name and owner to enforce uniqueness
employeeSchema.index({ name: 1, owner: 1 }, { unique: true });
const EmployeeHead = mongoose.model("EmployeeHead", employeeSchema);

module.exports = EmployeeHead;
