const Analytics = require('../models/Analytics');

// Gets only analytics data (no ActivityLog mixing)
exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.findOne() || {
      totalUsers: 0,
      activeUsers: 0,
      totalFiles: 0,
      storageUsed: 0,
      uploadsToday: 0,
      downloadsToday: 0
    };
    
    res.json({ analytics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};