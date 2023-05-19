const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name must be provided.'],
  },
  email: {
    type: String,
    required: [true, `Email field can't be empty.`],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Enter a valid email.'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Provide a password.'],
    minlength: 4,
  },
  confirmedPass: {
    type: String,
    required: [true, 'Confirm your password.'],
    validate: {
      validator: function (pass) {
        return pass === this.password;
      },
      message: 'Password has not been confirmed.',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmedPass = undefined;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
