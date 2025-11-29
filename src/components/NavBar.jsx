import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';

const NavBar = ({ activeNav, setActiveNav, setCurrentPage, onLogout, navItems, userRole }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleColor = () => {
    if (userRole === 'admin') return 'bg-red-50 border-b border-red-200';
    if (userRole === 'crm') return 'bg-blue-50 border-b border-blue-200';
    return 'bg-green-50 border-b border-green-200';
  };

  const getRoleBadgeColor = () => {
    if (userRole === 'admin') return 'bg-red-100 text-red-700';
    if (userRole === 'crm') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  // Reorder navItems: Attendance first, then Drivers, then others
  const sortedNavItems = navItems.sort((a, b) => {
    const order = { attendance: 0, drivers: 1 };
    return (order[a.key] ?? 2) - (order[b.key] ?? 2);
  });

  return (
    <nav className={`sticky top-0 z-50 ${getRoleColor()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Car Hub</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeColor()}`}>
              {userRole?.toUpperCase()}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {sortedNavItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveNav(item.key);
                  setCurrentPage(item.key);
                }}
                className={`font-medium transition focus:outline-none ${
                  activeNav === item.key
                    ? 'text-gray-800 border-b-2 border-gray-800 pb-4'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-800"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {sortedNavItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveNav(item.key);
                  setCurrentPage(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded ${
                  activeNav === item.key
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;