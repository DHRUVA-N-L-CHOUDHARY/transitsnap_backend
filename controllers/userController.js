const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { userName, phoneNumber, accountType, imageUrl } = req.body;

    // Validate required fields
    if (!userName || !phoneNumber) {
      return res
        .status(400)
        .json({ message: "userName and phoneNumber are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this phone number." });
    }

    // Create and save user
    const user = new User({ userName, phoneNumber, accountType, imageUrl });
    user.token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit user profile
exports.editUserProfile = async (req, res) => {
  try {
    const { userId, userName, imageUrl } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.userName = userName || user.userName;
    user.imageUrl = imageUrl || user.imageUrl;

    await user.save();
    res.json({ message: "User profile updated", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getUserDetailsByPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    // Validate if phoneNumber is provided
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required.' });
    }

    // Validate the phone number format (assuming a 10-digit number)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number format. It should be a 10-digit number.' });
    }

    // Fetch user by phone number
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.active) {
      return res.status(403).json({ message: 'User is inactive.' });
    }

    // Return user details if found
    res.status(200).json({
      message: 'User details fetched successfully.',
      user,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user details with search, filter, and sorting functionality
exports.getUserDetails = async (req, res) => {
  try {
    const {
      search,
      active,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = req.body; // Default page 1, limit 10 per page

    let searchQuery = {};
    if (search) {
      if (!isNaN(search)) {
        searchQuery = {
          phoneNumber: { $regex: search, $options: "i" },
        };
      } else {
        searchQuery = {
          userName: { $regex: search, $options: "i" },
        };
      }
    }

    let filterQuery = {};
    if (active !== undefined) {
      filterQuery.active = active == true;
    }

    let sortQuery = {};
    if (sortBy && sortOrder) {
      const sortField = sortBy === "userName" ? "userName" : "phoneNumber";
      const sortDirection = sortOrder === "asc" ? 1 : -1;
      sortQuery[sortField] = sortDirection;
    }

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // Calculate the number of documents to skip based on current page and limit
    const skip = (pageNumber - 1) * pageSize;

    // Fetch the users with pagination, search, filter, and sort
    const users = await User.find({ ...searchQuery, ...filterQuery })
      .sort(sortQuery)
      .skip(skip)
      .limit(pageSize);

    // Count total documents for pagination
    const totalUsers = await User.countDocuments({
      ...searchQuery,
      ...filterQuery,
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Send the users along with pagination info
    res.json({
      totalUsers, // Total number of matching users
      totalPages: Math.ceil(totalUsers / pageSize), // Total number of pages
      currentPage: pageNumber, // Current page number
      users, // Users for the current page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTotalUsers = async (req, res) => {
  try {
    // Fetch the total number of users
    const totalUsers = await User.countDocuments();

    // Return the result in JSON format
    res.status(200).json({
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.active = false;
    await user.save();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.reactivateUser = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    // Find the user by phone number
    const user = await User.findOne({ phoneNumber });
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Reactivate the user if they are inactive
    if (!user.active) {
      user.active = true;
      await user.save();

      return res.status(200).json({ message: "User reactivated successfully." });
    }

    // If user is already active
    res.status(400).json({ message: "User is already active." });
  } catch (error) {
    console.error("Error reactivating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};