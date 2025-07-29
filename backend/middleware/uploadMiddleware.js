const multer = require('multer');
const path = require('path');
const { checkForProfanity, scanForMalware } = require('../services/contentFilter');

const storage = multer.memoryStorage();

const fileFilter = async (req, file, cb) => {
  try {
    // 1. Basic Validation
    if (!file.originalname || file.originalname.trim() === '') {
      return cb(new Error('File name is required'), false);
    }

    // 2. File Extension Check
    const ext = path.extname(file.originalname).toLowerCase();
    const dangerousExtensions = ['.exe', '.bat', '.sh', '.jar', '.dll'];
    
    if (dangerousExtensions.includes(ext)) {
      return cb(new Error('Potentially dangerous file type detected'), false);
    }

    // 3. Content Analysis (for text-based files)
    if (['.txt', '.pdf', '.doc', '.docx'].includes(ext)) {
      const content = file.buffer.toString('utf-8').substring(0, 5000); // Check first 5KB
      
      // a. Profanity Check
      const hasProfanity = await checkForProfanity(content);
      if (hasProfanity) {
        return cb(new Error('File contains inappropriate language'), false);
      }

      // b. Malware Pattern Check
      const isSuspicious = await scanForMalware(content);
      if (isSuspicious) {
        return cb(new Error('File contains suspicious patterns'), false);
      }
    }

    // 4. Image Analysis (for memes/irrelevant content)
    if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      // You would integrate an image analysis API here
      // For now, we'll just check filename for common meme patterns
      const memeKeywords = ['meme', 'funny', 'dank'];
      if (memeKeywords.some(kw => file.originalname.toLowerCase().includes(kw))) {
        return cb(new Error('Suspected non-academic image content'), false);
      }
    }

    cb(null, true); // File passes all checks

  } catch (error) {
    console.error('Content filtering error:', error);
    cb(new Error('File validation failed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 100, // 100MB
    files: 1
  }
});

module.exports = upload;