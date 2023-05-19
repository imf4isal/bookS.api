const mongoose = require('mongoose');
const validator = require('validator');

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

const User = mongoose.model('User', userSchema);

module.exports = User;
