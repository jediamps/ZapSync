import React from "react";

const SecuritySettings = () => {
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
            <input type="checkbox" className="form-checkbox text-[var(--color-primary)]" />
            <span className="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default SecuritySettings;