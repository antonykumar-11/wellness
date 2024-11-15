// const express = require("express");
// const router = express.Router();
// const payHeadController = require("../../controllers/StaffController/payHead"); // Adjust the path as needed

// // Create a new PayHead
// router.post("/payheads", payHeadController.createPayHead);

// // Get all PayHeads
// router.get("/payheads", payHeadController.getAllPayHeads);

// // Get a single PayHead by ID
// router.get("/payheads/:id", payHeadController.getPayHeadById);

// // Update a PayHead
// router.put("/payheads/:id", payHeadController.updatePayHead);

// // Delete a PayHead
// router.delete("/payheads/:id", payHeadController.deletePayHead);

// module.exports = router;
// const express = require("express");

// const payHeadController = require("../../controllers/StaffController/payHead"); // Adjust the path as needed
// const router = new express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Configure multer for file uploads
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.join(__dirname, "../../uploads/user"));
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
//   }),
// });
// router.post(
//   "/employees",
//   upload.single("avatar"),
//   payHeadController.createEmployeeOrVehicle
// );
// // Create a new PayHead
// router.post("/payheads", payHeadController.createEmployeeOrVehicle);

// module.exports = router;
const express = require("express");
const payHeadController = require("../../controllers/StaffController/payHead"); // Adjust the path as needed
const { isAuthenticatedUser } = require("../../middlewares/authenticate"); // Import the authentication middleware
const router = new express.Router();
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../../uploads/user"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

// Add `isAuthenticatedUser` middleware to protect the routes
router.post(
  "/employees",
  isAuthenticatedUser, // Ensure the user is authenticated
  upload.single("avatar"),
  payHeadController.createEmployeeOrVehicle
);

router.post(
  "/payheads",
  isAuthenticatedUser, // Ensure the user is authenticated
  payHeadController.createEmployeeOrVehicle
);

module.exports = router;
