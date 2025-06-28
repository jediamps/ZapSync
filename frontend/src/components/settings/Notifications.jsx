import React from "react";

const NotificationSettings = () => {
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
                  className="form-checkbox h-4 w-4 text-[var(--color-primary)]"
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default NotificationSettings;