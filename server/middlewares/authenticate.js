const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from the header

  if (!token) {
    return next(new ErrorHandler("Login first to handle this resource", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    // Check if user was found
    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role ${req.user.role} is not allowed`, 403)
      );
    }
    next();
  };
};
