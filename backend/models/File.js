const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cloudinary_url: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 0
  },
  file_type: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Add text index for search
fileSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model('File', fileSchema);