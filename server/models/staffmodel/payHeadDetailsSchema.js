const mongoose = require("mongoose");

// PayHeadDetails Schema
const payHeadDetailsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  details: [
    {
      payHeadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ledger",
        required: false,
      },
      rate: {
        type: Number,
        required: false,
      },
      totalDays: {
        type: Number,
        required: false,
      },
      totalHoursPerDay: {
        type: Number,
        required: false,
      },
      totalDaysPerMonth: {
        type: Number,
        required: false,
      },
      overtime: {
        type: Number,
        required: false,
      },
      payHeadType: {
        type: String,
        required: false,
      },
      payHeadName: {
        type: String,
        required: false,
      },
      calculationType: {
        type: String,
        required: false,
      },
      computedOn: {
        type: String,
        required: false,
      },
      category: {
        type: String,
        required: false,
        default: null,
      },
      group: {
        type: String,
        required: false,
        default: null,
      },
      nature: {
        type: String,
        required: false,
        default: null,
      },
      displayNameInPayslip: {
        type: String,
        required: false,
      },
      operations: [
        {
          operands: {
            type: [String],
            required: false,
          },
          operator: {
            type: String,
            required: false,
          },
        },
      ],
      numberOfCalculations: {
        type: Number,
        required: false,
        default: 1,
      },
      under: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ledger",
        required: false,
      },
    },
  ],
  calculatedValue: {
    type: Number,
    required: false,
  },
});

// Virtual fields to extract month and year from `date`
payHeadDetailsSchema.virtual("month").get(function () {
  return this.date ? this.date.getMonth() + 1 : null; // getMonth() is 0-indexed
});

payHeadDetailsSchema.virtual("year").get(function () {
  return this.date ? this.date.getFullYear() : null;
});

// Pre-save hook to prevent duplicate pay head creation for the same employee, month, and year
payHeadDetailsSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // Check if an entry exists for the same employee, owner, and month/year
      const existingPayHead = await mongoose.models.PayHeadDetails.findOne({
        employeeId: this.employeeId,
        owner: this.owner,
        date: {
          $gte: new Date(this.year, this.month - 1, 1), // Start of the month
          $lt: new Date(this.year, this.month, 1), // Start of the next month
        },
      });

      if (existingPayHead) {
        const error = new Error(
          "Duplicate entry: Salary already exists for this employee in the same month and year."
        );
        error.status = 400;
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Ensure virtuals are included when converting to JSON
payHeadDetailsSchema.set("toJSON", { virtuals: true });
payHeadDetailsSchema.set("toObject", { virtuals: true });

// Create a compound unique index to prevent duplicates
payHeadDetailsSchema.index(
  { employeeId: 1, owner: 1, date: 1 },
  { unique: true }
);

// Create the model
const PayHeadDetails = mongoose.model("PayHeadDetails", payHeadDetailsSchema);

module.exports = PayHeadDetails;
