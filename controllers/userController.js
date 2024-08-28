const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { userName, email, phoneNumber, accountType } = req.body;

    // Validate required fields
    if (!userName || !phoneNumber) {
      return res.status(400).json({ message: 'userName and phoneNumber are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this phone number.' });
    }

    // Create and save user
    const user = new User({ userName, email, phoneNumber, accountType });
    user.token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5d' });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit user profile
exports.editUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, email, phoneNumber, accountType, active } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.accountType = accountType || user.accountType;
    user.active = typeof active === 'boolean' ? active : user.active;

    await user.save();
    res.json({ message: 'User profile updated', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user details by userPhoneNumber
// Get user details by userPhoneNumber
exports.getUserDetails = async (req, res) => {
  try {
    const { userPhoneNumber } = req.params;
    const user = await User.findOne({ phoneNumber: userPhoneNumber }); // Corrected this line
    console.log(userPhoneNumber);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
