import React, { useState, useEffect } from 'react';
import { 
  Star, Folder, FileText, HardDrive, 
  Clock, Download, Upload, Menu, 
  Image, File, FileArchive, FileVideo, 
  FileAudio, FileInput, FileSpreadsheet, FileBarChart
} from 'lucide-react';
import { useOutletContext } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getStarred } from '../services/api';

function Starred() {
  const { toggleSidebar } = useOutletContext();
  const [starredItems, setStarredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStarredItems = async () => {
      try {
        setLoading(true);
        const response = await getStarred();
        setStarredItems(response);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch starred items:', err);
        setError('Failed to load starred items');
      } finally {
        setLoading(false);
      }
    };

    fetchStarredItems();
  }, []);

  // Function to get appropriate icon component based on iconType
  const getIconComponent = (iconType) => {
    switch (iconType) {
      case 'folder':
        return <Folder className="w-5 h-5 text-yellow-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-blue-500" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'archive':
        return <FileArchive className="w-5 h-5 text-purple-500" />;
      case 'video':
        return <FileVideo className="w-5 h-5 text-orange-500" />;
      case 'audio':
        return <FileAudio className="w-5 h-5 text-green-500" />;
      case 'word':
        return <FileInput className="w-5 h-5 text-blue-600" />;
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
      case 'powerpoint':
        return <FileBarChart className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  // Format file size to readable format
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]);
  };

  if (loading && starredItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error loading starred items</div>
        <button 
          onClick={() => window.location.reload()}
          className="text-blue-500 hover:text-blue-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with sidebar toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center mb-6 gap-7">
        <button className="text-gray-600" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-300" />
            Starred Items
          </h1>
          <p className="text-sm text-gray-500">Your important files and folders</p>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Starred</p>
              <p className="text-2xl font-bold">{starredItems.length}</p>
            </div>
            <div className="p-2 rounded-full bg-yellow-50">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-300" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Folders</p>
              <p className="text-2xl font-bold">
                {starredItems.filter(item => item.type === 'folder').length}
              </p>
            </div>
            <div className="p-2 rounded-full bg-blue-50">
              <Folder className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Files</p>
              <p className="text-2xl font-bold">
                {starredItems.filter(item => item.type === 'file').length}
              </p>
            </div>
            <div className="p-2 rounded-full bg-purple-50">
              <File className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Starred Items Table */}
      {starredItems.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploader
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Starred On
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {starredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getIconComponent(item.iconType)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          {item.type === 'file' && item.description && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {item.type === 'folder' ? 'Folder' : item.fileType || 'File'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.type === 'folder' ? 
                        `${item.size || 0} items` : 
                        formatFileSize(item.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.uploader || 'You'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Star className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No starred items</h3>
          <p className="mt-1 text-sm text-gray-500">
            Star important items to find them quickly here.
          </p>
        </div>
      )}
    </div>
  );
}

export default Starred;