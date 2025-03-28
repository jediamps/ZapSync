import { useState } from "react";
import { Upload, Search, Notifications, HelpOutline, Menu, ViewList, ViewModule, KeyboardArrowDown } from "@mui/icons-material";
// import SettingsIcon from '@mui/icons-material/Settings';
import Sidebar from "../components/Sidebar";
import FolderCard from "../components/FolderCard";
import RecentFiles from "../components/RecentFiles";
import DatePicker from "../components/DatePicker";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex overflow-hidden h-screen bg-gray-100">
      {/* Sidebar - Fixed on desktop, toggleable on mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
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
              <HelpOutline className="text-gray-600 cursor-pointer hover:text-blue-600" />
              {/* <SettingsIcon className="text-gray-600 cursor-pointer hover:text-blue-600" /> */}
              <Notifications className="text-gray-600 cursor-pointer hover:text-blue-600" />
              <div className="flex items-center gap-2 cursor-pointer">
                <img src="https://via.placeholder.com/40" alt="Profile" className="w-10 h-10 rounded-full" />
                <span className="font-semibold hidden sm:inline">Felix</span>
                <KeyboardArrowDown className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 overflow-y-scroll">
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
                <button className="bg-[#2E86AB] text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#1d6a8f] transition-colors">
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
              <div className="bg-[#E6E6FA] p-4 rounded-lg">
                <DatePicker selectedDate={date} onChange={setDate} />
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
    </div>
  );
};

export default Dashboard;