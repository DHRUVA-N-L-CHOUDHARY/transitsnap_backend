const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { userName, email, phoneNumber, accountType } = req.body;

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
    const user = new User({ userName, email, phoneNumber, accountType });
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

// Get user details with search, filter, and sorting functionality
exports.getUserDetails = async (req, res) => {
  try {
    const { search, isActive, sortBy, sortOrder } = req.body;

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
    if (isActive !== undefined) {
      filterQuery.active = isActive;
    }

    let sortQuery = {};
    if (sortBy && sortOrder) {
      const sortField = sortBy === "userName" ? "userName" : "phoneNumber";
      const sortDirection = sortOrder === "asc" ? 1 : -1;
      sortQuery[sortField] = sortDirection;
    }

    const users = await User.find({ ...searchQuery, ...filterQuery }).sort(
      sortQuery
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all user details
exports.getAllUsers = async (res) => {
  try {
    const users = await User.find({ accountType: "Driver" }); // Fetches all user records
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
