import React, { useState, useEffect } from "react";
import { Edit, X, Check, Menu, Upload } from "lucide-react";
import { useOutletContext } from "react-router";
import { useProfile } from "../hooks/UseProfile";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { toggleSidebar } = useOutletContext();
  const { profile: fetchedProfile, loading, error } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    bio: "",
    joined: ""
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    bio: ""
  });

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2); // Get max 2 characters
  };

  const generateUsername = (name) => {
    if (!name) return "@user";
    
    const names = name.trim().split(/\s+/);
    let base = "";
    
    if (names.length >= 4) {
      base = names.slice(0, 3).map(n => n[0]).join('') + names.slice(3).join('');
    } else if (names.length === 3) {
      base = names.slice(0, 2).map(n => n[0]).join('') + names[2];
    } else if (names.length === 2) {
      base = names[0][0] + names[1];
    } else {
      base = names[0];
    }
    
    // Generate a consistent number based on name hash
    const consistentNumber = Math.abs(
      base.split('').reduce((hash, char) => {
        return (hash << 5) - hash + char.charCodeAt(0);
      }, 0)
    ) % 10000; // Ensure 4-digit number
    
    return `@${base.toLowerCase()}${consistentNumber.toString().padStart(4, '0')}`;
  };

  // Initialize with fetched profile data when available
  useEffect(() => {
    if (fetchedProfile) {
      const fullName = fetchedProfile.fullname || "User Name";
      const generatedUsername = generateUsername(fullName);
      
      setUser({
        name: fullName,
        email: fetchedProfile.email || "",
        username: fetchedProfile.username || generatedUsername,
        bio: fetchedProfile.bio || "",
        joined: fetchedProfile.created_at || "Just now"
      });
      
      setFormData({
        name: fullName,
        email: fetchedProfile.email || "",
        username: fetchedProfile.username || generatedUsername,
        bio: fetchedProfile.bio || ""
      });
    }
  }, [fetchedProfile]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to current user data
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio
    });
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user data
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        username: formData.username,
        bio: formData.bio
      };
      
      setUser(updatedUser);
      setIsEditing(false);
      
      toast.success("Profile updated successfully", {
        className: "bg-[#2E86AB] text-white"
      });
    } catch (error) {
      toast.error("Failed to update profile", {
        className: "bg-red-500 text-white"
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E86AB]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>Error loading profile. <button 
            onClick={() => window.location.reload()}
            className="text-[#2E86AB] font-medium hover:underline"
          >
            Refresh page
          </button></p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-[#2E86AB] transition-colors lg:hidden"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Profile Initials Circle */}
                <div className="flex items-center justify-center w-32 h-32 rounded-full bg-[#2E86AB] text-white text-4xl font-bold">
                  {getInitials(user.name)}
                </div>
                
                <div className="flex-1 w-full">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          rows="3"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={handleSave} 
                          className="flex items-center gap-2 bg-[#2E86AB] text-white px-4 py-2 rounded-lg hover:bg-[#1d6a8f] transition-colors"
                        >
                          <Check size={18} /> Save
                        </button>
                        <button 
                          onClick={handleCancel} 
                          className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <X size={18} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                      <p className="text-sm text-gray-500">{user.username}</p>
                      <p className="text-gray-600 mt-4">{user.bio || "No bio provided"}</p>
                      
                      <div className="mt-6 space-y-1 text-sm">
                        <p className="text-gray-500"><span className="font-medium">Email:</span> {user.email || "Not provided"}</p>
                        <p className="text-gray-500"><span className="font-medium">Joined:</span> {user.joined}</p>
                      </div>
                      
                      <button 
                        onClick={handleEditClick} 
                        className="mt-4 flex items-center gap-2 bg-[#2E86AB] text-white px-4 py-2 rounded-lg hover:bg-[#1d6a8f] transition-colors"
                      >
                        <Edit size={16} /> Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4">Activity</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#A1D2CE] p-4 rounded-lg text-center">
                  <p className="text-gray-700">12%</p>
                  <p className="font-semibold">Profile completion</p>
                </div>
                <div className="bg-[#E6E6FA] p-4 rounded-lg text-center">
                  <p className="text-gray-700">0h</p>
                  <p className="font-semibold">Reported time</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-white to-green-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-500 mb-2">Pending action</p>
                <p className="text-lg font-semibold">Waiting for draft contract</p>
                <button
                  onClick={() => toast.info("Contract creation logic would go here", {
                    className: "bg-[#2E86AB] text-white"
                  })}
                  className="mt-4 bg-[#2E86AB] text-white px-4 py-2 rounded-lg hover:bg-[#1d6a8f] transition-colors"
                >
                  Create contract
                </button>
              </div>

              <div className="flex flex-wrap justify-between mt-6 text-sm text-gray-500 gap-2">
                <p><strong>Status:</strong> Recruitment stage</p>
                <p><strong>Created:</strong> February 24, 2025</p>
                <p><strong>Last updated:</strong> February 24, 2025</p>
              </div>
            </div>
          </div>

          {/* Right Column - Side Cards */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  View documents
                </a>
                <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  Team members
                </a>
                <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  Account settings
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#2E86AB] text-white p-2 rounded-full">
                    <Check size={16} />
                  </div>
                  <div>
                    <p className="font-medium">Profile updated</p>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 text-green-800 p-2 rounded-full">
                    <Upload size={16} />
                  </div>
                  <div>
                    <p className="font-medium">New document uploaded</p>
                    <p className="text-sm text-gray-500">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;