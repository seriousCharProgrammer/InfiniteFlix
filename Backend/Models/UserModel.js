const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required for the user'],
    trim: true,
    maxlength: [70, 'name cannot be longer than 70 character'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'A user requires an email.'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'please add a valid email'],
  },
  password: {
    type: String,
    required: [true, 'A User require password'],
    select: false,
  },
  favorits: {
    type: [String],
    required: false,
    default: [],
  },
  lastWatched: {
    type: [String],
    required: false,
    default: [],
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXP,
  });
};
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
