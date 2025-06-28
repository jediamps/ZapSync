import React, { useState } from "react";
import { Cloud, FolderShared, BarChart, Delete, Logout } from "@mui/icons-material";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("Appearance");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    recoveryEmail: "",
    fullName: "",
    username: "",
    bio: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
    brandColor: "#444CE7",
    chartStyle: "Default",
    language: "English (UK)",
    cookieBanner: "Default",
    notifications: {
      Comments: [],
      Tags: [],
      Reminders: [],
      "More activity about you": []
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("notifications")) {
      const [_, category, method] = name.split("|");
      setFormData((prev) => {
        const methods = new Set(prev.notifications[category]);
        checked ? methods.add(method) : methods.delete(method);
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            [category]: Array.from(methods)
          }
        };
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSave = () => {
    alert("Settings saved (not persisted)");
  };

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
                <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recovery Email</label>
                <input name="recoveryEmail" value={formData.recoveryEmail} onChange={handleChange} type="email" className="w-full border px-3 py-2 rounded" />
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
                <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input name="username" value={formData.username} onChange={handleChange} type="text" className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full border px-3 py-2 rounded"></textarea>
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
                <input name="newPassword" value={formData.newPassword} onChange={handleChange} type="password" className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input name="twoFactor" type="checkbox" checked={formData.twoFactor} onChange={handleChange} className="form-checkbox text-[#2E86AB]" />
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
              <input type="color" name="brandColor" value={formData.brandColor} onChange={handleChange} className="w-16 h-10 border rounded" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dashboard charts</label>
              <div className="flex gap-4">
                {["Default", "Simplified", "Custom CSS"].map((option) => (
                  <label key={option} className="border rounded p-3 text-center w-32 cursor-pointer">
                    <input type="radio" name="chartStyle" value={option} checked={formData.chartStyle === option} onChange={handleChange} className="mb-2" />
                    <div className="bg-gray-100 h-16 mb-2" />
                    <p className="text-xs font-medium">{option}</p>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select name="language" value={formData.language} onChange={handleChange} className="border rounded px-3 py-2 text-sm">
                <option>English (UK)</option>
                <option>English (US)</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cookie banner</label>
              <div className="flex gap-4">
                {["Default", "Simplified", "None"].map((option) => (
                  <label key={option} className="border rounded p-3 text-center w-32 cursor-pointer">
                    <input type="radio" name="cookieBanner" value={option} checked={formData.cookieBanner === option} onChange={handleChange} className="mb-2" />
                    <div className="bg-gray-100 h-16 mb-2" />
                    <p className="text-xs font-medium">{option}</p>
                  </label>
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
            {Object.keys(formData.notifications).map((type) => (
              <div key={type} className="mb-6">
                <h3 className="text-sm font-medium text-gray-800 mb-1">{type}</h3>
                <p className="text-xs text-gray-500 mb-2">Control notification delivery methods for {type.toLowerCase()}.</p>
                <div className="flex gap-4">
                  {["Push", "Email", "SMS"].map((method) => (
                    <label key={method} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        name={`notifications|${type}|${method}`}
                        checked={formData.notifications[type].includes(method)}
                        onChange={handleChange}
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
            <h2 className="text-lg font-semibold mb-4">Subscription & Billing</h2>
            <div className="space-y-6">
              <div className="p-4 border rounded bg-white shadow-sm">
                <h3 className="font-medium text-gray-800 mb-2">Current Plan</h3>
                <p className="text-sm text-gray-600">Premium Plan - $12/month</p>
                <p className="text-xs text-gray-400 mt-1">Next billing date: July 1, 2025</p>
                <button className="mt-4 text-sm text-blue-600 hover:underline">Change Plan</button>
              </div>
              <div className="p-4 border rounded bg-white shadow-sm">
                <h3 className="font-medium text-gray-800 mb-2">Billing History</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>June 1, 2025 - $12 - Paid</li>
                  <li>May 1, 2025 - $12 - Paid</li>
                  <li>April 1, 2025 - $12 - Paid</li>
                </ul>
              </div>
              <div className="p-4 border rounded bg-white shadow-sm">
                <h3 className="font-medium text-gray-800 mb-2">Payment Method</h3>
                <p className="text-sm text-gray-600">Visa ending in 1234</p>
                <button className="mt-2 text-sm text-blue-600 hover:underline">Update Payment Method</button>
              </div>
            </div>
          </>
        );
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
      <main className="flex-1 p-10 overflow-y-auto transition-all duration-300 ease-in-out">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="flex space-x-4 border-b mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                activeTab === tab ? "border-[#2E86AB] text-[#2E86AB] scale-105" : "border-transparent text-gray-500 hover:text-[#2E86AB] hover:scale-105"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <section className="transition-all duration-500 ease-in-out">
          {renderTabContent()}
          <div className="flex justify-end mt-8 space-x-4">
            <button className="px-4 py-2 rounded border text-sm">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 rounded text-white bg-[#2E86AB] text-sm">Save changes</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;

