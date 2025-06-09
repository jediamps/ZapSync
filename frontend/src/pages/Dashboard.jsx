import { useRef, useState } from "react";
import { Upload, Search, Notifications, HelpOutline, Menu, ViewList, ViewModule, KeyboardArrowDown } from "@mui/icons-material";
import SettingsIcon from '@mui/icons-material/Settings';
import Sidebar from "../components/Sidebar";
import FolderCard from "../components/FolderCard";
import RecentFiles from "../components/RecentFiles";
import FileActivityCalendar from "../components/FileActivityCalendar";
import { uploadFile } from "../services/api";
import { toast, ToastContainer } from "react-toastify";


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [file, setFile] = useState(null); // Store selected file
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); 
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

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

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadFile(file, description);
      if (res.message == "User upload successful") {
        toast.success("File uploaded successfully!");
        setFile(null); 
        setIsPreviewOpen(false);
        setDescription('');
      } else {
        toast.error("File upload failed!");
        console.error("Upload failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.detail); 
      console.error("Error uploading file:", err);
    } finally {
      setLoading(false);
    }
    setIsPreviewOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
      {/* Sidebar - Fixed on desktop, toggleable on mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
          <div className="flex justify-between items-center">
            {/* Left Side: Menu Icon on Mobile */}
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden text-gray-600"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu />
              </button>
              <div className="relative flex-1 max-w-md">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="bg-gray-200 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" />
              </div>
            </div>

            {/* Right Side: Profile and Icons */}
            <div className="flex items-center gap-6">
              {/* These 3 icons are only shown on large screens */}
              <div className="hidden lg:flex items-center gap-4">
                <HelpOutline className="text-gray-600 cursor-pointer hover:text-blue-600" />
                <SettingsIcon className="text-gray-600 cursor-pointer hover:text-blue-600" />
                <Notifications className="text-gray-600 cursor-pointer hover:text-blue-600" />
              </div>

              <div className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-semibold hidden sm:inline">Felix</span>
                  <KeyboardArrowDown className="text-gray-600" />
                </div>

                {/* Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 h-full overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side (2/3) - Dashboard Content */}
            <div className="lg:col-span-2">
              {/* Dashboard Title & Upload Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Dashboard</h2>
                  <div className="hidden sm:flex gap-1">
                    <ViewModule className="cursor-pointer text-gray-500 hover:text-blue-600" />
                    <ViewList className="cursor-pointer text-gray-500 hover:text-blue-600" />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />
                <button onClick={handleUploadClick} className="bg-[#2E86AB] text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#1d6a8f] transition-colors">
                  <Upload /> Upload File
                </button>
              </div>

              {/* Welcome Section */}
              <div className="bg-[#A1D2CE] p-6 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Welcome Back, Felix!</h2>
                  <p className="text-gray-700">Arrange your documents and files to your preference</p>
                  <button className="mt-3 px-4 py-2 bg-[#2E86AB] text-white rounded-lg cursor-pointer hover:bg-[#1d6a8f] transition-colors">
                    Customize
                  </button>
                </div>
                <img src="/welcome.jpg" alt="Welcome" className="h-24 w-auto" />
              </div>

              {/* Folders Section */}
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

              {/* Recent Files */}
              <div className="bg-white p-4 rounded-lg shadow-md w-full mt-10">
                <h2 className="text-lg font-semibold mb-4">Recent Files</h2>
                <RecentFiles />
                <RecentFiles />
                <RecentFiles />
              </div>
            </div>

            {/* Right Side (1/3) - Date Picker & Storage */}
            <div className="flex flex-col gap-6">
              {/* Date Picker */}
              <div className="bg-[#E6E6FA] p-4 rounded-lg w-full">
                <FileActivityCalendar />
              </div>

              {/* Storage Usage */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">Storage Usage</h3>
                <div className="mt-2">
                  <div className="w-full bg-gray-300 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">75% used - 15GB/20GB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

   {/* File Preview Popup */}
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

          {/* Description Input */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..."
            className="w-full border rounded-lg p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />

          <button 
            onClick={handleFileUpload} 
            className="bg-[#2E86AB] text-white px-4 py-2 rounded-lg w-full cursor-pointer hover:bg-[#1d6a8f] transition-colors"
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

    </div>
  );
};

export default Dashboard;
