const express = require('express');
const router = express.Router();
const trashController = require('../controllers/trashController');
const { protect } = require('../middleware/authMiddleware');




router.put('/move', protect, trashController.moveToTrash);
router.get('/all', protect, trashController.getTrash);

// Restore from trash
// router.put('/:type/:id/restore', protect, trashController.restoreFromTrash);

// Permanently delete
// router.delete('/:type/:id', protect, trashController.permanentlyDelete);

module.exports = router;