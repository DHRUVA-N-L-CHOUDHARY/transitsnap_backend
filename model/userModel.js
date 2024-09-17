const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[0-9]{10}$/,
      'Please fill a valid phone number',
    ],
  },
  accountType: {
    type: String,
    enum: ['Driver', 'Admin'],
    default: 'Driver',
  },
  imageUrl: {
    type: String,
    default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7U_ef87Q7CQ1Fx_khkPq-y9IfPmBWrMZ6ig&s"
  },
  active: {
    type: Boolean,
    default: true,
  },
  token: {
    type: String,
  },
  resetTokenExpires: {
    type: Date,
    default: () => Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
