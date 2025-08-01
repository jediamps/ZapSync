const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cloudinary_url: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  folders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder'
  }],
  mimeType: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const UploadedFile = mongoose.model('UploadedFile', fileSchema);

module.exports = UploadedFile;