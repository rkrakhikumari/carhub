import React from 'react';
import { LogOut } from 'lucide-react';

const NavBar = ({ activeNav, setActiveNav, setCurrentPage, onLogout }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">Car Hub</h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[
              { key: 'home', label: 'Home' },
              { key: 'about', label: 'About Us' },
              { key: 'contact', label: 'Contact Us' },
              { key: 'status', label: 'Car Status' },
              { key: 'drivers', label: 'Drivers' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveNav(item.key);
                  setCurrentPage(item.key);
                }}
                className={`font-medium transition ${
                  activeNav === item.key
                    ? 'text-gray-800 border-b-2 border-gray-800 pb-4'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
