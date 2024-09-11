const express = require('express');
const {
  registerUser,
  editUserProfile,
  getUserDetails,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.put('/edit', editUserProfile);
router.get('/:userPhoneNumber', getUserDetails);
router.delete('/:userPhoneNumber', deleteUser);

module.exports = router;
