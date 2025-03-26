import Sidebar from "../components/Sidebar";
import FolderCard from "../components/FolderCard";
import RecentFiles from "../components/RecentFiles";
import { Upload, Search } from "@mui/icons-material";
import { useState } from "react";
import DatePicker from "@mui/lab/DatePicker";  
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-200 rounded-full pl-10 pr-4 py-2 w-80"
            />
            <Search className="absolute left-3 top-2 text-gray-500" />
          </div>
          <button className="bg-[#2E86AB] text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
            <Upload /> Upload File
          </button>
        </div>

        {/* Welcome Section */}
        <div className="bg-[#A1D2CE] p-6 rounded-lg flex justify-between">
          <div>
            <h2 className="text-xl font-semibold">Welcome Back, Felix!</h2>
            <p>Arrange your documents and files to your preference</p>
            <button className="mt-3 px-4 py-2 bg-[#2E86AB] text-white rounded-lg cursor-pointer">
              Customize
            </button>
          </div>
          <img src="/welcome.jpg" alt="Welcome" className="h-24" />
        </div>

        {/* Folders */}
        <h2 className="text-xl font-semibold mt-6">Folders</h2>
        <div className="flex gap-4 mt-4">
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
        <RecentFiles />

        {/* Calendar Section */}
        <div className="mt-6">
            <DatePicker
              // label="Select date"
              // value={date}
              // onChange={(newDate) => setDate(newDate)}
              // renderInput={(params) => <TextField {...params} />}
            />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
