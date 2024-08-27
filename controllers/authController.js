const User = require('../model/userModel');
const client = require('../utils/twilioClient');

// Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // const user = await User.findOne({ phoneNumber });

    // if (!user) {
    //   return res.status(404).json({ message: 'User not found' });
    // }

    const verification = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });

    res.status(200).json({ message: 'OTP sent successfully', sid: verification.sid });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks
      .create({ to: phoneNumber, code: otp });

    if (verificationCheck.status === 'approved') {
      // Successful verification, you can log in the user
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(200).json({ message: 'OTP verified sucessfully. Please create a account.' });
      }

      // Here, you can generate a JWT token or create a session
      const token = jwt.sign({ id: user._id, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ message: 'OTP verified successfully' /*, token*/ });
    } else {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};
