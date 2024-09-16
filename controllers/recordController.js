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
    } = req.body;

    console.log(req.body); // For debugging

    // Initialize the filter query
    const filterQuery = {};

    // If search is not empty, add search conditions
    if (search && search.trim() !== '') {
      filterQuery.$or = [
        { recordName: { $regex: search, $options: "i" } }, // Case-insensitive search
        { busNumber: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by payment status (isPaid)
    if (isPaid !== undefined) {
      filterQuery.isPaid = isPaid; // Assuming isPaid is a boolean
    }

    // Filter by active/inactive status (isDelete)
    if (isDelete !== undefined) {
      filterQuery.isDelete = isDelete; // Assuming isDelete is a boolean
    }

    // Build sorting query
    const sortQuery = {};
    sortQuery[sortBy] = sortOrder === 'desc' ? -1 : 1; // Sort by the provided field

    // Fetch records with filters, sorting, and pagination
    const records = await Record.find(filterQuery)
      .populate("userID", "userName phoneNumber") // Populating related user fields
      .sort(sortQuery) // Apply sorting
      .limit(parseInt(limit)) // Limit results per page
      .skip((parseInt(page) - 1) * limit) // Skip to the correct page
      .exec();

    // Count the total number of matching records for pagination
    const count = await Record.countDocuments(filterQuery);

    // Return the results along with pagination info
    res.json({
      records,
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ message: "Server error" });
  }
};


