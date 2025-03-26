import { Add, Share } from "@mui/icons-material";

const RecentFiles = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h2 className="text-lg font-semibold mb-4">Recent Files</h2>

      <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
        <p>📄 Project Proposal</p>
        <div className="flex gap-3">
          <p className="text-gray-600 text-sm">Mar 9, 2025 | 2MB</p>
          <button className="text-blue-500"><Add /></button>
          <button className="text-blue-500"><Share /></button>
        </div>
      </div>
    </div>
  );
};

export default RecentFiles;
