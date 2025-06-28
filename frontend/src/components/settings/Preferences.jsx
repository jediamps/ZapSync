import React from "react";

const PreferencesSettings = () => {
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
            <input type="checkbox" className="form-checkbox text-[var(--color-primary)]" />
            <span className="ml-2 text-sm text-gray-700">Show recent items on startup</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default PreferencesSettings;