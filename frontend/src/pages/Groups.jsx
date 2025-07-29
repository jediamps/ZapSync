import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Search, 
  Users, 
  FileText, 
  Link, 
  ChevronRight,
  Plus,
  Clipboard,
  Check,
  Frown,
  Menu
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  getAvailableGroups, 
  joinGroupWithToken,
  joinGroup 
} from '../services/api';
import GroupCard from '../components/GroupCard';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [joinLink, setJoinLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { toggleSidebar } = useOutletContext();

 
  // Fetch available groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAvailableGroups();
        setGroups(data || []);
        setFilteredGroups(data || []);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError(error.message || 'Failed to load groups');
        toast.error('Could not load groups at this time');
        setGroups([]);
        setFilteredGroups([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery) {
      const results = groups.filter(group => 
        group?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group?.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGroups(results);
    } else {
      setFilteredGroups(groups);
    }
  }, [searchQuery, groups]);

  // Join group with code/link
  const handleJoinWithLink = async () => {
    if (!joinLink.trim()) {
      toast.error('Please enter a join link');
      return;
    }

    try {
      setLoading(true);
      const token = joinLink.includes('token=') 
        ? new URL(joinLink).searchParams.get('token')
        : joinLink;

      await joinGroupWithToken(token);
      toast.success('Successfully joined group!');
      setJoinLink('');
      
      // Refresh groups list
      const data = await getAvailableGroups();
      setGroups(data || []);
      setFilteredGroups(data || []);
    } catch (error) {
      toast.error(error.message || 'Invalid join link');
    } finally {
      setLoading(false);
    }
  };

  // Join group directly
  const handleJoinGroup = async (groupId) => {
    try {
      setLoading(true);
      await joinGroup(groupId);
      toast.success('Successfully joined group!');
      
      // Refresh groups list
      const data = await getAvailableGroups();
      setGroups(data || []);
      setFilteredGroups(data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };
  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Join helper copied to clipboard!');
  };

  // Empty state component
  const renderEmptyState = () => (
    <div className="bg-gray-50 rounded-lg p-8 text-center">
      <div className="flex justify-center mb-4">
        <Frown size={48} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        No groups available
      </h3>
      <p className="text-gray-500 mb-4">
        {searchQuery 
          ? 'No groups match your search'
          : 'There are currently no groups available to join'}
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={() => copyToClipboard(`${window.location.origin}/join-group`)}
          className="inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          {copied ? (
            <>
              <Check size={16} /> Copied!
            </>
          ) : (
            <>
              <Clipboard size={16} /> Copy Join Helper
            </>
          )}
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary-hover)]"
        >
          <ChevronRight size={16} /> Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center mb-6 gap-7">
          <button className="text-gray-600" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Study Groups</h1>
          <p className="text-gray-600">
            Join groups created by your lecturers or peers to access shared files
          </p>
        </div>
        
      </div>

      {/* Join with link section */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Link size={18} className="text-[var(--color-primary)]" />
          Join with Link
        </h2>
        <p className="text-gray-600 mb-4">
          Enter a group join link provided by your lecturer or peer
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={joinLink}
            onChange={(e) => setJoinLink(e.target.value)}
            placeholder="Paste group join link here"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <button
            onClick={handleJoinWithLink}
            disabled={loading || !joinLink.trim()}
            className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
              loading || !joinLink.trim()
                ? 'bg-gray-400'
                : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]'
            }`}
          >
            {loading ? 'Joining...' : 'Join Group'}
          </button>
        </div>
      </div>

      {/* Search and filter */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />
        </div>
      </div>

      {/* Available groups */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users size={20} className="text-[var(--color-primary)]" />
          Available Groups
        </h2>

        {loading && groups.length === 0 ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-lg p-6 text-center border border-red-100">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        ) : filteredGroups.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map(group => (
              <GroupCard
                key={group._id}
                group={group}
                onJoin={() => handleJoinGroup(group._id)}
                loading={loading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Your groups section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText size={20} className="text-[var(--color-primary)]" />
          Your Groups
        </h2>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-4">
            View and manage your joined groups from the main dashboard
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary-hover)] flex items-center gap-2 mx-auto"
          >
            Go to Dashboard <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Groups;