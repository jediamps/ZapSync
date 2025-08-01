const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true
  },
  processedQuery: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resultsCount: {
    type: Number,
    required: true
  },
  entities: {
    type: Object,
    default: {}
  },
  intent: {
    type: String
  },
  confidence: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster querying
SearchSchema.index({ userId: 1, timestamp: -1 });
SearchSchema.index({ processedQuery: 'text' });

module.exports = mongoose.model('Search', SearchSchema);