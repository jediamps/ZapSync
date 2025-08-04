const File = require('../models/File');
const Folder = require('../models/Folder');

const smartSearch = async (req, res) => {
  try {
    const { nlpData, user } = req;
    const { entities, intent, processedQuery } = nlpData;
    // console.log(req)

    // Prepare search conditions based on entities
    const searchConditions = {
      $and: [
        { isTrash: false },
        { $or: [] }
      ]
    };

    // Add user restriction (only search user's files)
    searchConditions.$and.push({
      $or: [
        { user: user._id },
        { 'sharedWith': user._id }
      ]
    });

    // Build search terms from entities
    const searchTerms = [];
    
    // Add courses to search terms
    if (entities.courses.length > 0) {
      searchConditions.$and.push({
        $or: entities.courses.map(course => ({
          $or: [
            { name: new RegExp(course, 'i') },
            { description: new RegExp(course, 'i') },
            { tags: { $in: [new RegExp(course, 'i')] } }
          ]
        }))
      });
    }

    // Add lecturers to search terms
    if (entities.lecturers.length > 0) {
      searchConditions.$and.push({
        $or: entities.lecturers.map(lecturer => ({
          $or: [
            { name: new RegExp(lecturer, 'i') },
            { description: new RegExp(lecturer, 'i') },
            { tags: { $in: [new RegExp(lecturer, 'i')] } }
          ]
        }))
      });
    }

    // Add file types to search terms
    if (entities.file_types.length > 0) {
      searchConditions.$and.push({
        file_type: { $in: entities.file_types.map(type => new RegExp(type, 'i')) }
      });
    }

    // Add weeks to search terms
    if (entities.weeks.length > 0) {
      searchConditions.$and.push({
        $or: entities.weeks.map(week => ({
          $or: [
            { name: new RegExp(week, 'i') },
            { description: new RegExp(week, 'i') },
            { tags: { $in: [new RegExp(week, 'i')] } }
          ]
        }))
      });
    }

    // Add semesters to search terms
    if (entities.semesters.length > 0) {
      searchConditions.$and.push({
        $or: entities.semesters.map(semester => ({
          $or: [
            { name: new RegExp(semester, 'i') },
            { description: new RegExp(semester, 'i') },
            { tags: { $in: [new RegExp(semester, 'i')] } }
          ]
        }))
      });
    }

    // If no specific entities, fall back to general text search
    if (Object.values(entities).every(arr => arr.length === 0)) {
      searchConditions.$and.push({
        $text: { $search: processedQuery }
      });
    }

    // Search files with the constructed conditions
    const files = await File.find(searchConditions)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Search folders that might match (optional)
    const folderSearchConditions = {
      $and: [
        { isTrash: false },
        { owner: user._id }
      ]
    };

    if (processedQuery) {
      folderSearchConditions.$and.push({
        $or: [
          { name: new RegExp(processedQuery, 'i') },
          { description: new RegExp(processedQuery, 'i') }
        ]
      });
    }

    const folders = await Folder.find(folderSearchConditions)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      query: processedQuery,
      intent,
      entities,
      count: {
        files: files.length,
        folders: folders.length
      },
      results: {
        files,
        folders
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      details: error.message
    });
  }
};

module.exports = {
  smartSearch
};