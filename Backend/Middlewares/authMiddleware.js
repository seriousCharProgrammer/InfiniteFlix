const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
const User = require('../Models/UserModel');
dotenv.config({ path: './config/config.env' });

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse('not authorized to access this routes', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(
      new ErrorResponse('not authorized to accesssss this route', 401)
    );
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `user role ${req.user.role} access is not permitted`,
          403
        )
      );
    }
    next();
  };
};
