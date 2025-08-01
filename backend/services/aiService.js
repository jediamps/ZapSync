const axios = require('axios');
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function fetchAIData(type, params = {}) {
  try {
    let endpoint = '/api/stats';
    if (type === 'anomalies') endpoint = '/api/anomalies';
    if (type === 'recommendations') endpoint = '/api/recommendations';
    
    const response = await axios.get(`${AI_SERVICE_URL}${endpoint}`, {
      params
    });
    
    return response.data;
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      active_users: 0,
      active_users_change: 0,
      storage_used: 0,
      storage_change: 0,
      anomalies: [],
      recommendations: []
    };
  }
}

module.exports = { fetchAIData };