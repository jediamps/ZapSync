import React, { useState } from "react";
import { Cloud, FolderShared, BarChart, Delete, Logout } from "@mui/icons-material";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("Appearance");

  const tabs = [
    "Account", "Profile", "Security", "Appearance", "Notifications", "Billing", "Integrations"
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Account":
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" placeholder="you@example.com" className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" placeholder="+1234567890" className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recovery Email</label>
                <input type="email" placeholder="recovery@example.com" className="w-full border px-3 py-2 rounded" />
              </div>
            </div>
          </>
        );
      case "Profile":
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" placeholder="johndoe" className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea placeholder="Tell us about yourself..." className="w-full border px-3 py-2 rounded"></textarea>
              </div>
            </div>
          </>
        );
      case "Security":
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
                <input type="password" placeholder="New Password" className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input type="password" placeholder="Confirm Password" className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#2E86AB]" />
                  <span className="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</span>
                </label>
              </div>
            </div>
          </>
        );
      case "Appearance":
        return (
          <>
            <h2 className="text-lg font-semibold mb-2">Appearance</h2>
            <p className="text-sm text-gray-600 mb-6">Change how your public dashboard looks and feels.</p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand color</label>
              <input type="color" defaultValue="#444CE7" className="w-16 h-10 border rounded" />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dashboard charts</label>
              <p className="text-xs text-[#2E86AB] mb-2 cursor-pointer">View examples</p>
              <div className="flex gap-4">
                {["Default", "Simplified", "Custom CSS"].map((option) => (
                  <div key={option} className="border rounded p-3 text-center w-32 cursor-pointer">
                    <div className="bg-gray-100 h-16 mb-2" />
                    <p className="text-xs font-medium">{option}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select className="border rounded px-3 py-2 text-sm">
                <option>English (UK)</option>
                <option>English (US)</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cookie banner</label>
              <p className="text-xs text-[#2E86AB] mb-2 cursor-pointer">View examples</p>
              <div className="flex gap-4">
                {["Default", "Simplified", "None"].map((option) => (
                  <div key={option} className="border rounded p-3 text-center w-32 cursor-pointer">
                    <div className="bg-gray-100 h-16 mb-2" />
                    <p className="text-xs font-medium">{option}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case "Notifications":
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">Notification settings</h2>
            <p className="text-sm text-gray-600 mb-6">
              Manage how you receive notifications: Push, Email, and SMS.
            </p>
            {["Comments", "Tags", "Reminders", "More activity about you"].map((type) => (
              <div key={type} className="mb-6">
                <h3 className="text-sm font-medium text-gray-800 mb-1">{type}</h3>
                <p className="text-xs text-gray-500 mb-2">Control notification delivery methods for {type.toLowerCase()}.</p>
                <div className="flex gap-4">
                  {["Push", "Email", "SMS"].map((method) => (
                    <label key={method} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-[#2E86AB]"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </>
        );
      case "Billing":
        return <p className="text-sm text-gray-600">View your current subscription and billing history.</p>;
      case "Integrations":
        return <p className="text-sm text-gray-600">Configure and manage third-party integrations.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <aside className="w-full lg:w-60 h-auto lg:h-screen bg-[#2E86AB] text-white p-5">
        <h1 className="text-2xl font-bold mb-8">ZapSync</h1>
        <nav className="flex flex-col gap-6">
          <a href="/dashboard" className="flex items-center gap-4 text-lg hover:text-blue-300 transition-colors">
            <Cloud /> My Drive
          </a>
          <a href="#" className="flex items-center gap-4 text-lg hover:text-blue-300 transition-colors">
            <FolderShared /> Shared Files
          </a>
          <a href="#" className="flex items-center gap-4 text-lg hover:text-blue-300 transition-colors">
            <BarChart /> Statistics
          </a>
          <a href="#" className="flex items-center gap-4 text-lg hover:text-blue-300 transition-colors">
            <Delete /> Trash
          </a>
          <a href="#" className="flex items-center gap-4 text-lg hover:text-red-400 mt-auto transition-colors">
            <Logout /> Logout
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="flex space-x-4 border-b mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? "border-[#2E86AB] text-[#2E86AB]" : "border-transparent text-gray-500 hover:text-[#2E86AB]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <section>
          {renderTabContent()}
          <div className="flex justify-end mt-8 space-x-4">
            <button className="px-4 py-2 rounded border text-sm">Cancel</button>
            <button className="px-4 py-2 rounded text-white bg-[#2E86AB] text-sm">Save changes</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;
