const mongoose = require("mongoose");

const transectionTrackSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    type: {
      type: String,
      required: [true, "type is required"],
    },
    category: {
      type: String,
      requires: [true, "category is required"],
    },
    refrence: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    date: {
      type: Date,
      required: [true, "date is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
transectionTrackSchema.index({ owner: 1 }, { unique: true });
const transectionTrackModel = mongoose.model(
  "transectionsTrack",
  transectionTrackSchema
);
module.exports = transectionTrackModel;
