// const mongoose = require("mongoose");

// // PayHeadDetails schema
// const payHeadDetailsSchema = new mongoose.Schema({
//   date: {
//     type: Date,
//     required: false,
//   },
//   employeeId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Employee",
//     required: true,
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true, // Reference to User model
//   },
//   details: [
//     {
//       payHeadId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Ledger",
//         required: false,
//       },
//       rate: {
//         type: Number,
//         required: false,
//       },
//       totalDays: {
//         type: Number,
//         required: false,
//       },
//       totalHoursPerDay: {
//         type: Number,
//         required: false,
//       },
//       totalDaysPerMonth: {
//         type: Number,
//         required: false,
//       },

//       overtime: {
//         type: Number,
//         required: false,
//       },
//       payHeadType: {
//         type: String,
//         required: false,
//       },
//       payHeadName: {
//         type: String,
//         required: false,
//       },
//       calculationType: {
//         type: String,
//         required: false,
//       },
//       computedOn: {
//         type: String,
//         required: false,
//       },
//       category: {
//         type: String,
//         required: false,
//         default: null,
//       },
//       group: {
//         type: String,
//         required: false,
//         default: null,
//       },
//       nature: {
//         type: String,
//         required: false,
//         default: null,
//       },
//       displayNameInPayslip: {
//         type: String,
//         required: false,
//       },
//       operations: [
//         {
//           operands: {
//             type: [String],
//             required: false,
//           },
//           operator: {
//             type: String,
//             required: false,
//           },
//         },
//       ],
//       numberOfCalculations: {
//         type: Number,
//         required: false,
//         default: 1,
//       },
//       under: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Ledger",
//         required: false,
//       },
//     },
//   ],
//   calculatedValue: {
//     type: Number,
//     required: false,
//   },
// });

// // Pre-save hook to prevent duplicate pay head creation
// payHeadDetailsSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     // Check only on new records
//     try {
//       // Gather all payHeadIds from the details
//       const payHeadIds = this.details.map((detail) => detail.payHeadId);

//       // Check for existing entries with the same employeeId, owner, and payHeadId
//       const existingPayHead = await PayHeadDetails.findOne({
//         employeeId: this.employeeId,
//         owner: this.owner,
//         "details.payHeadId": { $in: payHeadIds },
//       });

//       if (existingPayHead) {
//         const error = new Error(
//           "Duplicate pay head detected: One or more pay heads already exist for this employee."
//         );
//         error.status = 400; // Bad request
//         return next(error);
//       }
//     } catch (error) {
//       return next(error);
//     }
//   }
//   next();
// });

// // Create the model
// const PayHeadDetails = mongoose.model("PayHeadDetails", payHeadDetailsSchema);

// module.exports = PayHeadDetails;

const mongoose = require("mongoose");

// PayHeadDetails schema
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
    // Check only on new records
    try {
      const payHeadIds = this.details.map((detail) => detail.payHeadId);

      // Check for existing entries with the same employeeId, owner, month, year, and payHeadId
      const existingPayHead = await PayHeadDetails.findOne({
        employeeId: this.employeeId,
        owner: this.owner,
        date: {
          $gte: new Date(this.year, this.month - 1, 1),
          $lt: new Date(this.year, this.month, 1),
        },
        "details.payHeadId": { $in: payHeadIds },
      });

      if (existingPayHead) {
        const error = new Error(
          "Duplicate pay head detected: A pay head entry already exists for this employee in the same month and year."
        );
        error.status = 400; // Bad request
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

// Create the model
const PayHeadDetails = mongoose.model("PayHeadDetails", payHeadDetailsSchema);

module.exports = PayHeadDetails;
