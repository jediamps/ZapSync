import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { Trash2, Check, AlertTriangle, Menu, RefreshCw, FolderIcon, ImageIcon, FileText, VideoIcon, File } from 'lucide-react';
import { toast } from "react-toastify";
import { 
  getTrash,
  restoreFromTrash,
  permanentlyDelete,
  emptyTrash 
} from "../services/api";

const Trash = () => {
  const { toggleSidebar } = useOutletContext();
  const [trashItems, setTrashItems] = useState({ folders: [], files: [] });
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch trash items from API
  useEffect(() => {
    const fetchTrashItems = async () => {
      try {
        setLoading(true);
        const { data } = await getTrash();
        setTrashItems(data);
      } catch (error) {
        toast.error("Failed to load trash items");
        console.error("Error fetching trash items:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrashItems();
  }, []);

  const toggleSelectItem = (id, type) => {
    const itemKey = `${type}_${id}`;
    setSelectedItems(prev => 
      prev.includes(itemKey) 
        ? prev.filter(item => item !== itemKey) 
        : [...prev, itemKey]
    );
  };

  const handleRestoreSelected = async () => {
    try {
      setLoading(true);
      const restorePromises = selectedItems.map(item => {
        const [type, id] = item.split('_');
        return restoreFromTrash(id, type);
      });
      
      await Promise.all(restorePromises);
      
      // Remove restored items from state
      setTrashItems(prev => ({
        folders: prev.folders.filter(f => !selectedItems.includes(`folder_${f._id}`)),
        files: prev.files.filter(f => !selectedItems.includes(`file_${f._id}`))
      }));
      
      setSelectedItems([]);
      setIsSelecting(false);
      toast.success(`${selectedItems.length} item(s) restored`);
    } catch (error) {
      toast.error("Failed to restore items");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSelected = async () => {
    try {
      setLoading(true);
      const deletePromises = selectedItems.map(item => {
        const [type, id] = item.split('_');
        return permanentlyDelete(id, type);
      });
      
      await Promise.all(deletePromises);
      
      // Remove deleted items from state
      setTrashItems(prev => ({
        folders: prev.folders.filter(f => !selectedItems.includes(`folder_${f._id}`)),
        files: prev.files.filter(f => !selectedItems.includes(`file_${f._id}`))
      }));
      
      setSelectedItems([]);
      setIsSelecting(false);
      setShowDeleteConfirm(false);
      toast.success(`${selectedItems.length} item(s) permanently deleted`);
    } catch (error) {
      toast.error("Failed to delete items");
    } finally {
      setLoading(false);
    }
  };

  const handleEmptyTrash = () => {
    setShowEmptyConfirm(true);
  };

  const confirmEmptyTrash = async () => {
    try {
      setLoading(true);
      await emptyTrash();
      
      setTrashItems({ folders: [], files: [] });
      setSelectedItems([]);
      setIsSelecting(false);
      setShowEmptyConfirm(false);
      toast.success("Trash has been emptied");
    } catch (error) {
      toast.error("Failed to empty trash");
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (trashedAt) => {
    const deletedDate = new Date(trashedAt);
    const expirationDate = new Date(deletedDate);
    expirationDate.setDate(deletedDate.getDate() + 30); // 30 days expiration
    
    const today = new Date();
    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const getItemIcon = (type) => {
    const baseClasses = "w-5 h-5";
    switch (type) {
      case 'folder':
        return <FolderIcon className={`${baseClasses} text-yellow-500`} />;
      case 'image':
        return <ImageIcon className={`${baseClasses} text-purple-500`} />;
      case 'pdf':
        return <FileText className={`${baseClasses} text-red-500`} />;
      case 'video':
        return <VideoIcon className={`${baseClasses} text-blue-500`} />;
      default:
        return <File className={`${baseClasses} text-gray-500`} />;
    }
  };

  const allItems = [
    ...trashItems.folders.map(f => ({ ...f, type: 'folder' })),
    ...trashItems.files.map(f => ({ ...f, type: 'file' }))
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="text-gray-600 hover:text-primary">
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Trash</h1>
          </div>
          
          {allItems.length > 0 && (
            <div className="flex gap-2">
              {isSelecting ? (
                <>
                  <button 
                    onClick={() => {
                      setIsSelecting(false);
                      setSelectedItems([]);
                    }}
                    className="px-3 py-1 text-sm rounded border hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleRestoreSelected}
                    disabled={selectedItems.length === 0}
                    className={`px-3 py-1 text-sm rounded flex items-center gap-1 ${
                      selectedItems.length > 0
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <RefreshCw size={16} /> Restore
                  </button>
                  <button 
                    onClick={handleDeleteSelected}
                    disabled={selectedItems.length === 0}
                    className={`px-3 py-1 text-sm rounded flex items-center gap-1 ${
                      selectedItems.length > 0
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setIsSelecting(true)}
                    className="px-3 py-1 text-sm rounded border hover:bg-gray-100"
                  >
                    Select Items
                  </button>
                  <button 
                    onClick={handleEmptyTrash}
                    className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Empty Trash
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              Items in trash will be automatically deleted after 30 days. Deleted items cannot be recovered.
            </p>
          </div>
        </div>

        {/* Content */}
        {allItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Trash2 size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">Your trash is empty</h3>
            <p className="text-gray-500 mt-1">Items you delete will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {isSelecting ? (
                        <button 
                          onClick={() => {
                            if (selectedItems.length === allItems.length) {
                              setSelectedItems([]);
                            } else {
                              setSelectedItems(allItems.map(item => `${item.type}_${item._id}`));
                            }
                          }}
                          className="flex items-center"
                        >
                          {selectedItems.length === allItems.length ? (
                            <Check size={16} className="mr-2 text-primary" />
                          ) : (
                            <div className="w-4 h-4 border rounded mr-2 border-gray-400" />
                          )}
                          Name
                        </button>
                      ) : "Name"}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deleted
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires in
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allItems.map((item) => {
                    const itemKey = `${item.type}_${item._id}`;
                    const isSelected = selectedItems.includes(itemKey);
                    
                    return (
                      <tr 
                        key={itemKey}
                        className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {isSelecting && (
                              <button 
                                onClick={() => toggleSelectItem(item._id, item.type)}
                                className="mr-3"
                              >
                                {isSelected ? (
                                  <Check size={16} className="text-primary" />
                                ) : (
                                  <div className="w-4 h-4 border rounded border-gray-400" />
                                )}
                              </button>
                            )}
                            <div className="flex items-center">
                              {getItemIcon(item.type === 'folder' ? 'folder' : item.fileType)}
                              <span className="ml-2 font-medium">{item.name || item.filename}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {item.type === 'folder' ? 'Folder' : item.fileType || 'File'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatFileSize(item.size) || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.trashedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {calculateDaysLeft(item.trashedAt)} days
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                restoreFromTrash(item._id, item.type)
                                  .then(() => {
                                    setTrashItems(prev => ({
                                      folders: prev.folders.filter(f => f._id !== item._id),
                                      files: prev.files.filter(f => f._id !== item._id)
                                    }));
                                    toast.success(`${item.type === 'folder' ? 'Folder' : 'File'} restored`);
                                  })
                                  .catch(() => toast.error("Failed to restore"));
                              }}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <RefreshCw size={14} /> Restore
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItems([itemKey]);
                                setShowDeleteConfirm(true);
                              }}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Delete Permanently</h3>
              <p className="mb-6">
                Are you sure you want to permanently delete {selectedItems.length} selected item(s)?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteSelected}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty Trash Confirmation Modal */}
        {showEmptyConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Empty Trash</h3>
              <p className="mb-6">
                This will permanently delete all items in your trash. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEmptyConfirm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEmptyTrash}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Empty Trash
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format file sizes
function formatFileSize(bytes) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default Trash;