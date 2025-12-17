import React from 'react';

const HeaderComp = () => {
  return (
    <header className="bg-green-700 text-white shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Page Title */}
        <div>
          <h1 className="text-xl font-semibold">Delivery Management</h1>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Admin Button */}
          <button className="px-4 py-2 text-sm font-medium text-green-100 hover:text-white hover:bg-green-600 rounded-md transition-colors duration-200">
            Admin
          </button>

          {/* Profile Button */}
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-green-100 hover:text-white hover:bg-green-600 rounded-md transition-colors duration-200">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderComp;