import React from "react";

const PrivacySettings = () => {
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
            <input type="checkbox" className="form-checkbox text-[var(--color-primary)]" />
            <span className="ml-2 text-sm text-gray-700">Make profile discoverable</span>
          </label>
        </div>
        <div>
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox text-[var(--color-primary)]" />
            <span className="ml-2 text-sm text-gray-700">Show activity status</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default PrivacySettings;