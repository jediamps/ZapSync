const express = require('express');
const router = express.Router();
const starredController = require('../controllers/starredController');
const { protect } = require('../middleware/authMiddleware');



// Toggle star status
router.patch('/', protect, starredController.toggleStar);
router.get('/:itemId/:type', protect, starredController.checkStarred);
router.get('/get', protect, starredController.getStarred);

module.exports = router;