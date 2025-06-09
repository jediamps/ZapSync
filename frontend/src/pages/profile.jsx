import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Jedidiah Ampadu-Ameyaw",
    avatar: "IMG_9889.HEIC",
    email: "Jediamps@gmail.com",
    username: "Jedi._",
    bio: "Frontend engineer passionate about clean UI and accessible design.",
    joined: "January 12, 2022"
  });
  const [formData, setFormData] = useState(user);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleEditClick = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
  };

  const handleSave = async () => {
    if (avatarFile) {
      const form = new FormData();
      form.append("avatar", avatarFile);

      try {
        const res = await fetch("/api/upload-avatar", {
          method: "POST",
          body: form
        });
        const data = await res.json();
        if (data.avatarUrl) {
          formData.avatar = data.avatarUrl;
        }
      } catch (err) {
        toast.error("Failed to upload avatar.");
      }
    }
    setUser(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <ToastContainer position="top-right" autoClose={3000} />

      <button
        className="p-2 md:hidden absolute top-4 left-4 z-50 bg-white rounded shadow"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open Sidebar"
      >
        ☰
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <nav className="flex gap-6 mb-6 border-b pb-2 text-gray-600">
          <a href="#" className="font-semibold text-green-600">People</a>
          <a href="#">Dashboard</a>
          <a href="#">Contracts</a>
          <a href="#">Benefits</a>
          <a href="#">More</a>
        </nav>

        <div className="bg-white rounded-lg p-6 shadow mb-6 flex gap-6 items-center">
          <img
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border object-cover"
          />
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded p-2"
                  placeholder="Full Name"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded p-2"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full border rounded p-2"
                  placeholder="Username"
                />
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full border rounded p-2"
                  placeholder="Bio"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block"
                />
                <div className="space-x-2">
                  <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
                  <button onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500">@{user.username}</p>
                <p className="text-sm text-gray-600 mt-2">{user.bio}</p>
                <p className="text-sm text-gray-400 mt-1">Joined: {user.joined}</p>
                <p className="text-sm text-gray-400">Email: {user.email}</p>
                <button onClick={handleEditClick} className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Edit Profile</button>
              </>
            )}
          </div>
        </div>

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
              onClick={() => alert("Contract creation logic goes here.")}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Create contract
            </button>
          </div>

          <div className="flex justify-between mt-6 text-sm text-gray-500">
            <p><strong>Status:</strong> Recruitment stage</p>
            <p><strong>Created:</strong> February 24, 2025</p>
            <p><strong>Last updated:</strong> February 24, 2025</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
