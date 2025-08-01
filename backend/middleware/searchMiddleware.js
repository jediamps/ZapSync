const axios = require('axios');
const DJANGO_API_URL = 'http://127.0.0.1:8000/nlp/process/';

const processQuery = async (req, res, next) => {
  try {
    const { query } = req.body;
    
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

    req.nlpData = {
      originalQuery: query,
      processedQuery: nlpResponse.data.processed_query,
      entities: nlpResponse.data.entities,
      intent: nlpResponse.data.intent,
      confidence: nlpResponse.data.confidence
    };

    next();
  } catch (error) {
    console.error('NLP Processing Error:', error);
    // Fallback to direct search
    req.nlpData = {
      originalQuery: req.body.query,
      processedQuery: req.body.query,
      entities: [],
      intent: 'search',
      confidence: 0
    };
    next();
  }
};

module.exports = { processQuery };