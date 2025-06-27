import { useRef, useState, useEffect } from "react";
import { Upload, Search, List, Grid, Menu } from "lucide-react";
import FolderCard from "../components/FolderCard";
import RecentFiles from "../components/RecentFiles";
import FileActivityCalendar from "../components/FileActivityCalendar";
import { uploadFile, getFiles, searchFiles, getStorageUsage } from "../services/api";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [storage, setStorage] = useState({ used: 0, total: 0 });


  const { toggleSidebar } = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filesData, storageData] = await Promise.all([
          getFiles(),
          getStorageUsage()
        ]);
        setFiles(filesData);
        setFilteredFiles(filesData);
        setStorage(storageData);
      } catch (error) {
        toast.error("Failed to load data: " + (error.message || "Unknown error"));
      }
    };
    // fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const search = async () => {
        try {
          const results = await searchFiles(searchQuery);
          setFilteredFiles(results);
        } catch (error) {
          toast.error("Search failed: " + (error.message || "Unknown error"));
        }
      };
      const timer = setTimeout(() => search(), 500);
      return () => clearTimeout(timer);
    } else {
      setFilteredFiles(files);
    }
  }, [searchQuery, files]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setIsPreviewOpen(true);
    }
  };

  const handleFileUpload = async () => {
    setLoading(true);
    if (!file) return;

    try {
      await uploadFile(file, description);
      toast.success("File uploaded successfully!");
      setFile(null);
      setIsPreviewOpen(false);
      setDescription('');
      
      const updatedFiles = await getFiles();
      setFiles(updatedFiles);
      setFilteredFiles(updatedFiles);
      
      const updatedStorage = await getStorageUsage();
      setStorage(updatedStorage);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.detail || "Upload failed"); 
    } finally {
      setLoading(false);
    }
  };

  const storagePercentage = storage.total > 0 ? Math.round((storage.used / storage.total) * 100) : 0;

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
          <button 
            className="text-gray-600"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              placeholder="Search files..." 
              className="bg-gray-200 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-3 text-gray-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Dashboard</h2>
                <div className="hidden sm:flex gap-1">
                  <button 
                    onClick={() => setViewMode('grid')} 
                    className={`p-1 rounded ${viewMode === 'grid' ? 'text-blue-600 bg-blue-100' : 'text-gray-500'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')} 
                    className={`p-1 rounded ${viewMode === 'list' ? 'text-blue-600 bg-blue-100' : 'text-gray-500'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />
              <button 
                onClick={handleUploadClick} 
                className="bg-[#2E86AB] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1d6a8f] transition-colors"
              >
                <Upload size={18} /> Upload File
              </button>
            </div>

            <div className="bg-[#A1D2CE] p-6 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold">Welcome Back, Felix!</h2>
                <p className="text-gray-700">You have {filteredFiles.length} files in your storage</p>
                <button className="mt-3 px-4 py-2 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1d6a8f] transition-colors">
                  Customize
                </button>
              </div>
              <img src="/welcome.jpg" alt="Welcome" className="h-24 w-auto" />
            </div>

            <h2 className="text-xl font-semibold mb-4">Folders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FolderCard 
                title="CSM 495 Assignment" 
                filesCount={16} 
                createdDate="13 Mar, 2023" 
                users={["https://via.placeholder.com/40", "https://via.placeholder.com/40"]} 
              />
              <FolderCard 
                title="Food Tracker Docs" 
                filesCount={23} 
                createdDate="13 Mar, 2023" 
                users={["https://via.placeholder.com/40", "https://via.placeholder.com/40"]} 
              />
              <FolderCard 
                title="Sunday Project Service" 
                filesCount={7} 
                createdDate="13 Mar, 2023" 
                users={["https://via.placeholder.com/40", "https://via.placeholder.com/40"]} 
              />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md w-full mt-10">
              <h2 className="text-lg font-semibold mb-4">Recent Files</h2>
              {filteredFiles.length > 0 ? (
                filteredFiles.slice(0, 3).map((file, index) => (
                  <RecentFiles key={index} file={file} />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No files found</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[#E6E6FA] p-4 rounded-lg w-full">
              <FileActivityCalendar />
            </div>
          </div>
        </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-white/10 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">File Preview</h3>
            <div className="mb-4">
              {file?.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-64 object-contain rounded-lg"
                />
              )}

              {file?.type === "application/pdf" && (
                <embed
                  src={URL.createObjectURL(file)}
                  type="application/pdf"
                  className="w-full h-64 rounded-lg"
                />
              )}

              {file?.type.startsWith("video/") && (
                <video controls className="w-full h-64 rounded-lg">
                  <source src={URL.createObjectURL(file)} type={file.type} />
                  Your browser does not support the video tag.
                </video>
              )}

              {!["image/", "application/pdf", "video/"].some(t => file?.type.startsWith(t)) && (
                <div className="text-gray-600 bg-gray-100 p-4 rounded-lg text-center">
                  <p className="font-semibold">No preview available</p>
                  <p className="text-sm mt-1">{file?.name}</p>
                </div>
              )}
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              className="w-full border rounded-lg p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />

            <button 
              onClick={handleFileUpload} 
              className="bg-[#2E86AB] text-white px-4 py-2 rounded-lg w-full hover:bg-[#1d6a8f] transition-colors"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload File"}
            </button>
            <button 
              onClick={() => setIsPreviewOpen(false)} 
              className="mt-3 text-gray-600 w-full text-center hover:text-blue-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;