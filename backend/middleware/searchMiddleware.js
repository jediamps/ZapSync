const axios = require('axios');
const DJANGO_API_URL = 'http://127.0.0.1:8000/nlp/process/';

const processQuery = async (req, res, next) => {
  try {
    const { query } = req.body;
    console.log('Received query:', req.body);
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid query format' 
      });
    }

    // Send to Django NLP service
    const nlpResponse = await axios.post(DJANGO_API_URL, {
      text: query
    });

    // Extract all NLP processing results from the backend
    const nlpData = nlpResponse.data;
    
    // Prepare the complete NLP data to pass to the next middleware/controller
    req.nlpData = {
      originalQuery: query,
      processedQuery: nlpData.processed_query,
      intent: nlpData.intent,
      confidence: nlpData.confidence,
      entities: nlpData.entities || {},
      // Include any additional fields that might be returned by the NLP backend
      ...nlpData  // This spreads any additional properties from the response
    };

    // Debug log to verify all received data
    console.log('NLP Processing Results:', req.nlpData);

    next();
  } catch (error) {
    console.error('NLP Processing Error:', error);
    
    // Enhanced fallback with more detailed error information
    req.nlpData = {
      originalQuery: req.body.query,
      processedQuery: req.body.query,
      intent: 'search',
      confidence: 0,
      entities: {
        courses: [],
        lecturers: [],
        file_types: [],
        weeks: [],
        semesters: [],
        keywords: []
      },
      error: error.message || 'NLP processing failed'
    };
    
    // Continue to the next middleware even in case of error
    next();
  }
};

module.exports = { processQuery };