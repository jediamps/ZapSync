const Folder = require('../models/Folder');
const UploadedFile = require('../models/UploadedFile');
const FolderFile = require('../models/FolderFile');
const { uploadToCloudinary } = require('../config/cloudinary');

// Create a new folder
exports.createFolder = async (req, res) => {
  try {
    const { name, description, sharedWith } = req.body;
    const ownerId = req.user._id;

    const folder = await Folder.create({
      name,
      description,
      sharedWith,
      owner: ownerId
    });

    res.status(201).json({
      success: true,
      data: folder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Upload files to a folder
exports.uploadFilesToFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const userId = req.user._id;

    const folder = await Folder.findOne({
      _id: folderId,
      $or: [
        { owner: userId },
        { sharedWith: userId }
      ]
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found or you do not have permission'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded'
      });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      try {
        const result = await uploadToCloudinary(file.buffer, {
          folder: `zapsync/user_${userId}/folder_${folderId}`,
          public_id: `${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, '')}`
        });

        const uploadedFile = await UploadedFile.create({
          name: file.originalname,
          cloudinary_url: result.secure_url,
          public_id: result.public_id,
          size: file.size,
          owner: userId,
          mimeType: file.mimetype,
          folders: [folderId]
        });

        await Folder.findByIdAndUpdate(
          folderId,
          { $addToSet: { files: uploadedFile._id } }
        );

        await FolderFile.create({
          folder: folderId,
          file: uploadedFile._id,
          uploadedBy: userId
        });

        uploadedFiles.push(uploadedFile);
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        continue;
      }
    }

    res.status(201).json({
      success: true,
      data: uploadedFiles,
      message: uploadedFiles.length < req.files.length
        ? 'Some files failed to upload'
        : 'All files uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get all folders for the current user (tree structure)
exports.getAllFolders = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const buildFolderTree = async (parentId = null) => {
      const folders = await Folder.find({
        $or: [
          { owner: userId },
          { sharedWith: userId }
        ],
        parent: parentId
      })
      .select('name description files createdAt updatedAt')
      .sort('name');

      return Promise.all(folders.map(async folder => {
        const children = await buildFolderTree(folder._id);
        return {
          ...folder.toObject(),
          fileCount: folder.files?.length || 0,
          children
        };
      }));
    };

    const folderTree = await buildFolderTree();

    res.status(200).json({
      success: true,
      data: folderTree
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
