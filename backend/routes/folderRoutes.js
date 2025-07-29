const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const { upload } = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Create a new folder
router.post('/', folderController.createFolder);

// Upload files to a folder
router.post('/:folderId/upload', upload.array('files[]'), folderController.uploadFilesToFolder);

// Get all folders (tree structure)
router.get('/', folderController.getAllFolders);

// Get folder details with contents
router.get('/:folderId', folderController.getFolderDetails);

// Update folder
router.put('/:folderId', folderController.updateFolder);

// Delete folder
router.delete('/:folderId', folderController.deleteFolder);

module.exports = router;