const Record = require("../model/recordModel");
const User = require("../model/userModel");

// Add a new record
exports.addRecord = async (req, res) => {
  try {
    const {
      userID,
      recordName,
      amount,
      remarks,
      imageUrl,
      busNumber,
      isPaid,
      challanType,
    } = req.body;

    // Validate required fields
    if (!userID || !amount || !busNumber) {
      return res
        .status(400)
        .json({ message: "userID, amount, and busNumber are required." });
    }

    // Check if user exists
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create and save record
    const record = new Record({
      userID,
      recordName,
      amount,
      remarks,
      imageUrl,
      busNumber,
      isPaid,
      challanType,
    });
    await record.save();

    res.status(201).json({ message: "Record added successfully", record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get record details by userID
exports.getRecordsByUserID = async (req, res) => {
  try {
    const { userID } = req.params;

    const records = await Record.find({ userID });

    if (records.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for this user" });
    }

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllRecords = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      isPaid, 
      isDelete, 
      sortBy = 'createdAt', 
      sortOrder = 'asc' 
    } = req.query;

    const filterQuery = {};

    if (search) {
      filterQuery.$or = [
        { recordName: { $regex: search, $options: "i" } }, 
        { busNumber: { $regex: search, $options: "i" } }
      ];
    }

    if (isPaid !== undefined) {
      filterQuery.isPaid = isPaid === true; 
    }

    if (isDelete !== undefined) {
      filterQuery.isDelete = isDelete === false; 
    }

    const sortQuery = {};
    if (sortBy) {
      sortQuery[sortBy] = sortOrder === 'desc' ? -1 : 1; 
    }

    const records = await Record.find(filterQuery)
      .populate("userID", "userName phoneNumber")
      .sort(sortQuery) 
      .limit(limit * 1) 
      .skip((page - 1) * limit) 
      .exec();

    const count = await Record.countDocuments(filterQuery);

    res.json({
      records,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

