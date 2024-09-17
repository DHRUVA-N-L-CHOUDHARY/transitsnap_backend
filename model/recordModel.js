const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  recordID: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recordName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  remarks: {
    type: String,
    default:""
  },
  imageUrl: {
    type: String,
    default:"https://static.vecteezy.com/system/resources/previews/000/421/699/non_2x/vector-documents-icon.jpg"
  },
  busNumber: {
    type: String,
    required: true,
    trim: true,
  },
  isPaid: {
    type: Boolean,
    default: true,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  challanType: {
    type: String,
    enum: ["overspeeding", "traffic_violation", "parking", "other", ""],
    default: "overspeeding",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
