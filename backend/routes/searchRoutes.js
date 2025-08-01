const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { processQuery } = require('../middleware/searchMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Smart search with NLP processing
router.post('/smart', 
  protect,
  processQuery, 
  searchController.smartSearch
);

// Search suggestions
router.get('/suggestions', 
  protect,
  searchController.getSuggestions
);

// User search history
router.get('/history', 
  protect,
  searchController.getSearchHistory
);

module.exports = router;