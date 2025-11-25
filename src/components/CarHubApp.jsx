import React, { useState } from 'react';
import { LogOut, Plus, Search, Filter, X, Eye } from 'lucide-react';

const CarHubApp = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [activeNav, setActiveNav] = useState('home');
  const [searchCarNumber, setSearchCarNumber] = useState('');
  const [showCarDetails, setShowCarDetails] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [filterNumber, setFilterNumber] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddCar, setShowAddCar] = useState(false);
  const [newCar, setNewCar] = useState({
    number: '',
    status: 'In Hub',
    driver: '',
    workLocation: 'Hub',
    frontView: null,
    leftView: null,
    rightView: null,
    backView: null,
    driverPhoto: null
  });

  const [cars, setCars] = useState([
    { id: 1, number: 'DL-01-AB-1234', status: 'In Hub', driver: '-', workLocation: 'Hub', frontView: null, leftView: null, rightView: null, backView: null, driverPhoto: null },
    { id: 2, number: 'DL-02-CD-5678', status: 'Handover to Driver', driver: 'Rajesh Kumar', workLocation: 'Home', frontView: null, leftView: null, rightView: null, backView: null, driverPhoto: null },
    { id: 3, number: 'DL-03-EF-9012', status: 'Out for Maintenance', driver: '-', workLocation: 'Hub', frontView: null, leftView: null, rightView: null, backView: null, driverPhoto: null },
    { id: 4, number: 'DL-04-GH-3456', status: 'Handover to Driver', driver: 'Amit Singh', workLocation: 'Hub', frontView: null, leftView: null, rightView: null, backView: null, driverPhoto: null },
    { id: 5, number: 'DL-05-IJ-7890', status: 'In Hub', driver: '-', workLocation: 'Hub', frontView: null, leftView: null, rightView: null, backView: null, driverPhoto: null }
  ]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email) {
      setIsLoggedIn(true);
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
    setEmail('');
  };

  const handleSearchCar = () => {
    const car = cars.find(c => c.number.toLowerCase() === searchCarNumber.toLowerCase());
    if (car) {
      setSelectedCar(car);
      setShowCarDetails(true);
    } else {
      alert('Car not found');
    }
  };

  const handleFileUpload = (e, photoType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCar({ ...newCar, [photoType]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUploadDetail = (e, photoType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedCar({ ...selectedCar, [photoType]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCar = () => {
    if (newCar.number) {
      const car = {
        id: cars.length + 1,
        ...newCar
      };
      setCars([...cars, car]);
      setNewCar({ number: '', status: 'In Hub', driver: '', workLocation: 'Hub', frontView: null, leftView: null, rightView: null, backView: null, driverPhoto: null });
      setShowAddCar(false);
      alert('Car added successfully');
    }
  };

  const filteredCars = cars.filter(car => {
    const matchNumber = car.number.toLowerCase().includes(filterNumber.toLowerCase());
    const matchStatus = filterStatus === '' || car.status === filterStatus;
    return matchNumber && matchStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      'In Hub': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Handover to Driver': 'bg-green-50 text-green-700 border border-green-200',
      'Out for Maintenance': 'bg-orange-50 text-orange-700 border border-orange-200',
      'Driver operating from Home': 'bg-purple-50 text-purple-700 border border-purple-200'
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Car Hub</h1>
              <p className="text-gray-500 mt-2">Management System</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              
              <button
                onClick={handleLogin}
                className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition duration-200"
              >
                Login
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              Demo: Use any email to login
            </p>
          </div>
        </div>
      </div>
    );
  }

  // NAVBAR
  const NavBar = () => (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">Car Hub</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => { setActiveNav('home'); setCurrentPage('home'); }}
              className={`font-medium transition ${activeNav === 'home' ? 'text-gray-800 border-b-2 border-gray-800 pb-4' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Home
            </button>
            <button
              onClick={() => { setActiveNav('about'); setCurrentPage('about'); }}
              className={`font-medium transition ${activeNav === 'about' ? 'text-gray-800 border-b-2 border-gray-800 pb-4' : 'text-gray-600 hover:text-gray-800'}`}
            >
              About Us
            </button>
            <button
              onClick={() => { setActiveNav('contact'); setCurrentPage('contact'); }}
              className={`font-medium transition ${activeNav === 'contact' ? 'text-gray-800 border-b-2 border-gray-800 pb-4' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Contact Us
            </button>
            <button
              onClick={() => { setActiveNav('status'); setCurrentPage('status'); }}
              className={`font-medium transition ${activeNav === 'status' ? 'text-gray-800 border-b-2 border-gray-800 pb-4' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Car Status
            </button>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );

  // HOME PAGE
  if (currentPage === 'home') {
    return (
      <div>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Car Hub Management</h2>
              <p className="text-gray-600 mb-6">Manage your vehicle fleet efficiently with our comprehensive management system.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-2">Total Cars</h3>
                  <p className="text-3xl font-bold text-gray-700">{cars.length}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-2">In Hub</h3>
                  <p className="text-3xl font-bold text-blue-600">{cars.filter(c => c.status === 'In Hub').length}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-2">Under Maintenance</h3>
                  <p className="text-3xl font-bold text-orange-600">{cars.filter(c => c.status === 'Out for Maintenance').length}</p>
                </div>
              </div>

              <button
                onClick={() => { setActiveNav('status'); setCurrentPage('status'); }}
                className="mt-8 bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
              >
                View Car Status →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ABOUT US PAGE
  if (currentPage === 'about') {
    return (
      <div>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
              <div className="space-y-4 text-gray-700">
                <p>Car Hub Management System is a comprehensive solution designed to streamline vehicle fleet management operations.</p>
                <p>Our platform provides real-time tracking, maintenance management, and driver coordination in one unified interface.</p>
                <p>With years of expertise in logistics and vehicle management, we deliver reliable solutions for modern fleet operations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CONTACT US PAGE
  if (currentPage === 'contact') {
    return (
      <div>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Email:</strong> support@carhub.com</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> New Delhi, India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CAR STATUS PAGE
  if (currentPage === 'status') {
    return (
      <div>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {showCarDetails && selectedCar ? (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <button
                  onClick={() => setShowCarDetails(false)}
                  className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  ← Back to List
                </button>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Car Details: {selectedCar.number}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Car Number</label>
                    <input type="text" value={selectedCar.number} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name</label>
                    <input type="text" value={selectedCar.driver} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <input type="text" value={selectedCar.status} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Location</label>
                    <input type="text" value={selectedCar.workLocation} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Car Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedCar.frontView ? (
                      <img src={selectedCar.frontView} alt="Front" className="h-40 rounded-lg object-cover" />
                    ) : (
                      <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-500">Front View</div>
                    )}
                    {selectedCar.leftView ? (
                      <img src={selectedCar.leftView} alt="Left" className="h-40 rounded-lg object-cover" />
                    ) : (
                      <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-500">Left View</div>
                    )}
                    {selectedCar.rightView ? (
                      <img src={selectedCar.rightView} alt="Right" className="h-40 rounded-lg object-cover" />
                    ) : (
                      <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-500">Right View</div>
                    )}
                    {selectedCar.backView ? (
                      <img src={selectedCar.backView} alt="Back" className="h-40 rounded-lg object-cover" />
                    ) : (
                      <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-500">Back View</div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Driver Photo with Car</h3>
                  {selectedCar.driverPhoto ? (
                    <img src={selectedCar.driverPhoto} alt="Driver" className="h-48 rounded-lg object-cover w-full" />
                  ) : (
                    <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center text-gray-500">Driver Photo with Car</div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {/* Search Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Search Car Status</h3>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <input
                      type="text"
                      value={searchCarNumber}
                      onChange={(e) => setSearchCarNumber(e.target.value)}
                      placeholder="Enter Car Number (e.g., DL-01-AB-1234)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <button
                      onClick={handleSearchCar}
                      className="flex items-center gap-2 bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                      <Search size={18} />
                      Search
                    </button>
                  </div>
                </div>

                {/* Cars in Hub Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h3 className="text-xl font-bold text-gray-800">Cars in Hub</h3>
                    <button
                      onClick={() => setShowAddCar(true)}
                      className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                      <Plus size={18} />
                      Add Car
                    </button>
                  </div>

                  {/* Filter Section */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Filter size={18} className="text-gray-600" />
                      <span className="font-medium text-gray-700">Filters</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={filterNumber}
                        onChange={(e) => setFilterNumber(e.target.value)}
                        placeholder="Filter by number plate"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                      />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                      >
                        <option value="">All Status</option>
                        <option value="In Hub">In Hub</option>
                        <option value="Handover to Driver">Handover to Driver</option>
                        <option value="Out for Maintenance">Out for Maintenance</option>
                        <option value="Driver operating from Home">Driver operating from Home</option>
                      </select>
                    </div>
                  </div>

                  {/* Cars Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-300">
                          <th className="text-left py-3 px-4 font-bold text-gray-700">Car Number</th>
                          <th className="text-left py-3 px-4 font-bold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-bold text-gray-700">Driver Name</th>
                          <th className="text-left py-3 px-4 font-bold text-gray-700">Work Location</th>
                          <th className="text-left py-3 px-4 font-bold text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCars.map((car) => (
                          <tr key={car.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                            <td className="py-4 px-4 text-gray-800 font-medium">{car.number}</td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(car.status)}`}>
                                {car.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-700">{car.driver}</td>
                            <td className="py-4 px-4 text-gray-700">{car.workLocation}</td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => {
                                  setSelectedCar(car);
                                  setShowCarDetails(true);
                                }}
                                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
                              >
                                <Eye size={18} />
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredCars.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No cars found matching your filters
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Car Modal */}
        {/* Add Car Modal */}
{showAddCar && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-bold text-gray-800">Add New Car</h3>
        <button onClick={() => setShowAddCar(false)} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      {/* 2 Column Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Column 1 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Car Number</label>
            <input
              type="text"
              value={newCar.number}
              onChange={(e) => setNewCar({ ...newCar, number: e.target.value })}
              placeholder="DL-01-AB-1234"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
            <select
              value={newCar.status}
              onChange={(e) => setNewCar({ ...newCar, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
            >
              <option value="In Hub">In Hub</option>
              <option value="Handover to Driver">Handover to Driver</option>
              <option value="Out for Maintenance">Out for Maintenance</option>
              <option value="Driver operating from Home">Driver operating from Home</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
            <input
              type="text"
              value={newCar.driver}
              onChange={(e) => setNewCar({ ...newCar, driver: e.target.value })}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
            <select
              value={newCar.workLocation}
              onChange={(e) => setNewCar({ ...newCar, workLocation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
            >
              <option value="Hub">Hub</option>
              <option value="Home">Home</option>
            </select>
          </div>
        </div>

        {/* Column 2 (Photos) */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-800 mb-2">Car Photos</h4>

          {[
            { label: "Front View", key: "frontView" },
            { label: "Left View", key: "leftView" },
            { label: "Right View", key: "rightView" },
            { label: "Back View", key: "backView" },
            { label: "Driver Photo with Car", key: "driverPhoto" }
          ].map((item) => (
            <div key={item.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, item.key)}
                className="w-full text-sm"
              />
              {newCar[item.key] && (
                <p className="text-xs text-green-600 mt-1">✓ Image uploaded</p>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowAddCar(false)}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleAddCar}
          className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          Add Car
        </button>
      </div>

    </div>
  </div>
)}

      </div>
    );
  }
};

export default CarHubApp;