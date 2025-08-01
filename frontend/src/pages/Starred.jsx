import React from 'react';
import { 
  Star, Folder, FileText, HardDrive, 
  Clock, Download, Upload, Menu 
} from 'lucide-react';
import { useOutletContext } from 'react-router';

function Starred() {
  const { toggleSidebar } = useOutletContext();
  
  // Mock data for starred items
  const starredItems = [
    {
      id: 1,
      name: 'Advanced Algorithms Notes',
      type: 'PDF',
      size: '2.4 MB',
      starredDate: '2 days ago',
      uploader: 'Prof. Kwame',
      downloads: 45,
      icon: <FileText className="w-5 h-5 text-red-500" />
    },
    {
      id: 2,
      name: 'Database Systems Project',
      type: 'ZIP',
      size: '15.8 MB',
      starredDate: '1 week ago',
      uploader: 'Team Group A',
      downloads: 28,
      icon: <Folder className="w-5 h-5 text-yellow-500" />
    },
    {
      id: 3,
      name: 'Computer Networks Slides',
      type: 'PPTX',
      size: '8.2 MB',
      starredDate: '3 days ago',
      uploader: 'Dr. Amina',
      downloads: 63,
      icon: <FileText className="w-5 h-5 text-orange-500" />
    },
    {
      id: 4,
      name: 'Research Paper Collection',
      type: 'Folder',
      size: '32.1 MB',
      starredDate: '2 weeks ago',
      uploader: 'Library Dept',
      downloads: 12,
      icon: <Folder className="w-5 h-5 text-blue-500" />
    },
    {
      id: 5,
      name: 'Software Engineering Guidelines',
      type: 'DOCX',
      size: '1.7 MB',
      starredDate: '5 days ago',
      uploader: 'Prof. Mensah',
      downloads: 39,
      icon: <FileText className="w-5 h-5 text-green-500" />
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with sidebar toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center mb-6 gap-7">
        <button className="text-gray-600" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-300" />
            Starred Files
          </h1>
          <p className="text-sm text-gray-500">Your most important files in one place</p>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Starred</p>
              <p className="text-2xl font-bold">{starredItems.length}</p>
            </div>
            <div className="p-2 rounded-full bg-yellow-50">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-300" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Downloads</p>
              <p className="text-2xl font-bold">
                {starredItems.reduce((sum, item) => sum + item.downloads, 0)}
              </p>
            </div>
            <div className="p-2 rounded-full bg-blue-50">
              <Download className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Size</p>
              <p className="text-2xl font-bold">
                {starredItems.reduce((sum, item) => {
                  const size = parseFloat(item.size.split(' ')[0]);
                  return sum + size;
                }, 0).toFixed(1)} MB
              </p>
            </div>
            <div className="p-2 rounded-full bg-purple-50">
              <HardDrive className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Starred Files Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Starred
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploader
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {starredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.starredDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.uploader}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Download className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">{item.downloads}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state (uncomment if needed) */}
      {/* {starredItems.length === 0 && (
        <div className="text-center py-12">
          <Star className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No starred files</h3>
          <p className="mt-1 text-sm text-gray-500">
            Star important files to find them quickly here.
          </p>
        </div>
      )} */}
    </div>
  );
}

export default Starred;