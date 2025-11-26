import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import NavBar from './components/NavBar';
import Home from './components/Pages/Home';
import About from './components/Pages/About';
import Contact from './components/Pages/Contact';
import Drivers from './components/Pages/Drivers';
import Status from './components/Pages/Status';

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
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [newCar, setNewCar] = useState({
    number: '',
    status: 'In Hub',
    driver: '',
    workLocation: 'Hub',
    frontView: null,
    leftView: null,
    rightView: null,
    backView: null,
    driverPhoto: null,
  });

  const [drivers, setDrivers] = useState([
    { uid: 'DR001', name: 'Rajesh Kumar', status: 'On Duty' },
    { uid: 'DR002', name: 'Amit Singh', status: 'On Duty' },
    { uid: 'DR003', name: 'Sunil Sharma', status: 'Off Duty' },
  ]);

  const [cars, setCars] = useState([
    {
      id: 1,
      number: 'DL-01-AB-1234',
      status: 'In Hub',
      driver: '-',
      workLocation: 'Hub',
      frontView: null,
      leftView: null,
      rightView: null,
      backView: null,
      driverPhoto: null,
    },
    {
      id: 2,
      number: 'DL-02-CD-5678',
      status: 'Handover to Driver',
      driver: 'Rajesh Kumar',
      workLocation: 'Home',
      frontView: null,
      leftView: null,
      rightView: null,
      backView: null,
      driverPhoto: null,
    },
    {
      id: 3,
      number: 'DL-03-EF-9012',
      status: 'Out for Maintenance',
      driver: '-',
      workLocation: 'Hub',
      frontView: null,
      leftView: null,
      rightView: null,
      backView: null,
      driverPhoto: null,
    },
    {
      id: 4,
      number: 'DL-04-GH-3456',
      status: 'Handover to Driver',
      driver: 'Amit Singh',
      workLocation: 'Hub',
      frontView: null,
      leftView: null,
      rightView: null,
      backView: null,
      driverPhoto: null,
    },
    {
      id: 5,
      number: 'DL-05-IJ-7890',
      status: 'In Hub',
      driver: '-',
      workLocation: 'Hub',
      frontView: null,
      leftView: null,
      rightView: null,
      backView: null,
      driverPhoto: null,
    },
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
    const car = cars.find(
      (c) => c.number.toLowerCase() === searchCarNumber.toLowerCase()
    );
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
        setNewCar((prev) => ({ ...prev, [photoType]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUploadDetail = (e, photoType) => {
    const file = e.target.files[0];
    if (file && selectedCar) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedCar((prev) => ({ ...prev, [photoType]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateDriverStatus = (driverName, carStatus) => {
    setDrivers((prev) =>
      prev.map((driver) =>
        driver.name === driverName
          ? {
              ...driver,
              status:
                carStatus === 'Handover to Driver' ? 'On Duty' : 'Off Duty',
            }
          : driver
      )
    );
  };

  const handleAddCar = () => {
    if (newCar.number) {
      const car = {
        id: cars.length + 1,
        ...newCar,
      };
      setCars((prev) => [...prev, car]);
      setNewCar({
        number: '',
        status: 'In Hub',
        driver: '',
        workLocation: 'Hub',
        frontView: null,
        leftView: null,
        rightView: null,
        backView: null,
        driverPhoto: null,
      });
      setShowAddCar(false);
      alert('Car added successfully');
    }
  };

  const filteredCars = cars.filter((car) => {
    const matchNumber = car.number
      .toLowerCase()
      .includes(filterNumber.toLowerCase());
    const matchStatus = filterStatus === '' || car.status === filterStatus;
    return matchNumber && matchStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      'In Hub': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Handover to Driver':
        'bg-green-50 text-green-700 border border-green-200',
      'Out for Maintenance':
        'bg-orange-50 text-orange-700 border border-orange-200',
      'Driver operating from Home':
        'bg-purple-50 text-purple-700 border border-purple-200',
    };
    return (
      colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200'
    );
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

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition duration-200"
              >
                Login
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              Demo: Use any email to login
            </p>
          </div>
        </div>
      </div>
    );
  }

  // MAIN SHELL WITH NAVBAR
  return (
    <div>
      <NavBar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
      />

      {currentPage === 'home' && (
        <Home cars={cars} setActiveNav={setActiveNav} setCurrentPage={setCurrentPage} />
      )}

      {currentPage === 'about' && <About />}

      {currentPage === 'contact' && <Contact />}

      {currentPage === 'drivers' && (
        <Drivers
          drivers={drivers}
          showAttendanceModal={showAttendanceModal}
          setShowAttendanceModal={setShowAttendanceModal}
          selectedDriver={selectedDriver}
          setSelectedDriver={setSelectedDriver}
        />
      )}

      {currentPage === 'status' && (
        <Status
          cars={cars}
          setCars={setCars}
          searchCarNumber={searchCarNumber}
          setSearchCarNumber={setSearchCarNumber}
          showCarDetails={showCarDetails}
          setShowCarDetails={setShowCarDetails}
          selectedCar={selectedCar}
          setSelectedCar={setSelectedCar}
          filterNumber={filterNumber}
          setFilterNumber={setFilterNumber}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          showAddCar={showAddCar}
          setShowAddCar={setShowAddCar}
          newCar={newCar}
          setNewCar={setNewCar}
          handleSearchCar={handleSearchCar}
          handleFileUpload={handleFileUpload}
          handleFileUploadDetail={handleFileUploadDetail}
          handleAddCar={handleAddCar}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
};

export default CarHubApp;
