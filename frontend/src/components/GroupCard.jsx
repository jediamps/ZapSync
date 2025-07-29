import { Users, FileText, BookOpen, Clock, ChevronRight } from 'lucide-react';

const GroupCard = ({ group, onJoin, loading }) => {
  // Safe defaults if group is undefined
  if (!group) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-800 truncate">
            {group.name || 'Unnamed Group'}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {(group.members?.length || 0)} members
          </span>
        </div>
        
        {group.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {group.description}
          </p>
        )}
        
        <div className="flex items-center text-sm text-gray-500 mb-4 gap-2">
          <BookOpen size={14} />
          <span>{(group.files?.length || 0)} shared files</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <Clock size={14} />
          <span>
            {group.createdAt ? (
              `Created ${new Date(group.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}`
            ) : 'Recently created'}
          </span>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <button
          onClick={onJoin}
          disabled={loading}
          className={`w-full flex items-center justify-between ${
            loading ? 'text-gray-400' : 'text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]'
          }`}
        >
          <span>{loading ? 'Joining...' : 'Join this group'}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default GroupCard;