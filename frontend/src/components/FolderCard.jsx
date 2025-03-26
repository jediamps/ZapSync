const FolderCard = ({ title, filesCount, createdDate, users }) => {
    return (
      <div className="bg-[#A1D2CE] p-4 rounded-lg shadow-md w-64">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2 mt-2">
          {users.map((user, index) => (
            <img key={index} src={user} alt="user" className="w-6 h-6 rounded-full border" />
          ))}
        </div>
        <p className="text-sm text-gray-700 mt-2">{filesCount} files</p>
        <p className="text-sm text-gray-500">Created on {createdDate}</p>
      </div>
    );
  };
  
  export default FolderCard;
  