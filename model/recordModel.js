const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  remarks: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  busNumber: {
    type: String,
    required: true,
    trim: true,
  },
  challanType: {
    type: String,
    enum: ['overspeeding', 'traffic_violation', 'parking', 'other'],
    default: 'overspeeding',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
