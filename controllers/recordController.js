const Record = require('../model/recordModel');
const User = require('../model/userModel');

// Add a new record
exports.addRecord = async (req, res) => {
  try {
    const { userID, amount, remarks, imageUrl, busNumber, challanType } = req.body;

    // Validate required fields
    if (!userID || !amount || !busNumber) {
      return res.status(400).json({ message: 'userID, amount, and busNumber are required.' });
    }

    // Check if user exists
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create and save record
    const record = new Record({ userID, amount, remarks, imageUrl, busNumber, challanType });
    await record.save();

    res.status(201).json({ message: 'Record added successfully', record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get record details by userID
exports.getRecordsByUserID = async (req, res) => {
  try {
    const { userID } = req.params;

    const records = await Record.find({ userID });

    if (records.length === 0) {
      return res.status(404).json({ message: 'No records found for this user' });
    }

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all records with pagination for admin
exports.getAllRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 records per page

    const records = await Record.find()
      .populate('userID', 'userName phoneNumber')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Record.countDocuments();

    res.json({
      records,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
