// Imports
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please Enter your Name.']
    },
    email: {
      type: String,
      required: [true, 'Please Enter your E-mail Address.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid E-mail.']
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user'
    },
    profilePicture: {
      type: String
    },
    password: {
      type: String,
      required: [true, 'Please enter a password that has a minimum of 8 characters'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords do not match!'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Encrypts the Password before storing it into the Database / BCRYPT
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Middleware function to set the passwordChangedAt field if the passsword was modified.
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Middleware to filter out the Inactive Users
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// Checks if the password entered by the user matches the existing password in the database / BCRYPT
userSchema.methods.checkCorrectPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Ckecks if the Password was changed
userSchema.methods.checkPasswordChanged = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }

  // If FALSE then the password was NOT CHANGED
  return false;
};

// Method to create a random token for Forgot password reset
userSchema.methods.createPasswordResetToken = function() {
  // Generation of resetToken to be sent to the user
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
