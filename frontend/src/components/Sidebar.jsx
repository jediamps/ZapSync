import { Cloud, FolderShared, BarChart, Delete, Logout } from "@mui/icons-material";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#2E86AB] text-white flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-8">ZapSync</h1>

      <nav className="flex flex-col gap-6">
        <a href="#" className="flex items-center gap-4 text-lg hover:text-blue-300">
          <Cloud /> My Drive
        </a>
        <a href="#" className="flex items-center gap-4 text-lg hover:text-blue-300">
          <FolderShared /> Shared Files
        </a>
        <a href="#" className="flex items-center gap-4 text-lg hover:text-blue-300">
          <BarChart /> Statistics
        </a>
        <a href="#" className="flex items-center gap-4 text-lg hover:text-blue-300">
          <Delete /> Trash
        </a>
        <a href="#" className="flex items-center gap-4 text-lg hover:text-red-400 mt-auto">
          <Logout /> Logout
        </a>
      </nav>

      <div className="mt-auto text-sm">
        <p>Storage</p>
        <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
          <div className="bg-white h-2 rounded-full w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
