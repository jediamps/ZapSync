const Starred = require('../models/Starred');

exports.toggleStar = async (req, res) => {
  try {
    const { id, type, isStarred } = req.body;
    const userId = req.user._id;
    const itemId = id;

    // Validate type
    if (!['file', 'folder'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    // Update the starred collection
    if (isStarred) {
      await Starred.findOneAndDelete({ user: userId, itemId, type });
    } else {
      await Starred.create({ user: userId, itemId, type });
    }

    res.json({ isStarred: !isStarred });
  } catch (error) {
    console.error('Error toggling star:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.checkStarred = async (req, res) => {
  try {
    const { itemId, type } = req.params;
    const userId = req.user._id;

    const starred = await Starred.findOne({ 
      user: userId, 
      itemId, 
      type 
    });

    res.json({ isStarred: !!starred });
  } catch (error) {
    console.error('Error checking star:', error);
    res.status(500).json({ error: 'Server error' });
  }
};