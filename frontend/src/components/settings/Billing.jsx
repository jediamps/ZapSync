import React from "react";

const BillingSettings = () => {
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
};

export default BillingSettings;