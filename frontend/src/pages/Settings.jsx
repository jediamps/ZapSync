import React, { useState } from "react";
import { useOutletContext } from "react-router";
import { Menu, ChevronDown } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("Appearance");
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const { toggleSidebar } = useOutletContext();

  const tabs = [
    "Preferences", "Privacy", "Security", "Appearance", 
    "Notifications", "Billing", "Integrations"
  ];


  const renderTabContent = () => {
    switch (activeTab) {
      case "Preferences":
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default View</label>
                <select className="w-full border px-3 py-2 rounded text-sm">
                  <option>Dashboard</option>
                  <option>Projects</option>
                  <option>Recent Activity</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Items Per Page</label>
                <select className="w-full border px-3 py-2 rounded text-sm">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#2E86AB]" />
                  <span className="ml-2 text-sm text-gray-700">Show recent items on startup</span>
                </label>
              </div>
            </div>
          </>
        );
      case "Privacy":
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Sharing</label>
                <select className="w-full border px-3 py-2 rounded text-sm">
                  <option>Share anonymized usage data</option>
                  <option>Do not share any data</option>
                </select>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#2E86AB]" />
                  <span className="ml-2 text-sm text-gray-700">Make profile discoverable</span>
                </label>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#2E86AB]" />
                  <span className="ml-2 text-sm text-gray-700">Show activity status</span>
                </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <div className="flex gap-4 mt-2">
                {["Light", "Dark", "System"].map((theme) => (
                  <button
                    key={theme}
                    className={`border rounded px-4 py-2 text-sm ${
                      theme === "Light" ? "bg-white text-black" : 
                      theme === "Dark" ? "bg-gray-800 text-white" : 
                      "bg-gray-100 text-black"
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

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
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select className="w-full border px-3 py-2 rounded text-sm">
                  <option>Credit Card ending in 4242</option>
                  <option>PayPal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                <select className="w-full border px-3 py-2 rounded text-sm">
                  <option>Monthly</option>
                  <option>Yearly (Save 20%)</option>
                </select>
              </div>
            </div>
          </>
        );
      case "Integrations":
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">Third-Party Integrations</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border p-3 rounded">
                <div>
                  <h3 className="text-sm font-medium">Google Drive</h3>
                  <p className="text-xs text-gray-500">Connect to your Google Drive account</p>
                </div>
                <button className="px-3 py-1 rounded border text-sm">Connect</button>
              </div>
              <div className="flex items-center justify-between border p-3 rounded">
                <div>
                  <h3 className="text-sm font-medium">Slack</h3>
                  <p className="text-xs text-gray-500">Receive notifications in Slack</p>
                </div>
                <button className="px-3 py-1 rounded border text-sm">Connect</button>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

   return (
    <>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-[#2E86AB] transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Settings</h1>
      </div>

      {/* Mobile tabs dropdown */}
      <div className="md:hidden mb-4 relative">
        <button
          onClick={() => setShowMobileTabs(!showMobileTabs)}
          className="w-full flex justify-between items-center border rounded-md px-4 py-2 text-sm font-medium"
        >
          {activeTab}
          <ChevronDown size={16} className={`transition-transform ${showMobileTabs ? 'rotate-180' : ''}`} />
        </button>
        {showMobileTabs && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setShowMobileTabs(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  activeTab === tab 
                    ? 'bg-[#2E86AB] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop tabs */}
      <div className="hidden md:flex space-x-4 border-b mb-6 md:mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab 
                ? "border-[#2E86AB] text-[#2E86AB]" 
                : "border-transparent text-gray-500 hover:text-[#2E86AB]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <section className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
        {renderTabContent()}
        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-6 md:mt-8">
          <button className="px-4 py-2 rounded border text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 rounded text-white bg-[#2E86AB] text-sm hover:bg-[#1E6F8C] transition-colors">
            Save changes
          </button>
        </div>
      </section>
    </>
  );
};

export default SettingsPage;