// controllers/trashController.js
const  Folder = require('../models/Folder');
const  File = require('../models/File');

// Move item to trash
exports.moveToTrash = async (req, res) => {
  try {
    const { id, type } = req.body;
    const userId = req.user._id;

    let query = { _id: id };
    let update = { isTrash: true, trashedAt: new Date() };

    if (type === 'folder') {
      query.owner = userId; // Only owner can trash folder
      const folder = await Folder.findOneAndUpdate(query, update, { new: true });
      
      if (!folder) {
        return res.status(404).json({ 
          success: false, 
          message: 'Folder not found or not owned by you' 
        });
      }

      return res.status(200).json({ success: true, data: folder });

    } else if (type === 'file') {
      query.user = userId; // Only owner can trash file
      const file = await File.findOneAndUpdate(query, update, { new: true });

      if (!file) {
        return res.status(404).json({ 
          success: false, 
          message: 'File not found or not owned by you' 
        });
      }

      return res.status(200).json({ success: true, data: file });

    } else {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all trashed items for current user
exports.getTrash = async (req, res) => {
  try {
    const userId = req.user._id;

    const [folders, files] = await Promise.all([
      Folder.find({ isTrash: true, owner: userId }),
      File.find({ isTrash: true, user: userId })
    ]);
    
    res.status(200).json({ success: true, data: { folders, files } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Restore from trash
exports.restoreFromTrash = async (req, res) => {
  try {
    const { id, type } = req.params;
    const userId = req.user._id;

    let query = { _id: id, isTrash: true };
    let update = { isTrash: false, $unset: { trashedAt: 1 } };

    if (type === 'folder') {
      query.owner = userId; // Only owner can restore
      const folder = await Folder.findOneAndUpdate(query, update, { new: true });

      if (!folder) {
        return res.status(404).json({ 
          success: false, 
          message: 'Folder not found in your trash' 
        });
      }

      return res.status(200).json({ success: true, data: folder });

    } else if (type === 'file') {
      query.user = userId; // Only owner can restore
      const file = await File.findOneAndUpdate(query, update, { new: true });

      if (!file) {
        return res.status(404).json({ 
          success: false, 
          message: 'File not found in your trash' 
        });
      }

      return res.status(200).json({ success: true, data: file });

    } else {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Permanently delete
exports.permanentlyDelete = async (req, res) => {
  try {
    const { id, type } = req.params;
    const userId = req.user._id;

    let query = { _id: id, isTrash: true };

    if (type === 'folder') {
      query.owner = userId; // Only owner can permanently delete
      const folder = await Folder.findOneAndDelete(query);

      if (!folder) {
        return res.status(404).json({ 
          success: false, 
          message: 'Folder not found in your trash' 
        });
      }

      return res.status(200).json({ success: true, data: null });

    } else if (type === 'file') {
      query.user = userId; // Only owner can permanently delete
      const file = await File.findOneAndDelete(query);

      if (!file) {
        return res.status(404).json({ 
          success: false, 
          message: 'File not found in your trash' 
        });
      }

      // Here you would also delete the actual file from storage
      // await deleteFileFromStorage(file.storagePath);

      return res.status(200).json({ success: true, data: null });

    } else {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Empty trash completely
exports.emptyTrash = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all folders in trash owned by user
    const folderResult = await Folder.deleteMany({ 
      isTrash: true, 
      owner: userId 
    });

    // Delete all files in trash owned by user
    const fileResult = await File.deleteMany({ 
      isTrash: true, 
      user: userId 
    });

    // Here you would also delete the actual files from storage
    // for each deleted file

    res.status(200).json({
      success: true,
      data: {
        foldersDeleted: folderResult.deletedCount,
        filesDeleted: fileResult.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};