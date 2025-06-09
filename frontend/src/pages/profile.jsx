import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const createContract = () => {
    alert("Contract creation logic goes here.");
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Mobile Toggle Button */}
      <button
        className="p-2 md:hidden absolute top-4 left-4 z-50 bg-white rounded shadow"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open Sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        {/* Top Navigation */}
        <nav className="flex gap-6 mb-6 border-b pb-2 text-gray-600">
          <a href="#" className="font-semibold text-green-600">People</a>
          <a href="#">Dashboard</a>
          <a href="#">Contracts</a>
          <a href="#">Benefits</a>
          <a href="#">More</a>
        </nav>

        {/* Overview Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between mb-6">
            <div className="text-center">
              <p className="text-gray-400">12%</p>
              <p className="font-semibold">of the profile is filled out</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">0h</p>
              <p className="font-bold">reported time this month</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-white to-green-50 p-6 rounded-lg border">
            <p className="text-gray-500 mb-2">One important thing...</p>
            <p className="text-lg font-semibold">Arlene is waiting for the draft contract</p>
            <button
              onClick={createContract}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Create contract
            </button>
          </div>

          <div className="flex justify-between mt-6 text-sm text-gray-500">
            <p><strong>Status:</strong> Recruitment stage</p>
            <p><strong>Created:</strong> February 24, 2023</p>
            <p><strong>Last updated:</strong> February 24, 2023</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
