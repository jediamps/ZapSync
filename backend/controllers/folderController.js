const Folder = require('../models/Folder');
const UploadedFile = require('../models/UploadedFile');
const FolderFile = require('../models/FolderFile');
const { upload } = require('../middleware/uploadMiddleware');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Create a new folder
exports.createFolder = async (req, res) => {
  try {
    const { name, description, parentId } = req.body;
    const ownerId = req.user.id;

    // Validate parent folder exists and belongs to user if provided
    if (parentId) {
      const parentFolder = await Folder.findOne({
        where: { id: parentId, ownerId }
      });
      if (!parentFolder) {
        return res.status(400).json({
          success: false,
          message: 'Parent folder not found or does not belong to you'
        });
      }
    }

    const folder = await Folder.create({
      name,
      description,
      ownerId,
      parentId: parentId || null
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
    const userId = req.user.id;
    
    // Check if folder exists and user has permission
    const folder = await Folder.findOne({
      where: { id: folderId, ownerId: userId }
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
    
    // Process each file
    for (const file of req.files) {
      try {
        // Upload to Cloudinary using your existing setup
        const result = await uploadToCloudinary(file.buffer, {
          folder: `zapsync/user_${userId}/folder_${folderId}`,
          public_id: `${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, '')}`
        });

        // Create file record
        const uploadedFile = await UploadedFile.create({
          name: file.originalname,
          cloudinary_url: result.secure_url,
          public_id: result.public_id,
          size: file.size,
          ownerId: userId
        });

        // Link file to folder
        await FolderFile.create({
          folderId,
          fileId: uploadedFile.id
        });

        uploadedFiles.push(uploadedFile);
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        // Continue with next file even if one fails
        continue;
      }
    }

    if (uploadedFiles.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'All files failed to upload'
      });
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
    const userId = req.user.id;
    
    const buildFolderTree = async (parentId = null) => {
      const folders = await Folder.findAll({
        where: { ownerId: userId, parentId },
        attributes: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
        order: [['name', 'ASC']]
      });

      return Promise.all(folders.map(async folder => {
        const children = await buildFolderTree(folder.id);
        return {
          ...folder.toJSON(),
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

// Get folder details with contents
exports.getFolderDetails = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const userId = req.user.id;

    // Check permission
    const folder = await Folder.findOne({
      where: { id: folderId, ownerId: userId },
      include: [
        {
          model: Folder,
          as: 'parent',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found or you do not have permission'
      });
    }

    // Get files in folder
    const folderFiles = await FolderFile.findAll({
      where: { folderId },
      include: [
        {
          model: UploadedFile,
          as: 'file',
          attributes: ['id', 'name', 'cloudinary_url', 'size', 'createdAt']
        }
      ],
      order: [['uploadedAt', 'DESC']]
    });

    // Get subfolders
    const subFolders = await Folder.findAll({
      where: { parentId: folderId, ownerId: userId },
      attributes: ['id', 'name', 'createdAt', 'updatedAt'],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: {
        folder: {
          id: folder.id,
          name: folder.name,
          description: folder.description,
          parent: folder.parent,
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt
        },
        files: folderFiles.map(ff => ff.file),
        subFolders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update folder
exports.updateFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const userId = req.user.id;
    const { name, description } = req.body;

    const folder = await Folder.findOne({
      where: { id: folderId, ownerId: userId }
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found or you do not have permission'
      });
    }

    // Update folder properties
    if (name) folder.name = name;
    if (description !== undefined) folder.description = description;

    await folder.save();

    res.status(200).json({
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

// Delete folder
exports.deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const userId = req.user.id;

    const folder = await Folder.findOne({
      where: { id: folderId, ownerId: userId },
      include: [
        {
          model: Folder,
          as: 'children'
        },
        {
          model: FolderFile,
          as: 'folder_files',
          include: ['file']
        }
      ]
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found or you do not have permission'
      });
    }

    // Check if folder has children
    if (folder.children && folder.children.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete folder that contains subfolders'
      });
    }

    // TODO: Add logic to delete files from Cloudinary if needed
    // This would require iterating through folder.folder_files and deleting each file

    // Delete folder files records first
    await FolderFile.destroy({ where: { folderId } });

    // Then delete the folder
    await folder.destroy();

    res.status(200).json({
      success: true,
      message: 'Folder deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};