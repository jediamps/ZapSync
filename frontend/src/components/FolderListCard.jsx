import { Folder, Share2, MoreVertical, Star } from 'lucide-react';

const FolderListCard = ({ title, filesCount, createdDate, users, isStarred }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <div className="p-2 rounded-lg bg-[#E8F4F3] text-[var(--color-primary)]">
          <Folder size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="font-medium text-gray-800 truncate">{title}</h3>
          <p className="text-sm text-gray-500">
            {filesCount} {filesCount === 1 ? 'file' : 'files'} • {createdDate}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {users.slice(0, 3).map((user, index) => (
            <img 
              key={index} 
              src={user} 
              alt="User" 
              className="w-8 h-8 rounded-full border-2 border-white object-cover" 
            />
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-[var(--color-primary)] p-1.5 rounded-full">
            <Share2 size={18} />
          </button>
          <button className={`p-1.5 rounded-full ${isStarred ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-600'}`}>
            <Star size={18} fill={isStarred ? 'currentColor' : 'none'} />
          </button>
          <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderListCard;