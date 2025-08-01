const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  // Core metrics (no ActivityLog dependency)
  totalUsers: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  totalFiles: { type: Number, default: 0 },
  storageUsed: { type: Number, default: 0 }, // in MB
  uploadsToday: { type: Number, default: 0 },
  downloadsToday: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Self-contained methods (no external model references)
analyticsSchema.statics.incrementUpload = async function(fileSizeMB) {
  await this.updateOne(
    {},
    { 
      $inc: { 
        totalFiles: 1,
        uploadsToday: 1,
        storageUsed: fileSizeMB 
      },
      $set: { lastUpdated: new Date() }
    },
    { upsert: true }
  );
};

analyticsSchema.statics.incrementDownload = async function() {
  await this.updateOne(
    {},
    { 
      $inc: { downloadsToday: 1 },
      $set: { lastUpdated: new Date() }
    },
    { upsert: true }
  );
};

module.exports = mongoose.model('Analytics', analyticsSchema);