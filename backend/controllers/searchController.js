const Search = require('../models/Search');
const File = require('../models/File');

const searchController = {
  smartSearch: async (req, res) => {
    try {
      const { nlpData } = req;
      const userId = req.user._id; // Assuming user is authenticated

      // Build search query
      const searchQuery = buildSearchQuery(nlpData);
      
      // Execute search
      const results = await File.find(searchQuery)
        .sort({ relevanceScore: -1 })
        .limit(50);

      // Save search history
      const searchRecord = new Search({
        query: nlpData.originalQuery,
        processedQuery: nlpData.processedQuery,
        userId,
        resultsCount: results.length,
        entities: nlpData.entities,
        intent: nlpData.intent,
        confidence: nlpData.confidence
      });
      await searchRecord.save();

      res.json({
        success: true,
        message: `Found ${results.length} matching files`,
        files: formatFileResults(results),
        suggestions: generateSuggestions(results),
        searchId: searchRecord._id // For tracking
      });

    } catch (error) {
      console.error('Search Error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Search failed' 
      });
    }
  },

  getSuggestions: async (req, res) => {
    try {
      const { q } = req.query;
      const userId = req.user._id;
      
      if (!q || q.length < 2) {
        return res.json({ success: true, suggestions: [] });
      }

      // Get suggestions from past searches
      const pastSearches = await Search.find({
        userId,
        $text: { $search: q }
      })
      .sort({ timestamp: -1 })
      .limit(5)
      .select('processedQuery');

      // Get suggestions from file names
      const fileSuggestions = await File.aggregate([
        { $match: { name: new RegExp(q, 'i') } },
        { $group: { _id: '$name' } },
        { $limit: 5 }
      ]);

      const suggestions = [
        ...new Set([
          ...pastSearches.map(s => s.processedQuery),
          ...fileSuggestions.map(f => f._id)
        ])
      ].slice(0, 5);

      res.json({ success: true, suggestions });

    } catch (error) {
      console.error('Suggestions Error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get suggestions' 
      });
    }
  },

  getSearchHistory: async (req, res) => {
    try {
      const searches = await Search.find({ userId: req.user._id })
        .sort({ timestamp: -1 })
        .limit(20);
      
      res.json({ success: true, searches });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to get history' });
    }
  }
};

// Helper functions
function buildSearchQuery(nlpData) {
  const query = { $text: { $search: nlpData.processedQuery } };
  
  nlpData.entities.forEach(entity => {
    switch(entity.type) {
      case 'professor':
        query['metadata.professor'] = new RegExp(entity.value, 'i');
        break;
      case 'week':
        query['metadata.week'] = parseInt(entity.value);
        break;
      case 'course':
        query['metadata.course'] = new RegExp(entity.value, 'i');
        break;
      case 'filetype':
        query.fileType = entity.value.toLowerCase();
        break;
    }
  });

  return query;
}

function formatFileResults(files) {
  return files.map(file => ({
    id: file._id,
    name: file.name,
    path: file.path,
    type: file.type,
    metadata: file.metadata,
    score: file.relevanceScore || 0
  }));
}

function generateSuggestions(files) {
  const suggestions = new Set();
  
  files.forEach(file => {
    if (file.metadata?.professor) {
      suggestions.add(`${file.metadata.professor} ${file.metadata.course || 'lecture'} notes`);
    }
    if (file.metadata?.week) {
      suggestions.add(`Week ${file.metadata.week} materials`);
    }
  });

  return Array.from(suggestions).slice(0, 5);
}

module.exports = searchController;