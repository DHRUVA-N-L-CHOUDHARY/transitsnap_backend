const express = require('express');
const {
  registerUser,
  editUserProfile,
  getUserDetails,
  deleteUser,
  getTotalUsers,
  getUserDetailsByPhoneNumber,
  reactivateUser
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.put('/edit', editUserProfile);
router.post('/users', getUserDetails);
router.get('/total', getTotalUsers);
router.get('/:phoneNumber', getUserDetailsByPhoneNumber);
router.put('/deactivate/:phoneNumber', deleteUser);
router.put('/reactivate/:phoneNumber', reactivateUser);

module.exports = router;
