import React from "react";

const MobileSidebar = ({ setMobileSidebarOpen }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="w-1/2 bg-white h-full shadow-lg p-4">
        {/* Sidebar content */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="mt-4 p-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MobileSidebar;
