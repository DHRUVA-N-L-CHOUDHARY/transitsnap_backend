const express = require('express');
const {
  registerUser,
  editUserProfile,
  getUserDetails,
  deleteUser,
  getTotalUsers
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.put('/edit', editUserProfile);
router.post('/users', getUserDetails);
router.get('/total', getTotalUsers);
router.get('/:userPhoneNumber', getUserDetails);
router.delete('/:userPhoneNumber', deleteUser);

module.exports = router;
