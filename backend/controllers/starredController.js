const Starred = require('../models/Starred');
const mongoose = require('mongoose');


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

exports.getStarred = async (req, res) => {
  try {
    const userId = req.user._id;

    const starredItems = await Starred.find({ user: userId })
      .lean()
      .exec();

    const populatedItems = await Promise.all(
      starredItems.map(async (item) => {
        if (item.type === 'file') {
          const file = await mongoose.model('File').findById(item.itemId)
            .select('name file_type size user cloudinary_url description')
            .populate('user', 'name')
            .lean();
          
          return {
            ...item,
            name: file?.name,
            type: 'file',
            fileType: file?.file_type,
            size: file?.size,
            uploader: file?.user?.name,
            url: file?.cloudinary_url,
            description: file?.description,
            iconType: getFileIconType(file?.file_type) // Returns string identifier
          };
        } else if (item.type === 'folder') {
          const folder = await mongoose.model('Folder').findById(item.itemId)
            .select('name owner files sharedWith')
            .populate('owner', 'name')
            .lean();
          
          return {
            ...item,
            name: folder?.name,
            type: 'folder',
            size: folder?.files?.length || 0,
            uploader: folder?.owner?.name,
            sharedWith: folder?.sharedWith?.length || 0,
            iconType: 'folder' // String identifier for folder
          };
        }
        return item;
      })
    );

    const validItems = populatedItems.filter(item => item.name);
    res.json(validItems);
  } catch (error) {
    console.error('Error fetching starred items:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to determine file icon type (returns string)
function getFileIconType(fileType) {
  if (!fileType) return 'file';
  
  const type = fileType.toLowerCase();
  if (type.includes('image')) return 'image';
  if (type.includes('pdf')) return 'pdf';
  if (type.includes('zip') || type.includes('rar')) return 'archive';
  if (type.includes('video')) return 'video';
  if (type.includes('audio')) return 'audio';
  if (type.includes('word')) return 'word';
  if (type.includes('excel')) return 'excel';
  if (type.includes('powerpoint')) return 'powerpoint';
  return 'file';
}