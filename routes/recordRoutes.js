const express = require('express');
const {
  addRecord,
  getRecordsByUserID,
  getAllRecords,
} = require('../controllers/recordController');

const router = express.Router();

router.post('/add', addRecord);
router.get('/user/:userID', getRecordsByUserID);
router.get('/all', getAllRecords);

module.exports = router;
