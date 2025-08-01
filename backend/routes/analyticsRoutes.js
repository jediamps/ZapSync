const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// Only analytics endpoint
router.get('/', protect, analyticsController.getAnalytics);

module.exports = router;