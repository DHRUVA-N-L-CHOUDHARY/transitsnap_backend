const express = require('express');
const {
  addRecord,
  getRecordsByUserID,
  getAllRecords,
  getTotalRecords,
  markAsDeleted,
  markAsPaid,
  markAsNotPaid
} = require('../controllers/recordController');

const router = express.Router();

router.post('/add', addRecord);
router.get('/user/:userID', getRecordsByUserID);
router.put('/delete', markAsDeleted);
router.put('/paid', markAsPaid);
router.put('/notPaid', markAsNotPaid);
router.get('/total', getTotalRecords);
router.post('/all', getAllRecords);

module.exports = router;
