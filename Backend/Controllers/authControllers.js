const asyncHandler = require('express-async-handler');
const User = require('../Models/UserModel');
const ErrorResponse = require('../utils/errorResponse');
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('please  provide and email', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('user provided dosent exist', 400));
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('wrong email or password please retry'), 400);
  }
  sendTokenResponse(user, 200, res);
});

exports.register = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const usercheck = await User.findOne({ email });
  if (usercheck) {
    return next(new ErrorResponse('user provided already exist', 400));
  }

  const user = await User.create(req.body);
  sendTokenResponse(user, 200, res);
});
exports.logout = asyncHandler(async (req, res, next) => {
  res.clearCookie('token', { httpOnly: true });

  res.status(200).json({
    success: true,
    data: null,
  });
});

const sendTokenResponse = function (user, statusCode, res) {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
};
