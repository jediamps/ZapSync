import React from "react";

const ProfilePage = () => {
  const createContract = () => {
    alert("Contract creation logic goes here.");
  };

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <button className="text-gray-500 mb-6">&larr; Back</button>
        <div className="flex flex-col items-center">
          <img
            src="https://i.pravatar.cc/100?img=1"
            className="rounded-full w-24 h-24 mb-2"
            alt="Profile"
          />
          <h2 className="text-xl font-semibold">Arlene McCoy</h2>
        </div>
        <div className="mt-6 space-y-1">
          <p><strong>Space:</strong> Digital</p>
          <p><strong>Progression:</strong> Expert</p>
          <p><strong>Work e-mail:</strong> <a href="mailto:amccoy@virtuslab.com" className="text-blue-500">amccoy@virtuslab.com</a></p>
          <p><strong>Private e-mail:</strong> Add...</p>
          <p><strong>Phone:</strong> Add...</p>
          <p><strong>PESEL:</strong> Add...</p>
        </div>
        <button className="mt-4 text-blue-500 underline">View all fields</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        {/* Top Navigation */}
        <nav className="flex gap-6 mb-6 border-b pb-2 text-gray-600">
          <a href="#" className="font-semibold text-green-600">People</a>
          <a href="#">Dashboard</a>
          <a href="#">Contracts</a>
          <a href="#">Benefits</a>
          <a href="#">More</a>
        </nav>

        {/* Overview Section */}
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
              onClick={createContract}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Create contract
            </button>
          </div>

          <div className="flex justify-between mt-6 text-sm text-gray-500">
            <p><strong>Status:</strong> Recruitment stage</p>
            <p><strong>Created:</strong> February 24, 2023</p>
            <p><strong>Last updated:</strong> February 24, 2023</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
