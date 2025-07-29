const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');



// Get groups available to join
router.get('/available', protect, groupController.getAvailableGroups);

// Join group with token
router.post('/join', protect, groupController.joinWithToken);

module.exports = router;