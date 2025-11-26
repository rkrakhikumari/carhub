import React from 'react';

const Home = ({ cars, setActiveNav, setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Car Hub Management
          </h2>
          <p className="text-gray-600 mb-6">
            Manage your vehicle fleet efficiently with our comprehensive
            management system.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-2">Total Cars</h3>
              <p className="text-3xl font-bold text-gray-700">{cars.length}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-2">In Hub</h3>
              <p className="text-3xl font-bold text-blue-600">
                {cars.filter((c) => c.status === 'In Hub').length}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-2">
                Under Maintenance
              </h3>
              <p className="text-3xl font-bold text-orange-600">
                {cars.filter((c) => c.status === 'Out for Maintenance').length}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveNav('status');
              setCurrentPage('status');
            }}
            className="mt-8 bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
          >
            View Car Status →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
