import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

const pieData1 = [
  { name: "Chrome", value: 45 },
  { name: "Firefox", value: 25 },
  { name: "Safari", value: 20 },
  { name: "Edge", value: 10 },
];

const pieData2 = [
  { name: "USA", value: 50 },
  { name: "India", value: 30 },
  { name: "Germany", value: 15 },
  { name: "Others", value: 5 },
];

const barData = [
  { name: "Mon", Users: 200 },
  { name: "Tue", Users: 300 },
  { name: "Wed", Users: 250 },
  { name: "Thu", Users: 400 },
  { name: "Fri", Users: 350 },
  { name: "Sat", Users: 150 },
  { name: "Sun", Users: 100 },
];

const activityLog = [
  "User A logged in",
  "User B changed password",
  "User C logged out",
  "Admin created new role",
  "Security alert: Failed login from IP 192.168.1.5",
];

const securityEvents = [
  { event: "Failed Login", count: 5 },
  { event: "Password Change", count: 3 },
  { event: "New Device Login", count: 2 },
  { event: "2FA Attempt", count: 4 },
];

function Statistics() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">User Browser Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData1} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {pieData1.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">User Location Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData2} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {pieData2.map((entry, index) => (
                <Cell key={`cell2-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded shadow md:col-span-2">
        <h2 className="text-xl font-bold mb-4">Weekly Active Users</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Users" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Security Events</h2>
        <ul className="space-y-2">
          {securityEvents.map((event, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{event.event}</span>
              <span className="font-semibold">{event.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity Log</h2>
        <ul className="list-disc pl-5 space-y-1">
          {activityLog.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded shadow md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 p-4 rounded-xl text-center">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">1,024</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl text-center">
          <h3 className="text-lg font-semibold">New Signups</h3>
          <p className="text-2xl font-bold">78</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl text-center">
          <h3 className="text-lg font-semibold">Active Sessions</h3>
          <p className="text-2xl font-bold">143</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl text-center">
          <h3 className="text-lg font-semibold">Alerts Today</h3>
          <p className="text-2xl font-bold">5</p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
