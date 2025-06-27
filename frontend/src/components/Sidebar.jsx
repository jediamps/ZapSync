import { Cloud, FolderOutput, BarChart, Trash2, X, Bell, Star, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useProfile } from "../hooks/UseProfile";
import LoadingSpinner from "./LoadingSpinner"; 

const Sidebar = ({ isOpen, toggleSidebar, setShowLogoutConfirm }) => {
  const { profile, loading, error } = useProfile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return "ZP"; // Default initials if name is not available
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2); 
  };

  if (error) {
    console.error("Error loading profile:", error);
    // You could render an error state here if needed
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 h-screen bg-[#2E86AB] text-white flex flex-col p-5 transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'
      }`}
    >
      <div className="flex items-center justify-between mb-8 overflow-hidden">
        <h1 className={`text-2xl font-bold whitespace-nowrap ${!isOpen && 'lg:hidden'}`}>ZapSync</h1>
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-full hover:bg-white/10 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-col gap-4 flex-1">
        {/* Navigation items remain the same */}
        {[
          { icon: Cloud, text: "My Drive", href: "/dashboard" },
          { icon: FolderOutput, text: "Shared Files", href: "#" },
          { icon: Star, text: "Starred", href: "#" },
          { icon: Bell, text: "Notifications", href: "#" },
          { icon: BarChart, text: "Statistics", href: "#" },
          { icon: Trash2, text: "Trash", href: "#" },
        ].map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <item.icon size={20} />
            <span className={`${!isOpen && 'lg:hidden'}`}>{item.text}</span>
          </a>
        ))}
      </nav>

      <div className="mt-auto">
        <div 
          className={`flex items-center ${isOpen ? 'gap-3' : 'lg:justify-center'} p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-label="User menu"
        >
          {loading ? (
            <div className="w-10 h-10 flex items-center justify-center">
              <LoadingSpinner size="small" />
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white text-[#2E86AB] flex items-center justify-center font-bold flex-shrink-0">
                {getInitials(profile?.fullname)}
              </div>
              <div className={`flex-1 min-w-0 ${!isOpen && 'lg:hidden'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium truncate">
                      {profile?.fullname || "User"}
                    </p>
                    <p className="text-xs text-white/80 truncate">
                      {profile?.email || "user@example.com"}
                    </p>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>
              {!isOpen && (
                <ChevronDown 
                  size={16} 
                  className={`lg:block hidden transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              )}
            </>
          )}
        </div>

        {/* Dropdown Menu */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isDropdownOpen ? 'max-h-40' : 'max-h-0'
          }`}
          aria-hidden={!isDropdownOpen}
        >
          <div className="py-1">
            <a href="/profile" className="block px-4 py-2 text-sm hover:bg-white/10">Profile</a>
            <a href="/settings" className="block px-4 py-2 text-sm hover:bg-white/10">Settings</a>
            <a href="#" className="block px-4 py-2 text-sm hover:bg-white/10">Support</a>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full text-left block px-4 py-2 text-sm hover:bg-white/10 text-red-300"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;