const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { processQuery } = require('../middleware/searchMiddleware');
const { protect } = require('../middleware/authMiddleware');
const fs = require('fs');

// Smart search with NLP processing
router.post('/smart', 
  protect,
  processQuery, 
  searchController.smartSearch
);

router.get('/export', protect, async (req, res) => {
  
  const result = await searchController.exportToExcel();
  if (result.success) {
    res.download(result.path, 'data-export.xlsx', (err) => {
      if (err) {
        console.error('Download error:', err);
        return res.status(500).json({ error: 'Download failed' });
      }

    });
  } else {
    res.status(500).json({ error: result.error });
  }
});


module.exports = router;