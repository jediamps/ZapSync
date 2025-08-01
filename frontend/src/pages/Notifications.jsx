import React from 'react';
import { 
  Bell, BellOff, CheckCircle, AlertCircle, 
  Info, MessageSquare, Menu, Clock 
} from 'lucide-react';
import { useOutletContext } from 'react-router';

function Notifications() {
  const { toggleSidebar } = useOutletContext();
  
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'File uploaded successfully',
      message: 'Your file "Advanced Algorithms.pdf" has been uploaded',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Storage limit approaching',
      message: 'You\'ve used 85% of your storage quota',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'New group invitation',
      message: 'You\'ve been invited to join "Computer Science Study Group"',
      time: '5 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'message',
      title: 'New comment on your file',
      message: 'Dr. Mensah commented on your "Research Proposal.docx"',
      time: '1 day ago',
      read: true
    },
    {
      id: 5,
      type: 'error',
      title: 'Upload failed',
      message: 'Failed to upload "Project Presentation.pptx" - File too large',
      time: '2 days ago',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header with sidebar toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center mb-6 gap-7">
        <button className="text-gray-600" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500">Your recent system notifications</p>
        </div>
      </div>

      {/* Notification controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Mark all as read
          </button>
          <button className="text-sm font-medium text-gray-600 hover:text-gray-800">
            <BellOff className="inline w-4 h-4 mr-1" />
            Mute notifications
          </button>
        </div>
        <button className="text-sm font-medium text-gray-600 hover:text-gray-800">
          <Clock className="inline w-4 h-4 mr-1" />
          Notification settings
        </button>
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-4 rounded-lg border ${notification.read ? 'bg-white' : 'bg-[var(--color-primary-light)]'} ${notification.read ? 'border-gray-200' : 'border-blue-200'}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                {notification.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                {notification.type === 'message' && <MessageSquare className="w-5 h-5 text-purple-500" />}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {notification.time}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                {!notification.read && (
                  <button className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800">
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state (uncomment if needed) */}
      {/* {notifications.length === 0 && (
        <div className="text-center py-12">
          <BellOff className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            You'll see notifications here when you receive them.
          </p>
        </div>
      )} */}
    </div>
  );
}

export default Notifications;