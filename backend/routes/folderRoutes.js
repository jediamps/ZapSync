const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const { folderUpload, analyzeFileContent } = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Create a new folder
router.post('/create', folderController.createFolder);

// Upload files to a folder
router.post('/:folderId/upload', folderUpload.array('files[]'), analyzeFileContent, folderController.uploadFilesToFolder);

// Get all folders (tree structure)
router.get('/all', folderController.getAllFolders);



module.exports = router;