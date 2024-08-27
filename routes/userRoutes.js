const express = require('express');
const {
  registerUser,
  editUserProfile,
  getUserDetails,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.put('/edit/:id', editUserProfile);
router.get('/:id', getUserDetails);
router.delete('/:id', deleteUser);

module.exports = router;
