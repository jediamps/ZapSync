const mongoose = require('mongoose');

const folderFileSchema = new mongoose.Schema({
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique file-folder combinations
folderFileSchema.index({ folder: 1, file: 1 }, { unique: true });

const FolderFile = mongoose.model('FolderFile', folderFileSchema);

module.exports = FolderFile;