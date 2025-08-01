import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { Trash2, ArrowLeft, Check, X, AlertTriangle, Menu } from 'lucide-react';
import { toast } from "react-toastify";

const Trash = () => {
  const { toggleSidebar } = useOutletContext();
  const [trashItems, setTrashItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  // Mock data - in a real app, you would fetch this from your API
  useEffect(() => {
    // Simulate API call to fetch trash items
    const fetchTrashItems = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/trash');
        // const data = await response.json();
        
        // Mock data
        const mockData = [
          {
            id: 1,
            name: "Project Proposal.docx",
            type: "document",
            deletedAt: "2023-05-20T10:30:00Z",
            size: "2.4 MB"
          },
          {
            id: 2,
            name: "Budget Spreadsheet.xlsx",
            type: "spreadsheet",
            deletedAt: "2023-05-21T14:45:00Z",
            size: "1.8 MB"
          },
          {
            id: 3,
            name: "Team Photo.jpg",
            type: "image",
            deletedAt: "2023-05-22T09:15:00Z",
            size: "3.2 MB"
          },
          {
            id: 4,
            name: "Meeting Notes.pdf",
            type: "document",
            deletedAt: "2023-05-23T16:20:00Z",
            size: "0.8 MB"
          },
        ];
        
        setTrashItems(mockData);
      } catch (error) {
        toast.error("Failed to load trash items");
        console.error("Error fetching trash items:", error);
      }
    };
    
    fetchTrashItems();
  }, []);

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSelected = () => {
    // In a real app, you would call your API here
    // await deleteItems(selectedItems);
    
    setTrashItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setIsSelecting(false);
    setShowDeleteConfirm(false);
    toast.success(`${selectedItems.length} item(s) permanently deleted`);
  };

  const handleEmptyTrash = () => {
    setShowEmptyConfirm(true);
  };

  const confirmEmptyTrash = () => {
    // In a real app, you would call your API here
    // await emptyTrash();
    
    setTrashItems([]);
    setSelectedItems([]);
    setIsSelecting(false);
    setShowEmptyConfirm(false);
    toast.success("Trash has been emptied");
  };

  const calculateDaysLeft = (deletedAt) => {
    const deletedDate = new Date(deletedAt);
    const expirationDate = new Date(deletedDate);
    expirationDate.setDate(deletedDate.getDate() + 3);
    
    const today = new Date();
    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'document':
        return <span className="text-blue-500">📄</span>;
      case 'spreadsheet':
        return <span className="text-green-500">📊</span>;
      case 'image':
        return <span className="text-purple-500">🖼️</span>;
      default:
        return <span>📁</span>;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-semibold text-[var(--color-text)]">Trash</h1>
          </div>
          
          {trashItems.length > 0 && (
            <div className="flex gap-2">
              {isSelecting ? (
                <>
                  <button 
                    onClick={() => {
                      setIsSelecting(false);
                      setSelectedItems([]);
                    }}
                    className="px-3 py-1 text-sm rounded border hover:bg-gray-50 transition-colors"
                  >
                    Cancel
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
                    className="px-3 py-1 text-sm rounded border hover:bg-gray-50 transition-colors"
                  >
                    Select
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
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Items in trash will be automatically deleted after 3 days. Deleted items cannot be recovered.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {trashItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Trash2 size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">Your trash is empty</h3>
            <p className="text-gray-500 mt-1">Items you delete will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {isSelecting ? (
                        <button 
                          onClick={() => {
                            if (selectedItems.length === trashItems.length) {
                              setSelectedItems([]);
                            } else {
                              setSelectedItems(trashItems.map(item => item.id));
                            }
                          }}
                          className="flex items-center"
                        >
                          {selectedItems.length === trashItems.length ? (
                            <Check size={16} className="mr-2 text-[var(--color-primary)]" />
                          ) : (
                            <div className="w-4 h-4 border rounded mr-2 border-gray-400" />
                          )}
                          Name
                        </button>
                      ) : (
                        "Name"
                      )}
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trashItems.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-50 ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {isSelecting && (
                            <button 
                              onClick={() => toggleSelectItem(item.id)}
                              className="mr-3"
                            >
                              {selectedItems.includes(item.id) ? (
                                <Check size={16} className="text-[var(--color-primary)]" />
                              ) : (
                                <div className="w-4 h-4 border rounded border-gray-400" />
                              )}
                            </button>
                          )}
                          <div className="flex items-center">
                            {getFileIcon(item.type)}
                            <span className="ml-2">{item.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.deletedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {calculateDaysLeft(item.deletedAt)} day(s)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Selected Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-white/10 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
            onClick={() => setShowDeleteConfirm(false)}
          />
          
          <div className="absolute inset-0 flex items-center justify-center p-4 animate-slideUp">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Permanently Delete Items</h3>
              <p className="mb-8 text-gray-600 text-lg">
                Are you sure you want to permanently delete {selectedItems.length} selected item(s)? 
                This action cannot be undone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 flex-1 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteSelected}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex-1 flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty Trash Confirmation Modal */}
      {showEmptyConfirm && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-white/10 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
            onClick={() => setShowEmptyConfirm(false)}
          />
          
          <div className="absolute inset-0 flex items-center justify-center p-4 animate-slideUp">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Empty Trash</h3>
              <p className="mb-8 text-gray-600 text-lg">
                This will permanently delete all items in your trash. 
                This action cannot be undone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowEmptyConfirm(false)}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 flex-1 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEmptyTrash}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex-1 flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> Empty Trash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trash;