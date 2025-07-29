const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// File operations
router.post('/upload', protect, upload.single('file'), fileController.uploadFile);
router.get('/', protect, fileController.getFiles);
router.get('/search', protect, fileController.searchFiles);

module.exports = router;