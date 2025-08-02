// models/Starred.js
const mongoose = require('mongoose');

const starredSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ['file', 'folder'], required: true },
  createdAt: { type: Date, default: Date.now }
});

// Ensure a user can only star an item once
starredSchema.index({ user: 1, itemId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Starred', starredSchema);