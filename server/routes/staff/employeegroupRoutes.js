// const express = require("express");
// const router = express.Router();
// const employeegroupController = require("../../controllers/StaffController/employeegroupController");
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

// // Create a new employee group
// router.post(
//   "/",
//   upload.single("avatar"),
//   employeegroupController.createEmployeeGroup
// );

// // Get all employee groups
// router.get("/", employeegroupController.getAllEmployeeGroups);

// // Get a single employee group by ID
// router.get("/:id", employeegroupController.getEmployeeGroupById);

// // Update an employee group by ID
// router.put("/:id", employeegroupController.updateEmployeeGroup);

// // Delete an employee group by ID
// router.delete("/:id", employeegroupController.deleteEmployeeGroup);

// module.exports = router;
// routes/employeegroupRoutes.js
const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../../middlewares/authenticate");
const employeegroupController = require("../../controllers/StaffController/employeegroupController");
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

// Create a new employee group
router.post(
  "/",
  isAuthenticatedUser,
  upload.single("avatar"),
  employeegroupController.createEmployeeGroup
);

// Get all employee groups
router.get(
  "/",
  isAuthenticatedUser,
  employeegroupController.getAllEmployeeGroups
);

// Get a single employee group by ID
router.get(
  "/:id",
  isAuthenticatedUser,
  employeegroupController.getEmployeeGroupById
);

// Update an employee group by ID
router.put(
  "/:id",
  isAuthenticatedUser,
  upload.single("avatar"),
  employeegroupController.updateEmployeeGroup
);

// Delete an employee group by ID
router.delete(
  "/:id",
  isAuthenticatedUser,
  employeegroupController.deleteEmployeeGroup
);

module.exports = router;
