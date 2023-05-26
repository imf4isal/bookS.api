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
    select: false,
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
  passwordChangedAt: Date,
});

//encrypt password before saving it into database
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// userSchema.pre('save', function (next) {
//   if (!this.isModified('password') || this.isNew) return next();

//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

userSchema.methods.correctPassword = async function (
  candidatePassword,
  originalPassword
) {
  return await bcrypt.compare(candidatePassword, originalPassword);
};

userSchema.methods.isPassChanged = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changePassTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(jwtTimeStamp, changePassTimeStamp);
    return jwtTimeStamp < changePassTimeStamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
