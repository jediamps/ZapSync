const multer = require('multer');
const path = require('path');
const { checkForProfanity, scanForMalware } = require('../services/contentFilter');
const pdf = require('pdf-parse');
const mammoth = require('mammoth'); // npm install pdf-parse mammoth

const storage = multer.memoryStorage();

// File type whitelist
const allowedExtensions = ['.txt', '.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif'];
const dangerousExtensions = ['.exe', '.bat', '.sh', '.jar', '.dll'];

// Pre-file filter
const preFileFilter = (req, file, cb) => {
  try {
    // Basic validation
    if (!file.originalname || file.originalname.trim() === '') {
      return cb(new Error('File name is required'), false);
    }

    // File extension check
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (dangerousExtensions.includes(ext)) {
      return cb(new Error('Potentially dangerous file type detected'), false);
    }

    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('File type not allowed'), false);
    }

    // Image filename check
    if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      const memeKeywords = ['meme', 'funny', 'dank'];
      if (memeKeywords.some(kw => file.originalname.toLowerCase().includes(kw))) {
        return cb(new Error('Suspected non-academic image content'), false);
      }
    }

    cb(null, true);
  } catch (error) {
    cb(error, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: preFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 100, // 100MB
    files: 1
  }
});

// Content analysis middleware
const analyzeFileContent = async (req, res, next) => {
  try {
    const file = req.file;
    
    if (!file) {
      return next();
    }

    const ext = path.extname(file.originalname).toLowerCase();
    let textContent = '';

    try {
      // Handle different file types
      if (ext === '.txt') {
        textContent = file.buffer.toString('utf-8');
      } 
      else if (ext === '.pdf') {
        const data = await pdf(file.buffer);
        textContent = data.text;
      }
      else if (['.doc', '.docx'].includes(ext)) {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        textContent = result.value;
      }
      // Skip content analysis for images and other types

      if (textContent) {
        await checkTextContent(textContent);
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      // Continue even if parsing fails (but log it)
    }

    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Common text content checks
async function checkTextContent(content) {
  // Limit content size for performance
  const textToCheck = content.substring(0, 5000);
  
  // Profanity Check
  const profanityResult = await checkForProfanity(textToCheck);
  if (profanityResult.isProfane) {
    throw new Error(`File contains inappropriate language: ${profanityResult.offendingWord}`);
  }

  // Malware Pattern Check
  const isSuspicious = await scanForMalware(textToCheck);
  if (isSuspicious) {
    throw new Error('File contains suspicious patterns');
  }
}

module.exports = {
  upload,
  analyzeFileContent
};