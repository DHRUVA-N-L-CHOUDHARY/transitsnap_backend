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

    const filterQuery = {};

    if (search && search.trim() !== '') {
      filterQuery.$or = [
        { recordName: { $regex: search, $options: "i" } }, // Case-insensitive search
        { busNumber: { $regex: search, $options: "i" } }
      ];
    }

    if (isPaid !== undefined) {
      filterQuery.isPaid = isPaid; // Assuming isPaid is a boolean
    }

    if (isDelete !== undefined) {
      filterQuery.isDelete = isDelete; // Assuming isDelete is a boolean
    }

    const sortQuery = {};
    sortQuery[sortBy] = sortOrder === 'desc' ? -1 : 1; // Sort by the provided field

    const records = await Record.find(filterQuery)
      .populate("userID", "userName phoneNumber") // Populating related user fields
      .sort(sortQuery) // Apply sorting
      .limit(parseInt(limit)) // Limit results per page
      .skip((parseInt(page) - 1) * limit) // Skip to the correct page
      .exec();

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

exports.getTotalRecords = async (req, res) => {
  try {
    // Fetch the total number of records
    const totalRecords = await Record.countDocuments();

    // Return the result in JSON format
    res.status(200).json({
      totalRecords,
    });
  } catch (error) {
    console.error("Error fetching total records:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.markAsDeleted = async (req, res) => {
  try {
    const { id } = req.body; // Get the record ID from the URL parameters

    // Find the record by ID and update the isDelete field to true
    const updatedRecord = await Record.findByIdAndUpdate(
      id, 
      { isDelete: true }, // Set isDelete to true
      { new: true } // Return the updated document
    );

    // If record not found
    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Respond with the updated record
    res.status(200).json({
      message: "Record marked as deleted successfully",
      updatedRecord,
    });
  } catch (error) {
    console.error("Error marking record as deleted:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const { id } = req.body; // Get the record ID from the URL parameters

    // Find the record by ID and update the isPaid field to true
    const updatedRecord = await Record.findByIdAndUpdate(
      id, 
      { isPaid: true }, // Set isPaid to true
      { new: true } // Return the updated document
    );

    // If record not found
    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Respond with the updated record
    res.status(200).json({
      message: "Record marked as paid successfully",
      updatedRecord,
    });
  } catch (error) {
    console.error("Error marking record as paid:", error);
    res.status(500).json({ message: "Server error" });
  }
};

