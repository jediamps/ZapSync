import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import { Outlet, useNavigate } from "react-router";
import { logoutUser } from "../services/api";

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();
    
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    const handleLogout = async () => {
      try {
        await logoutUser();
        toast.success("You've been logged out successfully!")
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        toast.error("Logout failed. Please try again.");
        console.error("Logout error:", error);
      }
    };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-1 min-h-0"> 
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar}
          setShowLogoutConfirm={setShowLogoutConfirm}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-0"> {/* Wrapper div */}
          <main className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
          }`}>
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <Outlet context={{ toggleSidebar }} />
            </div>
            <Footer />
          </main>
        </div>
      </div>


       {/* Logout Confirmation Modal */}
       {showLogoutConfirm && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-white/10 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
            onClick={() => setShowLogoutConfirm(false)}
          />
          
          {/* Modal with slide-up animation */}
          <div className="absolute inset-0 flex items-center justify-center p-4 animate-slideUp">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Confirm Logout</h3>
              <p className="mb-8 text-gray-600 text-lg">Are you sure you want to logout?</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 flex-1 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex-1"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;