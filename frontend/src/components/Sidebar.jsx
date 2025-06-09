import { Cloud, FolderShared, BarChart, Delete, Logout } from "@mui/icons-material";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 backdrop-blur-sm bg-white/10 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-30 w-54 h-full bg-[#2E86AB] text-white flex flex-col p-5 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <h1 className="text-2xl font-bold mb-8">ZapSync</h1>

        <nav className="flex flex-col gap-6">
          <a href="/dashboard" className="flex items-center gap-4 text-lg hover:text-blue-300 transition-colors">
            <Cloud /> My Drive
          </a>
          <a href="#" className="flex items-center gap-4 text-lg hover:text-blue-300 transition-colors">
            <FolderShared /> Shared Files
          </a>
          <a href="#" className="flex items-center gap-4 text-lg hover:text-blue-300 transition-colors">
            <BarChart /> Statistics
          </a>
          <a href="#" className="flex items-center gap-4 text-lg hover:text-blue-300 transition-colors">
            <Delete /> Trash
          </a>
          <a href="#" className="flex items-center gap-4 text-lg hover:text-red-400 mt-auto transition-colors">
            <Logout /> Logout
          </a>
        </nav>

        <div className="mt-auto text-sm">
          <p>Storage</p>
          <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
            <div className="bg-white h-2 rounded-full" style={{ width: "75%" }}></div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;