import React from "react";

const IntegrationSettings = () => {
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
};

export default IntegrationSettings;