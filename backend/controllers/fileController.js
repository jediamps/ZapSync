const File = require('../models/File');
const { uploadToCloudinary } = require('../config/cloudinary');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// @desc    Upload a file
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get file extension
    const fileExt = path.extname(req.file.originalname).substring(1).toLowerCase();

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: `zapsync/user_${req.user.id}`,
      resource_type: 'auto', // Let Cloudinary detect file type
      filename_override: req.file.originalname,
      use_filename: true,
      unique_filename: false
    });

    // Create file record
    const file = await File.create({
      user: req.user.id,
      name: req.file.originalname,
      cloudinary_url: result.secure_url,
      public_id: result.public_id,
      description: req.body.description || '',
      size: req.file.size,
      file_type: fileExt
    });

    res.status(201).json({
      _id: file._id,
      name: file.name,
      url: file.cloudinary_url,
      description: file.description,
      size: file.size,
      type: file.file_type,
      uploadedAt: file.createdAt
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ 
      error: error.message || 'Server error during file upload',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get all files for user
// @route   GET /api/files
// @access  Private
exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id })
      .sort('-createdAt')
      .select('-public_id -__v');

    res.json(files);
  } catch (error) {
    console.error('Error getting files:', error);
    res.status(500).json({ error: 'Server error getting files' });
  }
};

// @desc    Search files
// @route   GET /api/files/search
// @access  Private
exports.searchFiles = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const results = await File.find(
      { 
        $text: { $search: query },
        user: req.user.id
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .select('-public_id -__v');

    res.json(results);
  } catch (error) {
    console.error('Error searching files:', error);
    res.status(500).json({ error: 'Server error during search' });
  }
};