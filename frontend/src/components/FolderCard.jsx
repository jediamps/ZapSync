import { useState, useRef, useEffect } from 'react';
import { 
  MoreVertical, Download, Edit2, Share2, Star, Trash2, Info,
  Copy, UserPlus, Link2, Folder as FolderIcon
} from 'lucide-react';
import styles from '../styles/FolderCard.module.css'; // We'll create this CSS module

const FolderCard = ({ 
  title = 'Untitled Folder', 
  filesCount = 0, 
  createdDate = 'Unknown date', 
  users = [],
  isStarred = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareSubmenuOpen, setIsShareSubmenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsShareSubmenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://example.com/folder/${encodeURIComponent(title)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.folderCard}>
      {/* Folder Header */}
      <div className={styles.folderHeader}>
        <div className={styles.folderTitleContainer}>
          <div className={styles.folderIconContainer}>
            <FolderIcon size={20} className={styles.folderIcon} />
          </div>
          <h3 className={styles.folderTitle}>{title}</h3>
        </div>
        
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={styles.menuButton}
          aria-label="Folder options"
        >
          <MoreVertical size={18} />
        </button>
      </div>
      
      {/* Folder Metadata */}
      <div className={styles.folderMetadata}>
        <div className={styles.fileInfo}>
          <span>{filesCount} {filesCount === 1 ? 'file' : 'files'}</span>
          <span>{createdDate}</span>
        </div>
        
        <div className={styles.footer}>
          <div className={styles.userAvatars}>
            {users.slice(0, 3).map((user, index) => (
              <img 
                key={index} 
                src={user || 'https://via.placeholder.com/40'} 
                alt="User" 
                className={styles.avatar} 
              />
            ))}
            {users.length > 3 && (
              <div className={styles.moreUsers}>+{users.length - 3}</div>
            )}
            <button className={styles.addUserButton}>
              <UserPlus size={16} />
            </button>
          </div>
          
          <button className={`${styles.starButton} ${isStarred ? styles.starred : ''}`}>
            <Star size={18} fill={isStarred ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      
      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div ref={menuRef} className={styles.dropdownMenu}>
          <div className={styles.menuItems}>
            <MenuItem icon={<Download size={16} />} label="Download" />
            <MenuItem icon={<Edit2 size={16} />} label="Rename" />
            
            {/* Share with Submenu */}
            <div className={styles.submenuContainer}>
              <MenuItem 
                icon={<Share2 size={16} />} 
                label="Share" 
                hasArrow 
                onMouseEnter={() => setIsShareSubmenuOpen(true)}
              />
              
              {isShareSubmenuOpen && (
                <div 
                  className={styles.submenu}
                  onMouseLeave={() => setIsShareSubmenuOpen(false)}
                >
                  <MenuItem 
                    icon={<Copy size={16} />} 
                    label={copied ? 'Copied!' : 'Copy link'} 
                    onClick={handleCopyLink}
                  />
                  <MenuItem 
                    icon={<Link2 size={16} />} 
                    label="Share with..." 
                  />
                </div>
              )}
            </div>
            
            <MenuItem 
              icon={<Star size={16} />} 
              label={isStarred ? 'Unstar' : 'Star'} 
            />
            
            <div className={styles.menuDivider}></div>
            
            <MenuItem 
              icon={<Trash2 size={16} />} 
              label="Move to trash" 
              danger
            />
            
            <MenuItem 
              icon={<Info size={16} />} 
              label="Folder info" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon, label, hasArrow = false, danger = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.menuItem} ${danger ? styles.dangerItem : ''}`}
    >
      <span className={styles.menuIcon}>{icon}</span>
      <span className={styles.menuLabel}>{label}</span>
      {hasArrow && <span className={styles.menuArrow}>→</span>}
    </button>
  );
};

export default FolderCard;