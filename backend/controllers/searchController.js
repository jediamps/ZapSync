const File = require('../models/File');
const Folder = require('../models/Folder');
const excel = require('exceljs');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');


const smartSearch = async (req, res) => {
  try {
    const { nlpData, user } = req;
    
    // Debug: Verify NLP data structure
    console.log('Raw NLP Data:', JSON.stringify(nlpData, null, 2));
    
    // Validate and normalize NLP data
    const { 
      processedQuery = '',
      intent = 'unknown',
      confidence = 0,
      entities = {},
      keywords = []
    } = nlpData || {};

    // Enhanced query parsing for fallback
    const parseQueryFallback = (query) => {
      if (!query) return { keywords: [] };
      
      // Simple fallback tokenizer
      const tokens = query.toLowerCase().split(/[\s\.\-_]+/).filter(Boolean);
      const fileTypes = ['pdf', 'docx', 'pptx', 'png', 'jpg', 'jpeg', 'py', 'cpp'];
      
      return {
        keywords: tokens.filter(t => !fileTypes.includes(t)),
        entities: {
          file_types: tokens.filter(t => fileTypes.includes(t)),
          lecturers: tokens.some(t => t.includes('partey')) ? ['Dr Partey'] : []
        }
      };
    };

    // Use fallback parsing if NLP data is empty
    const effectiveData = (keywords.length > 0 || Object.keys(entities).length > 0) 
      ? nlpData 
      : { ...nlpData, ...parseQueryFallback(processedQuery) };

    console.log('Effective Search Data:', effectiveData);

    // Base conditions
    const baseConditions = {
      isTrash: false,
      $or: [
        { user: user._id },
        { sharedWith: user._id }
      ]
    };

    // Folder search
    const folderConditions = {
      ...baseConditions,
      $or: [
        ...(effectiveData.entities.lecturers?.map(lecturer => ({
          name: new RegExp(escapeRegex(lecturer), 'i')
        })) || []),
        ...(effectiveData.keywords?.map(keyword => ({
          name: new RegExp(escapeRegex(keyword), 'i')
        })) || [])
      ]
    };

    const matchingFolders = await Folder.find(folderConditions)
      .select('_id name files')
      .lean();

    // File search
    const fileConditions = {
      ...baseConditions,
      $or: [
        ...(effectiveData.entities.file_types?.map(type => ({
          file_type: type.toLowerCase()
        })) || []),
        ...(effectiveData.keywords?.map(keyword => ({
          $or: [
            { name: new RegExp(escapeRegex(keyword), 'i') },
            { tags: new RegExp(escapeRegex(keyword), 'i') }
          ]
        })) || []),
        ...(matchingFolders.length > 0 ? [{
          _id: { $in: matchingFolders.flatMap(f => f.files) }
        }] : [])
      ]
    };

    const matchingFiles = await File.find(fileConditions)
      .populate('user', 'name email')
      .limit(100);

    // Prepare response
    const response = {
      success: true,
      query: processedQuery,
      intent: effectiveData.intent,
      confidence: effectiveData.confidence,
      keywords_used: effectiveData.keywords || [],
      filters_applied: {
        intent: effectiveData.confidence > 0.3 ? effectiveData.intent : null,
        entities: Object.fromEntries(
          Object.entries(effectiveData.entities).filter(([_, v]) => v?.length > 0)
        ),
        keywords: effectiveData.keywords || []
      },
      results: {
        folders: matchingFolders.map(f => ({
          _id: f._id,
          name: f.name,
          file_count: f.files?.length || 0
        })),
        files: matchingFiles.map(f => ({
          _id: f._id,
          name: f.name,
          type: f.file_type,
          size: f.size,
          user: f.user
        }))
      },
      counts: {
        folders: matchingFolders.length,
        files: matchingFiles.length
      },
      diagnostics: {
        nlp_processed: !!(nlpData && (nlpData.keywords?.length > 0 || Object.keys(nlpData.entities)?.length > 0)),
        fallback_used: effectiveData !== nlpData
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      details: error.message,
      received_query: req.nlpData?.processedQuery,
      received_nlp_data: req.nlpData
    });
  }
};

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// Helper to determine why a folder was matched
function determineFolderMatchReason(folder, nlpData) {
  const reasons = [];
  const { entities, keywords } = nlpData;
  const folderName = folder.name.toLowerCase();

  if (entities.lecturers?.some(l => folderName.includes(l.toLowerCase()))) {
    reasons.push('lecturer_match');
  }

  if (entities.courses?.some(c => folderName.includes(c.toLowerCase()))) {
    reasons.push('course_match');
  }

  if (keywords?.some(kw => folderName.includes(kw.toLowerCase()))) {
    reasons.push('keyword_match');
  }

  return reasons.length > 0 ? reasons : ['name_match'];
}

// Helper to determine why a file was matched
function determineFileMatchReason(file, nlpData) {
  const reasons = [];
  const { entities, keywords, intent } = nlpData;
  const fileName = file.name.toLowerCase();

  if (entities.file_types?.includes(file.file_type.toLowerCase())) {
    reasons.push('file_type_match');
  }

  if (keywords?.some(kw => fileName.includes(kw.toLowerCase()))) {
    reasons.push('keyword_match');
  }

  if (intent && fileName.includes(intent.toLowerCase())) {
    reasons.push('intent_match');
  }

  return reasons.length > 0 ? reasons : ['fallback_match'];
}

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}


async function exportToExcel() {
  try {
    // Create workbook and worksheets
    const workbook = new excel.Workbook();
    const filesSheet = workbook.addWorksheet('Files');
    const foldersSheet = workbook.addWorksheet('Folders');

    // Get data from MongoDB (without owner/user population)
    const files = await File.find({ isTrash: false })
      .select('name description tags file_type size createdAt')
      .lean();
    
    const folders = await Folder.find({ isTrash: false })
      .select('name description files sharedWith createdAt')
      .lean();

    // Add headers to files sheet (simplified)
    filesSheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Size (KB)', key: 'size', width: 15 },
      { header: 'Tags', key: 'tags', width: 40 },
      { header: 'Created', key: 'createdAt', width: 20 }
    ];

    // Add files data
    files.forEach(file => {
      filesSheet.addRow({
        name: file.name,
        type: file.file_type.toUpperCase(), // Convert to uppercase for consistency
        size: (file.size / 1024).toFixed(2),
        tags: file.tags?.join(', ') || '',
        createdAt: file.createdAt.toLocaleString()
      });
    });

    // Add headers to folders sheet (simplified)
    foldersSheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Type', key: 'type', width: 15, value: 'FOLDER' }, // Static type
      { header: 'Items Count', key: 'itemsCount', width: 15 },
      { header: 'Created', key: 'createdAt', width: 20 }
    ];

    // Add folders data
    folders.forEach(folder => {
      foldersSheet.addRow({
        name: folder.name,
        type: 'FOLDER', // Explicit folder type
        itemsCount: folder.files?.length || 0,
        createdAt: folder.createdAt.toLocaleString()
      });
    });

    // Create export directory if it doesn't exist
    const exportDir = path.resolve(__dirname, '../../machine_learning/zapsync_ai/datasets');
    
    // Create directory if it doesn't exist (with recursive option)
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { 
        recursive: true,
        mode: 0o755 // Optional: set directory permissions
      });
      console.log(`Created export directory: ${exportDir}`);
    }
    // Save with consistent filename
    const filePath = path.join(exportDir, 'file_metadata_v2.xlsx');
    
    await workbook.xlsx.writeFile(filePath);
    
    return {
      success: true,
      path: filePath,
      counts: {
        files: files.length,
        folders: folders.length
      }
    };

  } catch (error) {
    console.error('Export error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Add this function to handle automatic exports
function setupAutoExport() {
  // Schedule daily export at 2 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('Running automatic data export...');
    try {
      const result = await exportToExcel();
      
      if (result.success) {
        console.log(`Automatic export successful. File: ${result.path}`);
        
        // Optional: Keep only the last 5 exports to save space
        const exportDir = path.join(__dirname, '..', 'exports');
        const files = fs.readdirSync(exportDir)
          .filter(file => file.startsWith('export-'))
          .sort()
          .reverse();
        
        if (files.length > 5) {
          files.slice(5).forEach(file => {
            fs.unlinkSync(path.join(exportDir, file));
          });
        }
      } else {
        console.error('Automatic export failed:', result.error);
      }
    } catch (error) {
      console.error('Error in automatic export:', error);
    }
  }, {
    scheduled: true,
    timezone: "Africa/Accra" // e.g., "America/New_York"
  });
}

module.exports = {
  smartSearch,
  exportToExcel,
  setupAutoExport
};