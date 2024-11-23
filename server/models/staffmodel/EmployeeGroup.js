const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeGroupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Reference to User model
  },
  avatar: {
    type: String, // This will store the URL or path to the avatar image
    required: false, // This field is optional
  },
});

// Create a compound index for name and owner to enforce uniqueness per user
employeeGroupSchema.index({ name: 1, owner: 1 }, { unique: true });

const Employeegroup = mongoose.model("Employeegroup", employeeGroupSchema);

module.exports = Employeegroup;
