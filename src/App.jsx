import React, { useState } from 'react';
import NavBar from './components/NavBar';
import LoginPage from './components/Pages/LoginPage';
import Home from './components/Pages/Home';
import About from './components/Pages/About';
import Contact from './components/Pages/Contact';
import Drivers from './components/Pages/Drivers';
import Status from './components/Pages/Status';
import Attendance from './components/Pages/Attendance';

const CarHubApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin', 'crm', 'user'
  const [currentPage, setCurrentPage] = useState('home');
  const [activeNav, setActiveNav] = useState('home');
  const [searchCarNumber, setSearchCarNumber] = useState('');
  const [showCarDetails, setShowCarDetails] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [filterNumber, setFilterNumber] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddCar, setShowAddCar] = useState(false);
  const [attendance, setAttendance] = useState([]);

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
    { uid: 'DR001', name: 'Rajesh Kumar', status: 'On Duty', vehicle: 'DL-02-CD-5678' },
    { uid: 'DR002', name: 'Amit Singh', status: 'On Duty', vehicle: 'DL-04-GH-3456' },
    { uid: 'DR003', name: 'Sunil Sharma', status: 'Off Duty', vehicle: '-' },
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

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentPage('home');
    setActiveNav('home');
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

  const getStatusColor = (status) => {
    const colors = {
      'In Hub': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Handover to Driver': 'bg-green-50 text-green-700 border border-green-200',
      'Out for Maintenance': 'bg-orange-50 text-orange-700 border border-orange-200',
      'Driver operating from Home': 'bg-purple-50 text-purple-700 border border-purple-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // CRM role restricted navigation
  const getNavItems = () => {
    if (userRole === 'crm') {
      return [
        { key: 'drivers', label: 'Drivers' },
        { key: 'attendance', label: 'Attendance' },
      ];
    }
    return [
      { key: 'home', label: 'Home' },
      { key: 'status', label: 'Car Status' },
      { key: 'drivers', label: 'Drivers' },
      { key: 'attendance', label: 'Attendance' },
      { key: 'about', label: 'About Us' },
      { key: 'contact', label: 'Contact Us' },
    ];
  };

  return (
    <div>
      <NavBar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
        navItems={getNavItems()}
        userRole={userRole}
      />

      {currentPage === 'home' && userRole !== 'crm' && (
        <Home cars={cars} setActiveNav={setActiveNav} setCurrentPage={setCurrentPage} />
      )}

      {currentPage === 'about' && userRole !== 'crm' && <About />}

      {currentPage === 'contact' && userRole !== 'crm' && <Contact />}

      {currentPage === 'drivers' && (
        <Drivers drivers={drivers} userRole={userRole} setDrivers={setDrivers} cars={cars} setCars={setCars} />
      )}

      {currentPage === 'status' && userRole !== 'crm' && (
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
          userRole={userRole}
        />
      )}

      {currentPage === 'attendance' && (
        <Attendance
          cars={cars}
          drivers={drivers}
          attendance={attendance}
          setAttendance={setAttendance}
          userRole={userRole}
          setCars={setCars}
        />
      )}
    </div>
  );
};

export default CarHubApp;