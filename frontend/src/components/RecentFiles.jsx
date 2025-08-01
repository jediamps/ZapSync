import { Share2, MoreVertical } from 'lucide-react';

const RecentFiles = ({ file, viewMode = 'grid', showAll = false, isGridItem = false }) => {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4 min-w-0">
          {/* File icon based on type */}
          {file.type?.includes('image') && (
            <img 
              src={file.previewUrl} 
              alt="Preview" 
              className="w-10 h-10 rounded object-cover"
            />
          )}
          {!file.type?.includes('image') && (
            <div className="bg-gray-100 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
            </div>
          )}
          
          <div className="min-w-0">
            <h3 className="font-medium text-gray-800 truncate">{file.name}</h3>
            <p className="text-sm text-gray-500">
              {file.size} • {new Date(file.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-[#A1D2CE] p-1.5 rounded-full">
          <Share2 size={18} />
        </button>
      </div>
    );
  }

  // Grid view item (compact version for grid layout)
  if (isGridItem) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all">
        <div className="mb-3">
          {/* File icon based on type */}
          {file.type?.includes('image') ? (
            <img 
              src={file.previewUrl || URL.createObjectURL(file)} 
              alt="Preview" 
              className="w-full h-32 rounded-lg object-cover"
            />
          ) : file.type?.includes('pdf') ? (
            <div className="bg-red-50 h-32 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
          ) : file.type?.includes('video') ? (
            <div className="bg-blue-50 h-32 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>
          ) : (
            <div className="bg-gray-50 h-32 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">{file.size} • {new Date(file.updatedAt).toLocaleDateString()}</p>
          </div>
          <button className="text-gray-400 hover:text-[#A1D2CE] p-1">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Default grid view (list-like but in grid mode)
  return (
    <div className="flex justify-between items-center bg-white hover:bg-gray-50 p-3 rounded-lg border border-gray-100 my-2 transition-colors">
      <div className="flex items-center gap-3">
        {/* File icon based on type */}
        {file.type?.includes('image') && (
          <img 
            src={file.previewUrl || URL.createObjectURL(file)} 
            alt="Preview" 
            className="w-8 h-8 rounded object-cover"
          />
        )}
        {file.type?.includes('pdf') && (
          <div className="bg-red-100 p-1.5 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M10 11H8v2h2v-2z"></path>
              <path d="M16 11h-2v2h2v-2z"></path>
              <path d="M12 11h-2v2h2v-2z"></path>
            </svg>
          </div>
        )}
        {file.type?.includes('video') && (
          <div className="bg-blue-100 p-1.5 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
          </div>
        )}
        {!file.type?.includes('image') && !file.type?.includes('pdf') && !file.type?.includes('video') && (
          <div className="bg-gray-100 p-1.5 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
          </div>
        )}
        
        <div>
          <p className="font-medium text-gray-800 truncate max-w-[180px]">{file.name}</p>
          <p className="text-xs text-gray-500">{file.size} • {new Date(file.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#A1D2CE] transition-colors"
          aria-label="Share file"
        >
          <Share2 size={18} />
        </button>
        <button 
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="More options"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};

export default RecentFiles;