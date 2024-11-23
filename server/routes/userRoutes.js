const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateProfile,
  deleteUser, // Make sure deleteUser is imported here
} = require("../controllers/userController");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");

const router = express.Router();

// Multer configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/user"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

// Route Definitions
router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/password/change").put(isAuthenticatedUser, changePassword);
router.route("/myprofile").get(isAuthenticatedUser, getUserProfile);
router.route("/delete/:id").delete(isAuthenticatedUser, deleteUser); // Updated to use DELETE method

router
  .route("/update")
  .put(isAuthenticatedUser, upload.single("avatar"), updateProfile);

module.exports = router;
